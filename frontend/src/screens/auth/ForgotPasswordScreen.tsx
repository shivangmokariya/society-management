import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { getImageUrl } from '../../services/api';
import { authService } from '../../services/authService';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('shivangmokariya92173@gmail.com');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleSendResetLink = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGeneratedToken(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        const token = res.data?.resetToken || 'demo-reset-token-' + Date.now();
        setGeneratedToken(token);
        setSuccessMsg(res.message || 'Password reset link sent to your email address.');
      } else {
        setErrorMsg(res.message || 'No account found with this email address.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'No account found with this email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Background decorative blobs */}
        <View style={styles.bgBlobLeft} />
        <View style={styles.bgBlobRight} />

        <View style={styles.card}>
          {/* Top Header */}
          <View style={styles.topNavRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={20} color={colors.onSurface} />
              <Text style={styles.backBtnText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Logo & Title */}
          <View style={styles.headerBox}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: getImageUrl('/public/assets/logos/login_card_logo.jpg') }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your registered email address and we'll send you an application link to reset your password.
            </Text>
          </View>

          {/* Error Banner */}
          {!!errorMsg && (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={18} color="#b00020" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Success Banner with Clean Reset Link */}
          {!!successMsg && (
            <View style={styles.successBox}>
              <View style={styles.successRow}>
                <MaterialIcons name="check-circle" size={20} color="#0e6251" />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
              {!!generatedToken && (
                <TouchableOpacity
                  style={styles.openResetBtn}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('ResetPassword', { token: generatedToken })}
                >
                  <MaterialIcons name="open-in-new" size={16} color="#fff" />
                  <Text style={styles.openResetBtnText}>Click to Open Reset Link</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Registered Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="mail"
                  size={20}
                  color={colors.outline}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.outlineVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleSendResetLink}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Send Password Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.containerPaddingMobile,
    position: 'relative',
  },
  bgBlobLeft: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(193, 237, 210, 0.4)',
  },
  bgBlobRight: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(182, 236, 241, 0.3)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    padding: 28,
    shadowColor: 'rgba(51, 58, 61, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    zIndex: 10,
    gap: 16,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  headerBox: {
    alignItems: 'center',
    marginVertical: 8,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 16,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
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
    fontSize: 13,
    color: '#9b1c1c',
    flex: 1,
  },
  successBox: {
    backgroundColor: '#e8f8f5',
    borderColor: '#a3e4d7',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: 14,
    gap: 10,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: '#0e6251',
    flex: 1,
    fontWeight: '500',
  },
  openResetBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
  },
  openResetBtnText: {
    ...typography.labelMd,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  form: {
    gap: 18,
    marginTop: 4,
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
    left: 12,
    zIndex: 1,
  },
  textInput: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingLeft: 42,
    paddingRight: 16,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  submitBtn: {
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
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
});
