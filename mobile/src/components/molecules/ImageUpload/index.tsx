import React, {memo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {launchImageLibrary, launchCamera, Asset} from 'react-native-image-picker';
import {Camera, Image as ImageIcon, X, Upload} from 'lucide-react-native';
import {Text} from '@/components/atoms/Text';
import {Spinner} from '@/components/atoms/Spinner';
import {styles} from './styles';

interface IImageUploadProps {
  value?: string;
  onChange: (uri: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  disabled?: boolean;
  uploading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ImageUpload = memo<IImageUploadProps>(
  ({
    value,
    onChange,
    onRemove,
    placeholder = 'Agregar foto',
    disabled = false,
    uploading = false,
    style,
  }) => {
    const handleSelectImage = () => {
      Alert.alert(
        'Seleccionar foto',
        'Elige una opción',
        [
          {
            text: 'Cámara',
            onPress: () => openCamera(),
          },
          {
            text: 'Galería',
            onPress: () => openGallery(),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    };

    const openCamera = async () => {
      try {
        const result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
        });

        if (result.assets && result.assets[0]) {
          handleImageSelected(result.assets[0]);
        }
      } catch (error) {
        console.error('Error opening camera:', error);
      }
    };

    const openGallery = async () => {
      try {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
        });

        if (result.assets && result.assets[0]) {
          handleImageSelected(result.assets[0]);
        }
      } catch (error) {
        console.error('Error opening gallery:', error);
      }
    };

    const handleImageSelected = (asset: Asset) => {
      if (asset.uri) {
        onChange(asset.uri);
      }
    };

    const handleRemove = () => {
      Alert.alert(
        'Eliminar foto',
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
              if (onRemove) {
                onRemove();
              } else {
                onChange('');
              }
            },
          },
        ],
      );
    };

    if (value) {
      return (
        <View style={[styles.container, style]}>
          <View style={styles.imageContainer}>
            <Image source={{uri: value}} style={styles.image} />
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <Spinner size="large" />
                <Text variant="caption" style={styles.uploadingText}>
                  Subiendo...
                </Text>
              </View>
            )}
            {!disabled && !uploading && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemove}
                activeOpacity={0.8}>
                <X size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={[styles.uploadButton, disabled && styles.disabled]}
          onPress={handleSelectImage}
          disabled={disabled || uploading}
          activeOpacity={0.7}>
          {uploading ? (
            <>
              <Spinner size="medium" />
              <Text variant="body" style={styles.uploadText}>
                Subiendo...
              </Text>
            </>
          ) : (
            <>
              <Upload size={32} color="#9CA3AF" />
              <Text variant="body" style={styles.uploadText}>
                {placeholder}
              </Text>
              <Text variant="caption" color="textSecondary">
                Toca para seleccionar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  },
);
