import React, { useState, useRef, useEffect } from 'react';
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

interface VerifyOtpScreenProps {
  navigation: any;
  route: any;
}

export const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation, route }) => {
  const email = route?.params?.email || '';
  const initialCooldown = route?.params?.cooldownSeconds || 120;

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timer, setTimer] = useState(initialCooldown);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev: number) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Handle single digit input change
  const handleChangeText = (text: string, index: number) => {
    if (errorMsg) setErrorMsg('');

    // Handle full OTP pasted into first box
    if (text.length > 1) {
      const cleanDigits = text.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      cleanDigits.forEach((digit, idx) => {
        newOtp[idx] = digit;
      });
      setOtp(newOtp);

      const nextFocus = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP submit action
  const handleVerifyOtp = async (codeToVerify?: string) => {
    setErrorMsg('');
    setSuccessMsg('');

    const fullOtp = codeToVerify || otp.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, fullOtp);
      if (res.success && res.data?.resetToken) {
        setSuccessMsg('OTP verified successfully! Redirecting to change password...');
        setTimeout(() => {
          navigation.navigate('ResetPassword', {
            token: res.data?.resetToken || '',
            email: email,
          });
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Invalid or expired OTP code. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP action
  const handleResendOtp = async () => {
    if (!canResend || resendLoading) return;

    setErrorMsg('');
    setSuccessMsg('');
    setResendLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setSuccessMsg('A new OTP has been sent to your email.');
        setOtp(['', '', '', '', '', '']);
        const cooldown = res.data?.cooldownSeconds || 120;
        setTimer(cooldown);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        const msg = res.message || 'Failed to resend OTP. Please try again.';
        setErrorMsg(msg);
        const retrySec = res.retryAfterSeconds || (res.data as any)?.retryAfterSeconds;
        const match = msg.match(/wait (\d+) seconds/i);
        const waitSec = retrySec || (match && match[1] ? parseInt(match[1], 10) : 0);
        if (waitSec > 0) {
          setTimer(waitSec);
          setCanResend(false);
        }
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to resend OTP. Please try again.';
      setErrorMsg(msg);
      const retrySec = err.retryAfterSeconds || err.response?.data?.retryAfterSeconds;
      const match = msg.match(/wait (\d+) seconds/i);
      const waitSec = retrySec || (match && match[1] ? parseInt(match[1], 10) : 0);
      if (waitSec > 0) {
        setTimer(waitSec);
        setCanResend(false);
      }
    } finally {
      setResendLoading(false);
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
              <Text style={styles.backBtnText}>Change Email</Text>
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
            <Text style={styles.title}>Enter 6-Digit OTP</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to{' '}
              <Text style={styles.emailHighlight}>{email || 'your email'}</Text>
            </Text>
          </View>

          {/* Error Banner */}
          {!!errorMsg && (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={18} color="#b00020" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Success Banner */}
          {!!successMsg && (
            <View style={styles.successBox}>
              <MaterialIcons name="check-circle" size={18} color="#0e6251" />
              <Text style={styles.successText}>{successMsg}</Text>
            </View>
          )}

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => (inputRefs.current[idx] = ref)}
                style={[
                  styles.otpInput,
                  !!digit && styles.otpInputFilled,
                  !!errorMsg && styles.otpInputError,
                ]}
                value={digit}
                onChangeText={(val) => handleChangeText(val, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={idx === 0 ? 6 : 1}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, (loading || otp.join('').length < 6) && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={() => handleVerifyOtp()}
            disabled={loading || otp.join('').length < 6}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Verify OTP & Continue</Text>
            )}
          </TouchableOpacity>

          {/* Resend Timer & Link */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive code?</Text>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </Text>
            )}
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
    paddingVertical: 24,
    paddingHorizontal: 18,
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
    marginVertical: 4,
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
  emailHighlight: {
    fontWeight: '700',
    color: colors.onSurface,
  },
  devOtpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f8f5',
    borderColor: '#a3e4d7',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: 10,
    gap: 6,
  },
  devOtpText: {
    ...typography.bodyMd,
    fontSize: 12,
    color: '#0e6251',
  },
  devOtpCode: {
    fontWeight: '800',
    letterSpacing: 1,
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
    fontSize: 13,
    color: '#0e6251',
    flex: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    gap: 5,
    width: '100%',
  },
  otpInput: {
    flex: 1,
    minWidth: 0,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceContainerLowest,
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    elevation: 1,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: '#f4fbf7',
  },
  otpInputError: {
    borderColor: colors.error,
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
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  resendLabel: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  resendLink: {
    ...typography.labelMd,
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  timerText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.outline,
    fontWeight: '600',
  },
});
