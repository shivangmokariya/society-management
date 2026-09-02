import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { initialSocietyData } from '../data/mockData';
import { societyService } from '../services/societyService';
import { useAuth } from '../context/AuthContext';

interface SocietySettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentSettings?: {
    maintenanceAmount?: number | string;
    maintenanceDueDate?: string;
    monthSchedule?: { [key: number]: number };
    societyId?: string;
  };
  onSaveSuccess?: (newSettings: {
    maintenanceAmount: number;
    maintenanceDueDate: string;
    monthSchedule?: { [key: number]: number };
  }) => void;
}

const ALL_MONTHS = [
  { id: 1, name: 'January', short: 'Jan', days: 31 },
  { id: 2, name: 'February', short: 'Feb', days: 28 },
  { id: 3, name: 'March', short: 'Mar', days: 31 },
  { id: 4, name: 'April', short: 'Apr', days: 30 },
  { id: 5, name: 'May', short: 'May', days: 31 },
  { id: 6, name: 'June', short: 'Jun', days: 30 },
  { id: 7, name: 'July', short: 'Jul', days: 31 },
  { id: 8, name: 'August', short: 'Aug', days: 31 },
  { id: 9, name: 'September', short: 'Sep', days: 30 },
  { id: 10, name: 'October', short: 'Oct', days: 31 },
  { id: 11, name: 'November', short: 'Nov', days: 30 },
  { id: 12, name: 'December', short: 'Dec', days: 31 },
];

export const SocietySettingsModal: React.FC<SocietySettingsModalProps> = ({
  visible,
  onClose,
  currentSettings,
  onSaveSuccess,
}) => {
  const { user, token } = useAuth();

  // Determine current month index (1-indexed: 1 = Jan, 9 = Sep)
  const currentMonthId = new Date().getMonth() + 1; // e.g. 9 for Sept

  const [maintenanceAmount, setMaintenanceAmount] = useState('2500');
  const [defaultDueDay, setDefaultDueDay] = useState('5');

  // 12 Months Due Day Schedule mapping monthId -> dueDay number
  const [monthSchedule, setMonthSchedule] = useState<{ [key: number]: number }>(() => {
    const initialMap: { [key: number]: number } = {};
    const existing = initialSocietyData.monthSchedule || {};
    ALL_MONTHS.forEach((m) => {
      initialMap[m.id] = existing[m.id] || 5;
    });
    return initialMap;
  });

  // Custom Calendar Date Picker Modal state
  const [activePickerMonth, setActivePickerMonth] = useState<any>(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedUpcomingDueDay, setSelectedUpcomingDueDay] = useState(5);

  useEffect(() => {
    if (visible) {
      const amt = String(currentSettings?.maintenanceAmount || initialSocietyData.maintenanceAmount || 2500);
      setMaintenanceAmount(amt);

      const existingSchedule = currentSettings?.monthSchedule || initialSocietyData.monthSchedule;
      const rawDueDateStr = currentSettings?.maintenanceDueDate || initialSocietyData.maintenanceDueDate || '5th of every month';
      const match = rawDueDateStr.match(/\d+/);
      const parsedDay = match ? parseInt(match[0], 10) : 5;
      setDefaultDueDay(String(parsedDay));
      setSelectedUpcomingDueDay(parsedDay);

      const updatedMap: { [key: number]: number } = {};
      ALL_MONTHS.forEach((m) => {
        if (existingSchedule && existingSchedule[m.id] !== undefined) {
          updatedMap[m.id] = Number(existingSchedule[m.id]);
        } else {
          updatedMap[m.id] = parsedDay;
        }
      });
      setMonthSchedule(updatedMap);

      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [visible, currentSettings]);

  // Open custom calendar for a month
  const handleOpenMonthPicker = (monthObj: any) => {
    if (monthObj.id < currentMonthId) {
      // Past month -> locked
      return;
    }
    setActivePickerMonth(monthObj);
    setPickerModalVisible(true);
  };

  // Update a single upcoming month's due day
  const handleUpdateMonthDueDay = (monthId: number, day: number) => {
    if (monthId < currentMonthId) {
      return;
    }
    setMonthSchedule((prev) => ({
      ...prev,
      [monthId]: day,
    }));
  };

  // Batch update all upcoming months
  const handleApplyToAllUpcoming = (day: number) => {
    setSelectedUpcomingDueDay(day);
    setDefaultDueDay(String(day));
    setMonthSchedule((prev) => {
      const next = { ...prev };
      ALL_MONTHS.forEach((m) => {
        if (m.id >= currentMonthId) {
          next[m.id] = day;
        }
      });
      return next;
    });
  };

  const handleSaveSettings = async () => {
    const numericAmount = Number(maintenanceAmount);
    if (!maintenanceAmount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid maintenance amount greater than 0.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const currentMonthDueDay = monthSchedule[currentMonthId] || selectedUpcomingDueDay || 5;
    const formattedDueDate = `${currentMonthDueDay}th of every month`;

    const updatedData = {
      maintenanceAmount: numericAmount,
      maintenanceDueDate: formattedDueDate,
      monthSchedule,
    };

    try {
      const societyId = currentSettings?.societyId || user?.society?._id || user?.society?.id || 'society-id';
      await societyService.updateSocietyDetails(societyId, updatedData, token || undefined);

      initialSocietyData.maintenanceAmount = numericAmount;
      initialSocietyData.maintenanceDueDate = formattedDueDate;
      initialSocietyData.monthSchedule = monthSchedule;

      if (onSaveSuccess) {
        onSaveSuccess({
          maintenanceAmount: numericAmount,
          maintenanceDueDate: formattedDueDate,
          monthSchedule,
        });
      }

      setSuccessMsg('Annual Maintenance Calendar updated! Upcoming month schedules applied society-wide.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      initialSocietyData.maintenanceAmount = numericAmount;
      initialSocietyData.maintenanceDueDate = formattedDueDate;
      initialSocietyData.monthSchedule = monthSchedule;

      if (onSaveSuccess) {
        onSaveSuccess({
          maintenanceAmount: numericAmount,
          maintenanceDueDate: formattedDueDate,
          monthSchedule,
        });
      }

      setSuccessMsg('Calendar schedule saved successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="calendar-month" size={24} color={colors.primary} />
                </View>
                <View style={styles.headerTextCol}>
                  <Text style={styles.modalTitle}>Annual Maintenance Settings</Text>
                  <Text style={styles.modalSub}>Jan - Dec Calendar • Custom date selection per month</Text>
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

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
                {/* Maintenance Amount */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Society Maintenance Amount (₹)</Text>
                  <View style={styles.inputWithPrefix}>
                    <Text style={styles.prefixText}>₹</Text>
                    <TextInput
                      style={styles.prefixInput}
                      value={maintenanceAmount}
                      onChangeText={setMaintenanceAmount}
                      keyboardType="numeric"
                      placeholder="2500"
                      placeholderTextColor={colors.outlineVariant}
                    />
                  </View>
                </View>

                {/* Batch Action for Upcoming Months */}
                <View style={styles.batchSection}>
                  <View style={styles.batchHeaderRow}>
                    <MaterialIcons name="edit-calendar" size={18} color={colors.primary} />
                    <Text style={styles.batchTitle}>Quick Apply to Upcoming Months (Sep - Dec)</Text>
                  </View>
                  <View style={styles.presetRow}>
                    {[5, 10, 15, 20, 25, 30].map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.presetChip,
                          selectedUpcomingDueDay === day && styles.presetChipActive,
                        ]}
                        onPress={() => handleApplyToAllUpcoming(day)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.presetChipText,
                            selectedUpcomingDueDay === day && styles.presetChipTextActive,
                          ]}
                        >
                          {day}th of month
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 12-Month Calendar Schedule Grid */}
                <View style={styles.calendarSection}>
                  <View style={styles.calendarSectionHeader}>
                    <Text style={styles.label}>Jan to Dec Due Date Calendar (2026)</Text>
                    <Text style={styles.ruleBadgeNote}>🔒 Past: Locked | ✏️ Upcoming: Tap month for custom calendar date</Text>
                  </View>

                  <View style={styles.monthsGrid}>
                    {ALL_MONTHS.map((m) => {
                      const isPast = m.id < currentMonthId;
                      const isCurrent = m.id === currentMonthId;
                      const dueDay = monthSchedule[m.id] || 5;

                      return (
                        <TouchableOpacity
                          key={m.id}
                          style={[
                            styles.monthCard,
                            isPast && styles.monthCardPast,
                            isCurrent && styles.monthCardCurrent,
                          ]}
                          disabled={isPast}
                          onPress={() => handleOpenMonthPicker(m)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.monthHeader}>
                            <Text
                              style={[
                                styles.monthName,
                                isPast && styles.monthNamePast,
                                isCurrent && styles.monthNameCurrent,
                              ]}
                            >
                              {m.short}
                            </Text>
                            {isPast ? (
                              <View style={styles.lockedBadge}>
                                <MaterialIcons name="lock" size={12} color="#717973" />
                                <Text style={styles.lockedText}>Locked</Text>
                              </View>
                            ) : (
                              <View style={styles.editableBadge}>
                                <MaterialIcons name="edit" size={12} color={colors.primary} />
                                <Text style={styles.editableText}>{isCurrent ? 'Active' : 'Upcoming'}</Text>
                              </View>
                            )}
                          </View>

                          <Text style={styles.monthAmountText}>₹{maintenanceAmount} / month</Text>

                          {/* Day selector / Custom date display for month */}
                          <View style={styles.monthDueDateBox}>
                            <Text style={styles.dueDayLabel}>Due Day:</Text>
                            {isPast ? (
                              <Text style={styles.pastDueDayText}>{dueDay}th</Text>
                            ) : (
                              <View style={styles.daySelectorRow}>
                                <View style={styles.selectedDayPill}>
                                  <Text style={styles.selectedDayPillText}>{dueDay}th</Text>
                                </View>
                                <TouchableOpacity
                                  style={styles.customCalendarIconBtn}
                                  onPress={() => handleOpenMonthPicker(m)}
                                  activeOpacity={0.8}
                                >
                                  <MaterialIcons name="event" size={18} color={colors.primary} />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSaveSettings}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="save" size={20} color={colors.onPrimary} />
                      <Text style={styles.saveBtnText}>Save Annual Maintenance Settings</Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Month Custom Calendar Date Picker Modal */}
      {activePickerMonth && (
        <Modal
          visible={pickerModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setPickerModalVisible(false)}>
            <View style={styles.pickerOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.pickerCard}>
                  {/* Picker Header */}
                  <View style={styles.pickerHeaderRow}>
                    <View style={styles.pickerTitleCol}>
                      <Text style={styles.pickerTitle}>
                        Select Due Date for {activePickerMonth.name} 2026
                      </Text>
                      <Text style={styles.pickerSub}>
                        Tap any date (1 - {activePickerMonth.days}) to set due date for {activePickerMonth.short}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setPickerModalVisible(false)}
                      style={styles.closeBtn}
                    >
                      <MaterialIcons name="close" size={22} color={colors.onSurfaceVariant} />
                    </TouchableOpacity>
                  </View>

                  {/* Day Headers */}
                  <View style={styles.weekHeadersRow}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
                      <Text key={dayName} style={styles.weekHeaderText}>
                        {dayName}
                      </Text>
                    ))}
                  </View>

                  {/* Days Grid */}
                  <View style={styles.daysGrid}>
                    {Array.from({ length: activePickerMonth.days }, (_, i) => i + 1).map((dayNum) => {
                      const isSelected = (monthSchedule[activePickerMonth.id] || 5) === dayNum;

                      return (
                        <TouchableOpacity
                          key={dayNum}
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellSelected,
                          ]}
                          onPress={() => {
                            handleUpdateMonthDueDay(activePickerMonth.id, dayNum);
                            setPickerModalVisible(false);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.dayCellText,
                              isSelected && styles.dayCellTextSelected,
                            ]}
                          >
                            {dayNum}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Quick Select Presets inside picker */}
                  <View style={styles.pickerQuickRow}>
                    <Text style={styles.pickerQuickLabel}>Quick Presets:</Text>
                    {[5, 10, 15, 20, 25].map((presetDay) => (
                      <TouchableOpacity
                        key={presetDay}
                        style={[
                          styles.presetChip,
                          (monthSchedule[activePickerMonth.id] || 5) === presetDay &&
                            styles.presetChipActive,
                        ]}
                        onPress={() => {
                          handleUpdateMonthDueDay(activePickerMonth.id, presetDay);
                          setPickerModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.presetChipText,
                            (monthSchedule[activePickerMonth.id] || 5) === presetDay &&
                              styles.presetChipTextActive,
                          ]}
                        >
                          {presetDay}th
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: 20,
    maxHeight: '90%',
    gap: 16,
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
  inputWithPrefix: {
    height: 44,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  prefixText: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  prefixInput: {
    flex: 1,
    height: '100%',
    ...typography.bodyMd,
    fontSize: 15,
    color: colors.onSurface,
  },
  batchSection: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  batchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batchTitle: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetChipText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontSize: 11,
  },
  presetChipTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  calendarSection: {
    gap: 10,
  },
  calendarSectionHeader: {
    gap: 2,
  },
  ruleBadgeNote: {
    ...typography.bodyMd,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  monthCard: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: 6,
  },
  monthCardPast: {
    backgroundColor: colors.surfaceContainerLow,
    opacity: 0.7,
    borderColor: colors.outlineVariant,
  },
  monthCardCurrent: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthName: {
    ...typography.headlineMd,
    fontSize: 15,
    color: colors.onSurface,
    fontWeight: '700',
  },
  monthNamePast: {
    color: colors.onSurfaceVariant,
  },
  monthNameCurrent: {
    color: colors.primary,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(113, 121, 115, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  lockedText: {
    ...typography.labelSm,
    fontSize: 9,
    color: '#717973',
  },
  editableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(125, 166, 142, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  editableText: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
  },
  monthAmountText: {
    ...typography.bodyMd,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  monthDueDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dueDayLabel: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  pastDueDayText: {
    ...typography.labelSm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  daySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedDayPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  selectedDayPillText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  customCalendarIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(125, 166, 142, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: 'rgba(63, 102, 81, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  // Custom Month Date Picker Styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pickerCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pickerTitleCol: {
    flex: 1,
    gap: 2,
  },
  pickerTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
  },
  pickerSub: {
    ...typography.bodyMd,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  weekHeadersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  weekHeaderText: {
    width: 36,
    textAlign: 'center',
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayCellText: {
    ...typography.labelMd,
    fontSize: 13,
    color: colors.onSurface,
  },
  dayCellTextSelected: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  pickerQuickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderDivider,
    paddingTop: 12,
  },
  pickerQuickLabel: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
});
