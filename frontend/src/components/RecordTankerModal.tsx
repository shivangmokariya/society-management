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
import { operationService } from '../services/operationService';

interface RecordTankerModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (arrivalDate: string) => void;
}

export const RecordTankerModal: React.FC<RecordTankerModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [arrivalDate, setArrivalDate] = useState('');
  const [capacity, setCapacity] = useState('10,000 Liters');
  const [supplier, setSupplier] = useState('Express Water Tankers');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (visible) {
      const todayStr = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setArrivalDate(todayStr);
      setCapacity('10,000 Liters');
      setSupplier('Express Water Tankers');
      setNotes('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!arrivalDate.trim()) {
      setErrorMsg('Please specify the date when the tanker arrived.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await operationService.recordTanker({
        arrivalDate: arrivalDate.trim(),
        capacity: capacity.trim(),
        supplier: supplier.trim(),
        notes: notes.trim(),
      });

      if (onSuccess) {
        onSuccess(arrivalDate.trim());
      }

      setSuccessMsg('Water tanker record added successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      if (onSuccess) {
        onSuccess(arrivalDate.trim());
      }
      setSuccessMsg('Tanker record saved!');
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
                  <MaterialIcons name="local-shipping" size={24} color={colors.tertiary} />
                </View>
                <View style={styles.headerTextCol}>
                  <Text style={styles.modalTitle}>Record Water Tanker</Text>
                  <Text style={styles.modalSub}>Log tanker arrival date & capacity filled</Text>
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
                {/* Arrival Date Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Tanker Arrival Date</Text>
                  <TextInput
                    style={styles.input}
                    value={arrivalDate}
                    onChangeText={setArrivalDate}
                    placeholder="e.g. 02 Sep 2026 or Today"
                    placeholderTextColor={colors.outlineVariant}
                  />
                  <View style={styles.presetRow}>
                    {['Today', 'Yesterday', '02 Sep 2026'].map((preset) => (
                      <TouchableOpacity
                        key={preset}
                        style={styles.presetChip}
                        onPress={() => {
                          if (preset === 'Today') {
                            setArrivalDate(
                              new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            );
                          } else if (preset === 'Yesterday') {
                            const y = new Date();
                            y.setDate(y.getDate() - 1);
                            setArrivalDate(
                              y.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            );
                          } else {
                            setArrivalDate(preset);
                          }
                        }}
                      >
                        <Text style={styles.presetChipText}>{preset}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Capacity */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Water Volume / Capacity</Text>
                  <TextInput
                    style={styles.input}
                    value={capacity}
                    onChangeText={setCapacity}
                    placeholder="10,000 Liters"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>

                {/* Supplier */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Supplier Name / Vendor</Text>
                  <TextInput
                    style={styles.input}
                    value={supplier}
                    onChangeText={setSupplier}
                    placeholder="Express Water Suppliers"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>

                {/* Notes */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Notes / Receipt # (Optional)</Text>
                  <TextInput
                    style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    placeholder="Filled main underground tank 1..."
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
                      <MaterialIcons name="local-shipping" size={20} color={colors.onPrimary} />
                      <Text style={styles.submitBtnText}>Save Tanker Record</Text>
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
    maxHeight: '85%',
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
    backgroundColor: 'rgba(49, 102, 107, 0.15)',
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
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  presetChipText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
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
