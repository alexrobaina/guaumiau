import React, { useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '@/lib/colors';
import { TrainingPlan } from '@/lib/services/trainingPlanService';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

interface ShareTemplateModalProps {
  visible: boolean;
  template: TrainingPlan | null;
  onClose: () => void;
}

export default function ShareTemplateModal({
  visible,
  template,
  onClose,
}: ShareTemplateModalProps) {
  const qrCodeRef = useRef<View>(null);

  if (!template || !template.id) {
    return null;
  }

  // Generate deep link URL for the template
  const shareUrl = `com.wayex.cruxclimb://template/${template.id}`;

  const handleShareWhatsApp = async () => {
    try {
      const message = `Check out this training plan: ${template.name}\n\nOpen in CruxClimb: ${shareUrl}`;
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on this device');
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      Alert.alert('Error', 'Failed to share via WhatsApp');
    }
  };

  const handleShareQRCode = async () => {
    try {
      if (!qrCodeRef.current) return;

      // Capture the QR code as an image
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Share the QR code image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Share ${template.name} QR Code`,
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleCopyLink = () => {
    // For now, just show an alert. In production, you'd copy to clipboard
    Alert.alert('Link Copied', shareUrl);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Template</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.description}>
              Scan this QR code to access the template
            </Text>

            <View style={styles.qrContainer} ref={qrCodeRef} collapsable={false}>
              <QRCode
                value={shareUrl}
                size={200}
                color={Colors.gray[900]}
                backgroundColor={Colors.white}
                logo={require('@/assets/images/icon.png')}
                logoSize={40}
                logoBackgroundColor={Colors.white}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.whatsappButton]}
                onPress={handleShareWhatsApp}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={20} color={Colors.white} />
                <Text style={styles.actionButtonText}>Share on WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShareQRCode}
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={20} color={Colors.primary[500]} />
                <Text style={[styles.actionButtonText, styles.shareButtonText]}>
                  Share QR Code
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.copyButton]}
                onPress={handleCopyLink}
                activeOpacity={0.7}
              >
                <Ionicons name="copy-outline" size={20} color={Colors.gray[700]} />
                <Text style={[styles.actionButtonText, styles.copyButtonText]}>
                  Copy Link
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  shareButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary[500],
  },
  copyButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  shareButtonText: {
    color: Colors.primary[500],
  },
  copyButtonText: {
    color: Colors.gray[700],
  },
});
