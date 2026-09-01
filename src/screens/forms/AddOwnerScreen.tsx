import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { DocumentUploader } from '../../components/DocumentUploader';
import { SuccessOverlay } from '../../components/SuccessOverlay';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

export const AddOwnerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setFlatNumber('');
    setEmail('');
    setShowSuccess(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Add Member" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Title banner */}
        <View style={styles.titleBanner}>
          <Text style={styles.headingTitle}>Add New Owner</Text>
          <Text style={styles.headingSub}>Register a new landlord or property owner to the society.</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Personal Details Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="person" size={20} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Personal Details</Text>
            </View>

            <View style={styles.fieldList}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Owner Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g., Rajesh Sharma"
                  placeholderTextColor={colors.outlineVariant}
                />
              </View>

              <View style={styles.rowTwo}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 XXXXX XXXXX"
                    placeholderTextColor={colors.outlineVariant}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Flat Number</Text>
                  <TextInput
                    style={[styles.input, { textTransform: 'uppercase' }]}
                    value={flatNumber}
                    onChangeText={setFlatNumber}
                    placeholder="A-302"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="rajesh.sharma@example.com"
                  placeholderTextColor={colors.outlineVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ownership Documents</Text>
            <Text style={styles.cardSubText}>Sale deed, index II, or allotment letter</Text>
            <View style={{ marginTop: 12 }}>
              <DocumentUploader />
            </View>
          </View>

          {/* Form Actions */}
          <View style={styles.actionsGroup}>
            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={handleSubmit}>
              <MaterialIcons name="person-add" size={18} color={colors.onPrimary} />
              <Text style={styles.submitBtnText}>Add Owner</Text>
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

      {/* Success Modal */}
      <SuccessOverlay
        visible={showSuccess}
        title="Owner Added"
        description={`${fullName || 'Rajesh Sharma'} has been successfully added to Flat ${
          flatNumber || 'A-302'
        }.`}
        buttonText="Add Another Owner"
        onButtonPress={handleReset}
      />
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
  titleBanner: {
    marginTop: 16,
    marginBottom: 24,
  },
  headingTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 4,
  },
  headingSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  formContainer: {
    gap: 24,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
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
  cardSubText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  fieldList: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 16,
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
});
