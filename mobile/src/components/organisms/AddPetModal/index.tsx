import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {X, Camera, Image as ImageIcon} from 'lucide-react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';
import {Text} from '@/components/atoms/Text';
import {styles} from './styles';
import {theme} from '@/theme';
import {CreatePetRequest, Pet, PetType, PetSize, PetGender, EnergyLevel} from '@/types/pet.types';
import {useCreatePet} from '@/hooks/api/useCreatePet';
import {useUpdatePet} from '@/hooks/api/useUpdatePet';
import {useUploadPetImage} from '@/hooks/api/useUploadPetImage';
import {
  translatePetType,
  translatePetSize,
  translatePetGender,
  translateEnergyLevel,
} from '@/utils/petTranslations';

interface AddPetModalProps {
  visible: boolean;
  onClose: () => void;
  pet?: Pet | null;
}

// Validation Schema - only required fields
const petValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre de la mascota es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: Yup.string()
    .required('El tipo de mascota es requerido')
    .oneOf(Object.values(PetType), 'Tipo de mascota inválido'),
  size: Yup.string()
    .required('El tamaño es requerido')
    .oneOf(Object.values(PetSize), 'Tamaño inválido'),
  gender: Yup.string()
    .required('El género es requerido')
    .oneOf(Object.values(PetGender), 'Género inválido'),
});

export const AddPetModal: React.FC<AddPetModalProps> = ({visible, onClose, pet}) => {
  const isEditing = !!pet;
  // For editing: store server URLs, for creating: store local URIs
  const [selectedImages, setSelectedImages] = useState<string[]>(pet?.photos || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update photos when pet changes (for editing)
  useEffect(() => {
    if (pet?.photos) {
      setSelectedImages(pet.photos);
    } else {
      setSelectedImages([]);
    }
  }, [pet]);

  const createPet = useCreatePet({
    onSuccess: () => {
      setSelectedImages([]);
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create pet:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'No se pudo crear la mascota');
    },
  });

  const updatePet = useUpdatePet({
    onSuccess: () => {
      setSelectedImages([]);
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update pet:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'No se pudo actualizar la mascota');
    },
  });

  const uploadImageMutation = useUploadPetImage();

  const handleImagePicker = () => {
    Alert.alert(
      'Agregar Foto',
      'Selecciona una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: () => handleLaunchCamera(),
        },
        {
          text: 'Elegir de Galería',
          onPress: () => handleLaunchLibrary(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const handleLaunchCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });
      handleImageResponse(result);
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const handleLaunchLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });
      handleImageResponse(result);
    } catch (error) {
      console.error('Library error:', error);
    }
  };

  const handleImageResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Error al seleccionar imagen');
      return;
    }

    const asset = response.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    // Just store the local URI - will upload on form submit
    setSelectedImages(prev => [...prev, asset.uri]);
  };

  const handleRemovePhoto = (photoUrl: string) => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setSelectedImages(prev => prev.filter(url => url !== photoUrl));
          },
        },
      ],
    );
  };

  const initialValues: CreatePetRequest = {
    name: pet?.name || '',
    type: pet?.type || PetType.DOG,
    breed: pet?.breed || '',
    size: pet?.size || PetSize.MEDIUM,
    gender: pet?.gender || PetGender.UNKNOWN,
    age: pet?.age || undefined,
    weight: pet?.weight || undefined,
    isVaccinated: pet?.isVaccinated || false,
    isNeutered: pet?.isNeutered || false,
    microchipId: pet?.microchipId || '',
    allergies: pet?.allergies || '',
    medications: pet?.medications || '',
    specialNeeds: pet?.specialNeeds || '',
    vetName: pet?.vetName || '',
    vetPhone: pet?.vetPhone || '',
    vetAddress: pet?.vetAddress || '',
    energyLevel: pet?.energyLevel || undefined,
    isFriendlyWithDogs: pet?.isFriendlyWithDogs ?? true,
    isFriendlyWithCats: pet?.isFriendlyWithCats ?? true,
    isFriendlyWithKids: pet?.isFriendlyWithKids ?? true,
    trainingLevel: pet?.trainingLevel || '',
    favoriteActivities: pet?.favoriteActivities || '',
    preferredWalkDuration: pet?.preferredWalkDuration || undefined,
    preferredWalkFrequency: pet?.preferredWalkFrequency || '',
    specialInstructions: pet?.specialInstructions || '',
  };

  const handleSubmit = async (values: CreatePetRequest) => {
    setIsSubmitting(true);

    try {
      // Upload all local images first
      const uploadedUrls: string[] = [];

      for (const imageUri of selectedImages) {
        // Skip if it's already a server URL (for editing existing pets)
        if (imageUri.startsWith('http') || imageUri.startsWith('/uploads')) {
          uploadedUrls.push(imageUri);
        } else {
          // Upload local image
          try {
            const result = await uploadImageMutation.mutateAsync(imageUri);
            uploadedUrls.push(result.url);
          } catch (error) {
            console.error('Failed to upload image:', error);
            Alert.alert('Error', 'No se pudo subir una de las fotos');
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Clean up empty strings to undefined for optional fields
      const cleanValues = {
        ...values,
        photos: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        breed: values.breed || undefined,
        microchipId: values.microchipId || undefined,
        allergies: values.allergies || undefined,
        medications: values.medications || undefined,
        specialNeeds: values.specialNeeds || undefined,
        vetName: values.vetName || undefined,
        vetPhone: values.vetPhone || undefined,
        vetAddress: values.vetAddress || undefined,
        trainingLevel: values.trainingLevel || undefined,
        favoriteActivities: values.favoriteActivities || undefined,
        preferredWalkFrequency: values.preferredWalkFrequency || undefined,
        specialInstructions: values.specialInstructions || undefined,
      };

      if (isEditing && pet) {
        updatePet.mutate({id: pet.id, data: cleanValues});
      } else {
        createPet.mutate(cleanValues);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Ocurrió un error al guardar la mascota');
    }
  };

  const isLoading = createPet.isPending || updatePet.isPending || isSubmitting;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="h2" style={styles.title}>
              {isEditing ? 'Editar Mascota' : 'Agregar Mascota'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={petValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit: formikSubmit,
              setFieldValue,
            }) => (
              <>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {/* ========== PHOTOS ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Fotos
                  </Text>

                  <View style={styles.formGroup}>
                    <View style={styles.photosContainer}>
                      {selectedImages.map((imageUri, index) => {
                        // For local URIs, use directly. For server URLs, construct full URL
                        const displayUri = imageUri.startsWith('file://') || imageUri.startsWith('content://')
                          ? imageUri
                          : imageUri.startsWith('http')
                          ? imageUri
                          : `http://127.0.0.1:3000${imageUri}`;

                        return (
                          <View key={index} style={styles.photoWrapper}>
                            <Image
                              source={{uri: displayUri}}
                              style={styles.photoThumbnail}
                            />
                            <TouchableOpacity
                              style={styles.removePhotoButton}
                              onPress={() => handleRemovePhoto(imageUri)}
                            >
                              <X size={16} color={theme.colors.surface} />
                            </TouchableOpacity>
                          </View>
                        );
                      })}

                      <TouchableOpacity
                        style={styles.addPhotoButton}
                        onPress={handleImagePicker}
                        disabled={isLoading}
                      >
                        {isLoading && selectedImages.length === 0 ? (
                          <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                          <>
                            <Camera size={32} color={theme.colors.primary} />
                            <Text variant="caption" color="primary" style={styles.addPhotoText}>
                              Agregar Foto
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ========== BASIC INFORMATION ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Información Básica
                  </Text>

                  {/* Name */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Nombre de la Mascota *
                    </Text>
                    <TextInput
                      style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                      placeholder="ej., Max"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />
                    {touched.name && errors.name && (
                      <Text variant="caption" color="error" style={styles.errorText}>
                        {errors.name}
                      </Text>
                    )}
                  </View>

                  {/* Tipo de Mascota */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Tipo de Mascota *
                    </Text>
                    <View style={styles.buttonGroup}>
                      {[PetType.DOG, PetType.CAT, PetType.BIRD, PetType.OTHER].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.optionButton,
                            values.type === type && styles.optionButtonActive,
                          ]}
                          onPress={() => setFieldValue('type', type)}
                        >
                          <Text
                            variant="caption"
                            style={[
                              styles.optionButtonText,
                              values.type === type && styles.optionButtonTextActive,
                            ]}
                          >
                            {translatePetType(type)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Raza */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Raza
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Golden Retriever"
                      value={values.breed}
                      onChangeText={handleChange('breed')}
                      onBlur={handleBlur('breed')}
                    />
                  </View>

                  {/* Tamaño */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Tamaño *
                    </Text>
                    <View style={styles.buttonGroup}>
                      {Object.values(PetSize).map((size) => (
                        <TouchableOpacity
                          key={size}
                          style={[
                            styles.optionButton,
                            values.size === size && styles.optionButtonActive,
                          ]}
                          onPress={() => setFieldValue('size', size)}
                        >
                          <Text
                            variant="caption"
                            style={[
                              styles.optionButtonText,
                              values.size === size && styles.optionButtonTextActive,
                            ]}
                          >
                            {translatePetSize(size)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Género */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Género *
                    </Text>
                    <View style={styles.buttonGroup}>
                      {Object.values(PetGender).map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.optionButton,
                            values.gender === gender && styles.optionButtonActive,
                          ]}
                          onPress={() => setFieldValue('gender', gender)}
                        >
                          <Text
                            variant="caption"
                            style={[
                              styles.optionButtonText,
                              values.gender === gender && styles.optionButtonTextActive,
                            ]}
                          >
                            {translatePetGender(gender)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Age and Weight */}
                  <View style={styles.row}>
                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Edad (años)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="ej., 3"
                        value={values.age?.toString() || ''}
                        onChangeText={(text) => setFieldValue('age', text ? parseInt(text) : undefined)}
                        onBlur={handleBlur('age')}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Peso (kg)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="ej., 25"
                        value={values.weight?.toString() || ''}
                        onChangeText={(text) => setFieldValue('weight', text ? parseFloat(text) : undefined)}
                        onBlur={handleBlur('weight')}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>

                  {/* ========== MEDICAL INFORMATION ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Información Médica
                  </Text>

                  {/* Checkboxes */}
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setFieldValue('isVaccinated', !values.isVaccinated)}
                  >
                    <View style={[styles.checkbox, values.isVaccinated && styles.checkboxChecked]}>
                      {values.isVaccinated && <View style={styles.checkboxInner} />}
                    </View>
                    <Text variant="body" style={styles.checkboxLabel}>
                      Vacunado
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setFieldValue('isNeutered', !values.isNeutered)}
                  >
                    <View style={[styles.checkbox, values.isNeutered && styles.checkboxChecked]}>
                      {values.isNeutered && <View style={styles.checkboxInner} />}
                    </View>
                    <Text variant="body" style={styles.checkboxLabel}>
                      Castrado/Esterilizado
                    </Text>
                  </TouchableOpacity>

                  {/* ID de Microchip */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      ID de Microchip
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., 123456789"
                      value={values.microchipId}
                      onChangeText={handleChange('microchipId')}
                      onBlur={handleBlur('microchipId')}
                    />
                  </View>

                  {/* Alergias */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Alergias
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Pollo, trigo"
                      value={values.allergies}
                      onChangeText={handleChange('allergies')}
                      onBlur={handleBlur('allergies')}
                      multiline
                    />
                  </View>

                  {/* Medications */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Medicamentos Actuales
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Antiparasitario mensual"
                      value={values.medications}
                      onChangeText={handleChange('medications')}
                      onBlur={handleBlur('medications')}
                      multiline
                    />
                  </View>

                  {/* Necesidades Especiales */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Necesidades Especiales
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Artritis, necesita rampa para escaleras"
                      value={values.specialNeeds}
                      onChangeText={handleChange('specialNeeds')}
                      onBlur={handleBlur('specialNeeds')}
                      multiline
                    />
                  </View>

                  {/* ========== VETERINARY CONTACT ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Contacto Veterinario
                  </Text>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Nombre del Veterinario
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Dr. García"
                      value={values.vetName}
                      onChangeText={handleChange('vetName')}
                      onBlur={handleBlur('vetName')}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Teléfono del Veterinario
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., +54 11 1234-5678"
                      value={values.vetPhone}
                      onChangeText={handleChange('vetPhone')}
                      onBlur={handleBlur('vetPhone')}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Dirección del Veterinario
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Av. Santa Fe 1234, Buenos Aires"
                      value={values.vetAddress}
                      onChangeText={handleChange('vetAddress')}
                      onBlur={handleBlur('vetAddress')}
                      multiline
                    />
                  </View>

                  {/* ========== BEHAVIOR & PREFERENCES ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Comportamiento y Preferencias
                  </Text>

                  {/* Nivel de Energía */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Nivel de Energía
                    </Text>
                    <View style={styles.buttonGroup}>
                      {Object.values(EnergyLevel).map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.optionButton,
                            values.energyLevel === level && styles.optionButtonActive,
                          ]}
                          onPress={() => setFieldValue('energyLevel', level)}
                        >
                          <Text
                            variant="caption"
                            style={[
                              styles.optionButtonText,
                              values.energyLevel === level && styles.optionButtonTextActive,
                            ]}
                          >
                            {translateEnergyLevel(level)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Friendly checkboxes */}
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setFieldValue('isFriendlyWithDogs', !values.isFriendlyWithDogs)}
                  >
                    <View style={[styles.checkbox, values.isFriendlyWithDogs && styles.checkboxChecked]}>
                      {values.isFriendlyWithDogs && <View style={styles.checkboxInner} />}
                    </View>
                    <Text variant="body" style={styles.checkboxLabel}>
                      Amigable con perros
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setFieldValue('isFriendlyWithCats', !values.isFriendlyWithCats)}
                  >
                    <View style={[styles.checkbox, values.isFriendlyWithCats && styles.checkboxChecked]}>
                      {values.isFriendlyWithCats && <View style={styles.checkboxInner} />}
                    </View>
                    <Text variant="body" style={styles.checkboxLabel}>
                      Amigable con gatos
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setFieldValue('isFriendlyWithKids', !values.isFriendlyWithKids)}
                  >
                    <View style={[styles.checkbox, values.isFriendlyWithKids && styles.checkboxChecked]}>
                      {values.isFriendlyWithKids && <View style={styles.checkboxInner} />}
                    </View>
                    <Text variant="body" style={styles.checkboxLabel}>
                      Amigable con niños
                    </Text>
                  </TouchableOpacity>

                  {/* Nivel de Entrenamiento */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Nivel de Entrenamiento
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Básico, Avanzado, Ninguno"
                      value={values.trainingLevel}
                      onChangeText={handleChange('trainingLevel')}
                      onBlur={handleBlur('trainingLevel')}
                    />
                  </View>

                  {/* Actividades Favoritas */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Actividades Favoritas
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ej., Jugar a buscar, nadar"
                      value={values.favoriteActivities}
                      onChangeText={handleChange('favoriteActivities')}
                      onBlur={handleBlur('favoriteActivities')}
                      multiline
                    />
                  </View>

                  {/* ========== WALK PREFERENCES ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Preferencias de Paseo
                  </Text>

                  <View style={styles.row}>
                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Duración (min)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="ej., 30"
                        value={values.preferredWalkDuration?.toString() || ''}
                        onChangeText={(text) => setFieldValue('preferredWalkDuration', text ? parseInt(text) : undefined)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Frecuencia
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="ej., Dos veces al día"
                        value={values.preferredWalkFrequency}
                        onChangeText={handleChange('preferredWalkFrequency')}
                      />
                    </View>
                  </View>

                  {/* ========== SPECIAL INSTRUCTIONS ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Instrucciones Especiales
                  </Text>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Instrucciones para Cuidadores
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="ej., Necesita comer a las 8am y 6pm, no le gustan los ruidos fuertes"
                      value={values.specialInstructions}
                      onChangeText={handleChange('specialInstructions')}
                      onBlur={handleBlur('specialInstructions')}
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  <View style={{height: 20}} />
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={onClose}
                    disabled={isLoading}
                  >
                    <Text variant="body" style={styles.buttonSecondaryText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={() => formikSubmit()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text variant="body" style={styles.buttonPrimaryText}>
                        {isEditing ? 'Actualizar' : 'Agregar Mascota'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
