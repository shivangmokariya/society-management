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

export const AddTenantScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('A-101 (Owner: R. Kapoor)');
  const [moveInDate, setMoveInDate] = useState('2026-10-01');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setShowSuccess(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Add Member" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.headingTitle}>Add New Tenant</Text>
          <Text style={styles.headingSub}>
            Record a new residency to ensure seamless security and communication.
          </Text>
        </View>

        {/* Tenant Details */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Tenant Details</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person" size={20} color={colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Maya Sharma"
                placeholderTextColor={colors.outlineVariant}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="call" size={20} color={colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.outlineVariant}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Residency Info */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Residency Info</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Flat Assignment</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="door-front" size={20} color={colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={selectedFlat}
                onChangeText={setSelectedFlat}
                placeholder="Select an unassigned flat"
                placeholderTextColor={colors.outlineVariant}
              />
              <MaterialIcons name="expand-more" size={20} color={colors.outline} style={styles.rightIcon} />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Move-in Date</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="calendar-today" size={20} color={colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={moveInDate}
                onChangeText={setMoveInDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.outlineVariant}
              />
            </View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Text style={styles.label}>ID Proof & Lease Agreement</Text>
          <DocumentUploader
            label="Tap to upload files or take a photo"
            subLabel="Max 5MB per file (PDF, JPG, PNG)"
          />
        </View>

        {/* Action button */}
        <View style={styles.actionBox}>
          <TouchableOpacity style={styles.registerBtn} activeOpacity={0.8} onPress={handleSubmit}>
            <MaterialIcons name="person-add" size={20} color={colors.onPrimary} />
            <Text style={styles.registerBtnText}>Register Tenant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessOverlay
        visible={showSuccess}
        title="Tenant Added"
        description="The residency details have been saved and the owner has been notified."
        buttonText="Add Another"
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
    gap: 32,
  },
  titleSection: {
    marginTop: 16,
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
  sectionGroup: {
    gap: 16,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    paddingLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  input: {
    height: 56,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    paddingLeft: 48,
    paddingRight: 40,
    ...typography.bodyMd,
    color: colors.onSurface,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  actionBox: {
    marginTop: 16,
  },
  registerBtn: {
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: 'rgba(51, 58, 61, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  registerBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
  },
});
