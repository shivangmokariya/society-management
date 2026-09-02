import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';

export const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateProfile, uploadAvatar } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/public/assets/avatars/avatar_1.jpg');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Image Preview Modal state
  const [previewVisible, setPreviewVisible] = useState(false);

  const handlePickImage = async () => {
    setErrorMsg('');
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Camera roll permission is required to upload a profile picture.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        await processAndUploadImage(asset.uri, asset.fileName || 'avatar.jpg', asset.mimeType || 'image/jpeg');
      }
    } catch (err: any) {
      console.error('Image picker error:', err);
      setErrorMsg('Failed to select image from gallery.');
    }
  };

  const processAndUploadImage = async (uri: string, filename: string, mimeType: string) => {
    setUploadingImage(true);
    setErrorMsg('');
    try {
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('avatar', blob, filename || 'profile_image.jpg');
      } else {
        formData.append('avatar', {
          uri,
          name: filename || 'avatar.jpg',
          type: mimeType || 'image/jpeg',
        } as any);
      }

      const uploadedUrl = await uploadAvatar(formData);
      setAvatarUrl(uploadedUrl);
      setSuccessMsg('Image uploaded! Click "Save Changes" to apply.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        fullName,
        phone,
        avatarUrl,
      });
      setSuccessMsg('Profile updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="My Profile" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Banner Title */}
        <View style={styles.titleSection}>
          <Text style={styles.headingTitle}>Edit Profile</Text>
          <Text style={styles.headingSub}>Update your personal details and profile photo.</Text>
        </View>

        {/* Banners */}
        {!!errorMsg && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={18} color="#b00020" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {!!successMsg && (
          <View style={styles.successBox}>
            <MaterialIcons name="check-circle" size={18} color="#0e6251" />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          {/* Avatar Upload Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="photo-camera" size={20} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Profile Image</Text>
            </View>

            <View style={styles.avatarSectionRow}>
              {/* Tap avatar to preview */}
              <TouchableOpacity
                style={styles.avatarContainer}
                activeOpacity={0.85}
                onPress={() => setPreviewVisible(true)}
              >
                <Image
                  source={{ uri: getImageUrl(avatarUrl) }}
                  style={styles.currentAvatar}
                  resizeMode="cover"
                />
                <View style={styles.zoomBadge}>
                  <MaterialIcons name="zoom-in" size={16} color="#fff" />
                </View>
                {uploadingImage && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.avatarActionsCol}>
                <TouchableOpacity
                  style={[styles.uploadBtn, uploadingImage && { opacity: 0.7 }]}
                  activeOpacity={0.8}
                  onPress={handlePickImage}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="cloud-upload" size={20} color={colors.onPrimary} />
                      <Text style={styles.uploadBtnText}>Upload New Photo</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.tapHintText}>Tap profile image to view in full size</Text>
              </View>
            </View>
          </View>

          {/* Personal Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="person" size={20} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Personal Details</Text>
            </View>

            <View style={styles.fieldList}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.outlineVariant}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="+91 XXXXX XXXXX"
                  placeholderTextColor={colors.outlineVariant}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address (Read-only)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user?.email || ''}
                  editable={false}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Society (Read-only)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user?.society?.name || 'Gokuldham Society'}
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsGroup}>
            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <>
                  <MaterialIcons name="save" size={18} color={colors.onPrimary} />
                  <Text style={styles.submitBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Full-Screen Image Preview Lightbox */}
      <Modal
        visible={previewVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewOverlay}>
          {/* Top Navigation Bar */}
          <View style={styles.previewTopBar}>
            <TouchableOpacity
              style={styles.closePreviewBtn}
              onPress={() => setPreviewVisible(false)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Profile Photo</Text>
            <TouchableOpacity
              style={styles.closePreviewBtn}
              onPress={() => setPreviewVisible(false)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Main Photo View */}
          <View style={styles.previewContentContainer}>
            <View style={styles.previewImageWrapper}>
              <Image
                source={{ uri: getImageUrl(avatarUrl) }}
                style={styles.fullPreviewImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.previewOwnerName}>{fullName || 'Profile Photo'}</Text>
          </View>

          {/* Bottom Actions */}
          <View style={styles.previewBottomBar}>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={() => {
                setPreviewVisible(false);
                handlePickImage();
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.changePhotoBtnText}>Upload New Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissPreviewBtn}
              onPress={() => setPreviewVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.dismissPreviewBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.containerPaddingMobile,
    paddingBottom: 40,
    gap: 24,
  },
  titleSection: {
    marginTop: 8,
    gap: 4,
  },
  headingTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  headingSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fde8e8',
    borderColor: '#f8b4b4',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: 12,
    gap: 8,
  },
  errorText: {
    ...typography.bodyMd,
    color: '#9b1c1c',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f8f5',
    borderColor: '#a3e4d7',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: 12,
    gap: 8,
  },
  successText: {
    ...typography.bodyMd,
    color: '#0e6251',
    flex: 1,
  },
  formContainer: {
    gap: 24,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDivider,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(125, 166, 142, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  avatarSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  currentAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  zoomBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActionsCol: {
    flex: 1,
    gap: 8,
  },
  uploadBtn: {
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  uploadBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  tapHintText: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  fieldList: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  input: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: 16,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  disabledInput: {
    backgroundColor: colors.surfaceContainerLow,
    color: colors.onSurfaceVariant,
  },
  actionsGroup: {
    gap: 12,
    marginTop: 8,
  },
  submitBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: 'rgba(63, 102, 81, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  submitBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cancelBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...typography.labelMd,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  // Preview Lightbox Styles
  previewOverlay: {
    flex: 1,
    backgroundColor: '#0d1512',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  previewTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  closePreviewBtn: {
    padding: 8,
  },
  previewContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  previewImageWrapper: {
    width: 270,
    height: 270,
    borderRadius: 135,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  fullPreviewImage: {
    width: '100%',
    height: '100%',
  },
  previewOwnerName: {
    ...typography.headlineLgMobile,
    color: '#ffffff',
    fontSize: 20,
  },
  previewBottomBar: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: 12,
  },
  changePhotoBtn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  changePhotoBtnText: {
    ...typography.labelMd,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  dismissPreviewBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissPreviewBtnText: {
    ...typography.labelMd,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});
