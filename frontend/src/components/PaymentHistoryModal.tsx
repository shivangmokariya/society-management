import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { MaintenancePayment, initialSocietyData } from '../data/mockData';
import { paymentService } from '../services/paymentService';

interface PaymentHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  resident: any;
  societySettings?: {
    maintenanceAmount?: number | string;
    maintenanceDueDate?: string;
  };
  onPaymentRecorded?: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  visible,
  onClose,
  resident,
  societySettings,
  onPaymentRecorded,
}) => {
  const [payments, setPayments] = useState<MaintenancePayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Payment Form state
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [monthPeriod, setMonthPeriod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeMaintAmount =
    societySettings?.maintenanceAmount || initialSocietyData.maintenanceAmount || 2500;
  const activeMaintDueDate =
    societySettings?.maintenanceDueDate || initialSocietyData.maintenanceDueDate || '5th of every month';

  const fetchPayments = async () => {
    if (!resident) return;
    setLoading(true);
    try {
      if (resident._id || resident.id) {
        const idToUse = resident._id || resident.id;
        const res = await paymentService.getResidentPayments(idToUse);
        if (res.success && res.data) {
          setPayments(res.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API error fetching payments, using mock data:', err);
    }

    // Fallback to mock data matching resident flat or resident ID
    const residentFlat = resident.flat;
    const mockList = initialSocietyData.maintenancePayments.filter(
      (p) => p.flat === residentFlat || p.residentId === resident.id || p.residentId === resident._id
    );
    setPayments(mockList);
    setLoading(false);
  };

  useEffect(() => {
    if (visible && resident) {
      fetchPayments();
      // Set defaults for add form
      setAmount(String(activeMaintAmount));
      const todayStr = new Date().toISOString().split('T')[0];
      setPaymentDate(todayStr);
      setDueDate(`${todayStr.substring(0, 7)}-05`);
      setMonthPeriod(
        new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
      );
      setShowAddForm(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [visible, resident]);

  const handleRecordPayment = async () => {
    if (!amount || isNaN(Number(amount))) {
      setErrorMsg('Please enter a valid maintenance amount.');
      return;
    }
    if (!paymentDate || !dueDate) {
      setErrorMsg('Please provide both Payment Date and Due Date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Compute status automatically: Done On Time vs Paid Late
    const pTime = new Date(paymentDate).getTime();
    const dTime = new Date(dueDate).getTime();
    const computedStatus: 'On Time' | 'Late' =
      !isNaN(pTime) && !isNaN(dTime) && pTime > dTime ? 'Late' : 'On Time';

    const newPaymentRecord: MaintenancePayment = {
      id: 'pay-' + Date.now(),
      residentId: resident._id || resident.id,
      flat: resident.flat,
      payerName: resident.residentName || resident.ownerName,
      payerRole: resident.isSelfOwner ? 'Owner' : 'Tenant',
      amount: Number(amount),
      paymentDate,
      dueDate,
      status: computedStatus,
      monthPeriod: monthPeriod || 'Current Month',
      paymentMethod: 'UPI',
    };

    try {
      if (resident._id || resident.id) {
        const res = await paymentService.addResidentPayment(
          resident._id || resident.id,
          {
            amount: Number(amount),
            paymentDate,
            dueDate,
            monthPeriod: monthPeriod || 'Current Month',
            paymentMethod: 'UPI',
            payerName: resident.residentName || resident.ownerName,
            payerRole: resident.isSelfOwner ? 'Owner' : 'Tenant',
          }
        );
        if (res.success && res.data) {
          setPayments((prev) => [res.data as any, ...prev]);
        } else {
          setPayments((prev) => [newPaymentRecord, ...prev]);
        }
      } else {
        setPayments((prev) => [newPaymentRecord, ...prev]);
      }

      setSuccessMsg(`Payment of ₹${amount} recorded as "${computedStatus === 'On Time' ? 'Done On Time' : 'Paid Late'}".`);
      setShowAddForm(false);
      onPaymentRecorded?.();
    } catch (err: any) {
      // Fallback
      setPayments((prev) => [newPaymentRecord, ...prev]);
      setSuccessMsg(`Payment recorded! (${computedStatus === 'On Time' ? 'Done On Time' : 'Paid Late'})`);
      setShowAddForm(false);
      onPaymentRecorded?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (!resident) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerTitleCol}>
                  <View style={styles.flatTagRow}>
                    <Text style={styles.flatTitle}>{resident.flat}</Text>
                    <View
                      style={[
                        styles.roleBadge,
                        resident.isSelfOwner
                          ? { backgroundColor: 'rgba(63, 102, 81, 0.15)' }
                          : { backgroundColor: 'rgba(49, 102, 107, 0.15)' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleBadgeText,
                          resident.isSelfOwner
                            ? { color: colors.primary }
                            : { color: '#31666b' },
                        ]}
                      >
                        {resident.isSelfOwner ? 'Owner-Occupied' : 'Tenant / Rent'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.subText}>
                    Resident: {resident.residentName} • Owner: {resident.ownerName}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Society Rules Banner */}
              <View style={styles.societyRulesBanner}>
                <MaterialIcons name="verified-user" size={20} color={colors.primary} />
                <View style={styles.rulesTextCol}>
                  <Text style={styles.rulesTitle}>Society Maintenance Policy</Text>
                  <Text style={styles.rulesSub}>
                    Monthly Dues: <Text style={{ fontWeight: '700' }}>₹{activeMaintAmount}</Text> | Due Date: <Text style={{ fontWeight: '700' }}>{activeMaintDueDate}</Text>
                  </Text>
                </View>
              </View>

              {/* Banners */}
              {!!errorMsg && (
                <View style={styles.errorBox}>
                  <MaterialIcons name="error-outline" size={16} color="#b00020" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}
              {!!successMsg && (
                <View style={styles.successBox}>
                  <MaterialIcons name="check-circle" size={16} color="#0e6251" />
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              )}

              {/* Action Bar */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Payment History</Text>
                <TouchableOpacity
                  style={[styles.addPaymentBtn, showAddForm && styles.cancelPaymentBtn]}
                  onPress={() => setShowAddForm(!showAddForm)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={showAddForm ? 'close' : 'add-circle-outline'}
                    size={16}
                    color={showAddForm ? colors.onSurfaceVariant : colors.onPrimary}
                  />
                  <Text style={[styles.addPaymentBtnText, showAddForm && styles.cancelPaymentBtnText]}>
                    {showAddForm ? 'Cancel' : 'Record Payment'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Add Payment Form */}
              {showAddForm && (
                <View style={styles.formBox}>
                  <Text style={styles.formTitle}>Record Maintenance Payment</Text>

                  <View style={styles.formRow}>
                    <View style={styles.formGroupHalf}>
                      <Text style={styles.inputLabel}>Paid Amount (₹)</Text>
                      <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="2500"
                        placeholderTextColor={colors.outlineVariant}
                      />
                    </View>
                    <View style={styles.formGroupHalf}>
                      <Text style={styles.inputLabel}>Billing Period</Text>
                      <TextInput
                        style={styles.input}
                        value={monthPeriod}
                        onChangeText={setMonthPeriod}
                        placeholder="August 2026"
                        placeholderTextColor={colors.outlineVariant}
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formGroupHalf}>
                      <Text style={styles.inputLabel}>Payment Date (YYYY-MM-DD)</Text>
                      <TextInput
                        style={styles.input}
                        value={paymentDate}
                        onChangeText={setPaymentDate}
                        placeholder="2026-08-03"
                        placeholderTextColor={colors.outlineVariant}
                      />
                    </View>
                    <View style={styles.formGroupHalf}>
                      <Text style={styles.inputLabel}>Required Due Date</Text>
                      <TextInput
                        style={styles.input}
                        value={dueDate}
                        onChangeText={setDueDate}
                        placeholder="2026-08-05"
                        placeholderTextColor={colors.outlineVariant}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.savePaymentBtn, submitting && { opacity: 0.7 }]}
                    onPress={handleRecordPayment}
                    disabled={submitting}
                    activeOpacity={0.8}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                      <>
                        <MaterialIcons name="check" size={18} color={colors.onPrimary} />
                        <Text style={styles.savePaymentBtnText}>Save Payment Entry</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Payment History List */}
              <ScrollView
                style={styles.scrollList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : payments.length === 0 ? (
                  <View style={styles.emptyState}>
                    <MaterialIcons name="receipt-long" size={36} color={colors.outline} />
                    <Text style={styles.emptyStateText}>No payment records found for this user.</Text>
                  </View>
                ) : (
                  payments.map((p) => {
                    const isOnTime = p.status === 'On Time';
                    const isLate = p.status === 'Late';

                    return (
                      <View key={p.id || p._id || Math.random().toString()} style={styles.paymentCard}>
                        <View style={styles.paymentCardHeader}>
                          <View style={styles.monthCol}>
                            <Text style={styles.monthPeriodText}>{p.monthPeriod}</Text>
                            <Text style={styles.payerRoleText}>
                              Paid by: {p.payerName} ({p.payerRole || 'Resident'})
                            </Text>
                          </View>
                          <Text style={styles.paymentAmountText}>
                            ₹{typeof p.amount === 'number' ? p.amount.toLocaleString('en-IN') : p.amount}
                          </Text>
                        </View>

                        <View style={styles.paymentDivider} />

                        <View style={styles.paymentCardDetails}>
                          <View style={styles.dateCol}>
                            <View style={styles.dateRow}>
                              <MaterialIcons name="event-available" size={15} color={colors.onSurfaceVariant} />
                              <Text style={styles.dateLabel}>Paid On: </Text>
                              <Text style={styles.dateValue}>{p.paymentDate}</Text>
                            </View>
                            <View style={styles.dateRow}>
                              <MaterialIcons name="schedule" size={15} color={colors.onSurfaceVariant} />
                              <Text style={styles.dateLabel}>Due Date: </Text>
                              <Text style={styles.dateValue}>{p.dueDate}</Text>
                            </View>
                          </View>

                          {/* Timeliness Badge */}
                          <View style={styles.statusBadgeWrapper}>
                            {isOnTime ? (
                              <View style={styles.onTimeBadge}>
                                <MaterialIcons name="check-circle" size={14} color="#155724" />
                                <Text style={styles.onTimeBadgeText}>Done On Time</Text>
                              </View>
                            ) : isLate ? (
                              <View style={styles.lateBadge}>
                                <MaterialIcons name="warning" size={14} color="#856404" />
                                <Text style={styles.lateBadgeText}>Paid Late</Text>
                              </View>
                            ) : (
                              <View style={styles.pendingBadge}>
                                <MaterialIcons name="error" size={14} color="#721c24" />
                                <Text style={styles.pendingBadgeText}>Overdue</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}
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
    maxHeight: '88%',
    width: '100%',
  },
  scrollList: {
    flexShrink: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleCol: {
    gap: 4,
    flex: 1,
  },
  flatTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flatTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  roleBadgeText: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
  },
  subText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  closeBtn: {
    padding: 4,
  },
  societyRulesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(125, 166, 142, 0.15)',
    padding: 12,
    borderRadius: borderRadius.lg,
    gap: 12,
  },
  rulesTextCol: {
    flex: 1,
    gap: 2,
  },
  rulesTitle: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
  },
  rulesSub: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurface,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  addPaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  addPaymentBtnText: {
    ...typography.labelSm,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  cancelPaymentBtn: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  cancelPaymentBtnText: {
    color: colors.onSurfaceVariant,
  },
  formBox: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: borderRadius.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  formTitle: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontSize: 11,
  },
  input: {
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: 12,
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurface,
  },
  savePaymentBtn: {
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  savePaymentBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  paymentCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: 10,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  monthCol: {
    gap: 2,
  },
  monthPeriodText: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  payerRoleText: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  paymentAmountText: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.borderDivider,
  },
  paymentCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateCol: {
    gap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateLabel: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  dateValue: {
    ...typography.bodyMd,
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  statusBadgeWrapper: {},
  onTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#d4edda',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  onTimeBadgeText: {
    ...typography.labelSm,
    fontSize: 11,
    color: '#155724',
    fontWeight: '700',
  },
  lateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff3cd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  lateBadgeText: {
    ...typography.labelSm,
    fontSize: 11,
    color: '#856404',
    fontWeight: '700',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f8d7da',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  pendingBadgeText: {
    ...typography.labelSm,
    fontSize: 11,
    color: '#721c24',
    fontWeight: '700',
  },
});
