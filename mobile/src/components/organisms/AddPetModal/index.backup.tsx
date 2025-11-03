import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {X} from 'lucide-react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Text} from '@/components/atoms/Text';
import {styles} from './styles';
import {theme} from '@/theme';
import {CreatePetRequest, Pet, PetType, PetSize, PetGender, EnergyLevel} from '@/types/pet.types';
import {useCreatePet} from '@/hooks/api/useCreatePet';
import {useUpdatePet} from '@/hooks/api/useUpdatePet';

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

  const createPet = useCreatePet({
    onSuccess: () => {
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create pet:', error);
    },
  });

  const updatePet = useUpdatePet({
    onSuccess: () => {
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update pet:', error);
    },
  });

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

  const handleSubmit = (values: CreatePetRequest) => {
    // Clean up empty strings to undefined for optional fields
    const cleanValues = {
      ...values,
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
  };

  const isLoading = createPet.isPending || updatePet.isPending;

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
              {isEditing ? 'Edit Pet' : 'Add Pet'}
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
                  {/* ========== BASIC INFORMATION ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Basic Information
                  </Text>

                  {/* Name */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Pet Name *
                    </Text>
                    <TextInput
                      style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                      placeholder="e.g., Max"
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

                  {/* Pet Type */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Pet Type *
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
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Breed */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Breed
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Golden Retriever"
                      value={values.breed}
                      onChangeText={handleChange('breed')}
                      onBlur={handleBlur('breed')}
                    />
                  </View>

                  {/* Size */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Size *
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
                            {size.replace('_', ' ')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Gender */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Gender *
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
                            {gender}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Age and Weight */}
                  <View style={styles.row}>
                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Age (years)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 3"
                        value={values.age?.toString() || ''}
                        onChangeText={(text) => setFieldValue('age', text ? parseInt(text) : undefined)}
                        onBlur={handleBlur('age')}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Weight (kg)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 25"
                        value={values.weight?.toString() || ''}
                        onChangeText={(text) => setFieldValue('weight', text ? parseFloat(text) : undefined)}
                        onBlur={handleBlur('weight')}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>

                  {/* ========== MEDICAL INFORMATION ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Medical Information
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
                      Vaccinated
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
                      Neutered/Spayed
                    </Text>
                  </TouchableOpacity>

                  {/* Microchip ID */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Microchip ID
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 123456789"
                      value={values.microchipId}
                      onChangeText={handleChange('microchipId')}
                      onBlur={handleBlur('microchipId')}
                    />
                  </View>

                  {/* Allergies */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Allergies
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Chicken, wheat"
                      value={values.allergies}
                      onChangeText={handleChange('allergies')}
                      onBlur={handleBlur('allergies')}
                      multiline
                    />
                  </View>

                  {/* Medications */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Current Medications
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Heartgard monthly"
                      value={values.medications}
                      onChangeText={handleChange('medications')}
                      onBlur={handleBlur('medications')}
                      multiline
                    />
                  </View>

                  {/* Special Needs */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Special Needs
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Arthritis, needs ramp for stairs"
                      value={values.specialNeeds}
                      onChangeText={handleChange('specialNeeds')}
                      onBlur={handleBlur('specialNeeds')}
                      multiline
                    />
                  </View>

                  {/* ========== VETERINARY CONTACT ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Veterinary Contact
                  </Text>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Veterinarian Name
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Dr. Smith"
                      value={values.vetName}
                      onChangeText={handleChange('vetName')}
                      onBlur={handleBlur('vetName')}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Veterinarian Phone
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., +54 11 1234-5678"
                      value={values.vetPhone}
                      onChangeText={handleChange('vetPhone')}
                      onBlur={handleBlur('vetPhone')}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Veterinarian Address
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Av. Santa Fe 1234, Buenos Aires"
                      value={values.vetAddress}
                      onChangeText={handleChange('vetAddress')}
                      onBlur={handleBlur('vetAddress')}
                      multiline
                    />
                  </View>

                  {/* ========== BEHAVIOR & PREFERENCES ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Behavior & Preferences
                  </Text>

                  {/* Energy Level */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Energy Level
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
                            {level.replace('_', ' ')}
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
                      Friendly with dogs
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
                      Friendly with cats
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
                      Friendly with kids
                    </Text>
                  </TouchableOpacity>

                  {/* Training Level */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Training Level
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Basic, Advanced, None"
                      value={values.trainingLevel}
                      onChangeText={handleChange('trainingLevel')}
                      onBlur={handleBlur('trainingLevel')}
                    />
                  </View>

                  {/* Favorite Activities */}
                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Favorite Activities
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Playing fetch, swimming"
                      value={values.favoriteActivities}
                      onChangeText={handleChange('favoriteActivities')}
                      onBlur={handleBlur('favoriteActivities')}
                      multiline
                    />
                  </View>

                  {/* ========== WALK PREFERENCES ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Walk Preferences
                  </Text>

                  <View style={styles.row}>
                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Duration (min)
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 30"
                        value={values.preferredWalkDuration?.toString() || ''}
                        onChangeText={(text) => setFieldValue('preferredWalkDuration', text ? parseInt(text) : undefined)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.formGroup, styles.halfWidth]}>
                      <Text variant="body" style={styles.label}>
                        Frequency
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., Twice daily"
                        value={values.preferredWalkFrequency}
                        onChangeText={handleChange('preferredWalkFrequency')}
                      />
                    </View>
                  </View>

                  {/* ========== SPECIAL INSTRUCTIONS ========== */}
                  <Text variant="h3" style={styles.sectionTitle}>
                    Special Instructions
                  </Text>

                  <View style={styles.formGroup}>
                    <Text variant="body" style={styles.label}>
                      Instructions for Caregivers
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="e.g., Needs to be fed at 8am and 6pm, doesn't like loud noises"
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
                      Cancel
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
                        {isEditing ? 'Update' : 'Add Pet'}
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
