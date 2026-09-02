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
import { useAuth } from '../../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('shivangmokariya92173@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
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
        {/* Background decorative circles */}
        <View style={styles.bgBlobLeft} />
        <View style={styles.bgBlobRight} />

        <View style={styles.card}>
          {/* Header Logo & Title */}
          <View style={styles.headerBox}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: getImageUrl('/public/assets/logos/login_card_logo.jpg') }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to manage your community.</Text>
          </View>

          {/* Error Banner */}
          {!!errorMsg && (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={18} color="#b00020" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
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

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeaderRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={colors.outline}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { paddingRight: 40 }]}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  placeholderTextColor={colors.outlineVariant}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.outline}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me */}
            <TouchableOpacity
              style={styles.rememberRow}
              activeOpacity={0.8}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <MaterialIcons name="check" size={14} color={colors.onPrimary} />}
              </View>
              <Text style={styles.rememberLabel}>Remember me</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.signInBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to Serene Habitat? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterSecretary')}>
              <Text style={styles.registerLink}>Register as Secretary</Text>
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
    padding: 32,
    shadowColor: 'rgba(51, 58, 61, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    zIndex: 10,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 24,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fde8e8',
    borderColor: '#f8b4b4',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    ...typography.bodyMd,
    color: '#9b1c1c',
    flex: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  passwordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotText: {
    ...typography.labelSm,
    color: colors.primary,
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
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  signInBtn: {
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: 'rgba(63, 102, 81, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  signInBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  registerLink: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '600',
  },
});
