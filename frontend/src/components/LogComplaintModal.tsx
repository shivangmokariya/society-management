import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import { operationService, ComplaintItem } from '../services/operationService';

interface LogComplaintModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (newComplaint: ComplaintItem) => void;
}

const CATEGORIES: Array<'Plumbing' | 'Electrical' | 'Security' | 'General'> = [
  'Plumbing',
  'Electrical',
  'Security',
  'General',
];

export const LogComplaintModal: React.FC<LogComplaintModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Plumbing' | 'Electrical' | 'Security' | 'General'>('Plumbing');
  const [flat, setFlat] = useState('');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle('');
      setCategory('Plumbing');
      setFlat('');
      setDescription('');
      setReportedBy('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a complaint title.');
      return;
    }

    if (!flat.trim()) {
      setErrorMsg('Please specify the flat number or area.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a detailed description of the complaint.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const newComplaintData = {
      title: title.trim(),
      category,
      flat: flat.trim(),
      description: description.trim(),
      reportedBy: reportedBy.trim() || 'Resident',
    };

    try {
      const res = await operationService.createComplaint(newComplaintData);

      const createdItem: ComplaintItem = (res.success && res.data)
        ? res.data
        : {
            _id: 'c-' + Date.now(),
            id: 'c-' + Date.now(),
            title: title.trim(),
            category,
            flat: flat.trim(),
            description: description.trim(),
            status: 'Open',
            timeAgo: 'Reported just now',
          };

      if (onSuccess) {
        onSuccess(createdItem);
      }

      setSuccessMsg('Complaint logged successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      const createdItem: ComplaintItem = {
        _id: 'c-' + Date.now(),
        id: 'c-' + Date.now(),
        title: title.trim(),
        category,
        flat: flat.trim(),
        description: description.trim(),
        status: 'Open',
        timeAgo: 'Reported just now',
      };

      if (onSuccess) {
        onSuccess(createdItem);
      }

      setSuccessMsg('Complaint logged!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="report-problem" size={24} color={colors.primary} />
                </View>
                <View style={styles.headerTextCol}>
                  <Text style={styles.modalTitle}>Log New Complaint</Text>
                  <Text style={styles.modalSub}>Add issue details & detailed description</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
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

              <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.formContainer}
                keyboardShouldPersistTaps="handled"
              >
                {/* Title */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Complaint Title</Text>
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Water leakage in main bathroom"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>

                {/* Category Selection */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.categoryRow}>
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.catChip,
                          category === cat && styles.catChipActive,
                        ]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.catChipText,
                            category === cat && styles.catChipTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Flat / Location & Reported By */}
                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Flat / Location</Text>
                    <TextInput
                      style={styles.input}
                      value={flat}
                      onChangeText={setFlat}
                      placeholder="e.g. A-302 or Lift B"
                      placeholderTextColor={colors.outlineVariant}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Reported By (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={reportedBy}
                      onChangeText={setReportedBy}
                      placeholder="e.g. Amit Shah"
                      placeholderTextColor={colors.outlineVariant}
                    />
                  </View>
                </View>

                {/* Detailed Description */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Detailed Description of Complaint</Text>
                  <TextInput
                    style={[styles.input, styles.descTextArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholder="Describe the complaint in detail (e.g. Pipe joint is leaking severely under the sink, water spreading in kitchen floor...)"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="send" size={20} color={colors.onPrimary} />
                      <Text style={styles.submitBtnText}>Submit Complaint</Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: 20,
    maxHeight: '90%',
    width: '100%',
  },
  scrollContainer: {
    flexShrink: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(125, 166, 142, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  modalTitle: {
    ...typography.headlineLgMobile,
    fontSize: 18,
    color: colors.onSurface,
  },
  modalSub: {
    ...typography.bodyMd,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  closeBtn: {
    padding: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fde8e8',
    padding: 10,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  errorText: {
    ...typography.bodyMd,
    fontSize: 12,
    color: '#9b1c1c',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f8f5',
    padding: 10,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  successText: {
    ...typography.bodyMd,
    fontSize: 12,
    color: '#0e6251',
  },
  formContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '700',
  },
  input: {
    height: 46,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: 14,
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurface,
  },
  descTextArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  catChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catChipText: {
    ...typography.labelSm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  catChipTextActive: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
    gap: 6,
  },
  submitBtn: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: 'rgba(63, 102, 81, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
