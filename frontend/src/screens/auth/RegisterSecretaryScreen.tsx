import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { authService } from '../../services/authService';

interface RegisterSecretaryScreenProps {
  navigation: any;
}

export const RegisterSecretaryScreen: React.FC<RegisterSecretaryScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!fullName || !societyName || !email || !phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.registerSecretary({
        fullName,
        societyName,
        email,
        phone,
      });

      if (response.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(response.message || 'Registration request failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration request failed. Please check network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Register Secretary"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {!isSubmitted ? (
          <View style={styles.content}>
            <View style={styles.headingGroup}>
              <Text style={styles.displayTitle}>Register Society</Text>
              <Text style={styles.bodyDescription}>
                Begin your mindful stewardship. Register as a Society Secretary to access management tools.
              </Text>
            </View>

            {/* Error Banner */}
            {!!errorMsg && (
              <View style={styles.errorBox}>
                <MaterialIcons name="error-outline" size={18} color="#b00020" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <View style={styles.formCard}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="person" size={20} color={colors.outline} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={fullName}
                    onChangeText={(val) => {
                      setFullName(val);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Jane Doe"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>
              </View>

              {/* Society Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Society Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="location-city" size={20} color={colors.outline} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={societyName}
                    onChangeText={(val) => {
                      setSocietyName(val);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Greenwood Residency"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="mail" size={20} color={colors.outline} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="secretary@greenwood.com"
                    placeholderTextColor={colors.outlineVariant}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="call" size={20} color={colors.outline} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor={colors.outlineVariant}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            {/* Note Banner */}
            <View style={styles.noteBanner}>
              <MaterialIcons name="info" size={20} color={colors.secondary} style={styles.noteIcon} />
              <Text style={styles.noteText}>
                <Text style={{ fontWeight: '700', color: colors.onSurface }}>Note: </Text>
                Secretary registrations are subject to admin approval. You will be notified via email once your society is verified.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Request Access</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successState}>
            <View style={styles.successIconCircle}>
              <MaterialIcons name="check-circle" size={48} color={colors.onPrimaryFixed} />
            </View>
            <Text style={styles.successTitle}>Request Submitted</Text>
            <Text style={styles.successDesc}>
              Thank you for registering. Our team will review your application and contact you at your email address shortly.
            </Text>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => setIsSubmitted(false)}>
              <Text style={styles.backBtnText}>Back to Registration</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    gap: 24,
  },
  headingGroup: {
    gap: 8,
    marginTop: 12,
  },
  displayTitle: {
    ...typography.displayLg,
    fontSize: 40,
    lineHeight: 44,
  },
  bodyDescription: {
    ...typography.bodyLg,
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
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  textInput: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingLeft: 44,
    paddingRight: 16,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  noteBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(182, 236, 241, 0.2)',
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(182, 236, 241, 0.3)',
  },
  noteIcon: {
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  submitBtn: {
    height: 48,
    borderRadius: borderRadius.lg,
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
  successState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  successDesc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  backBtn: {
    marginTop: 16,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    ...typography.labelMd,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
