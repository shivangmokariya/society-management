import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export interface TransactionItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  isCredit: boolean;
}

interface StatBreakdownModalProps {
  visible: boolean;
  type: 'balance' | 'income' | 'expenses' | 'dues' | null;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  stats: any;
  transactions?: TransactionItem[];
  pendingDues?: any[];
}

export const StatBreakdownModal: React.FC<StatBreakdownModalProps> = ({
  visible,
  type,
  onClose,
  onNavigate,
  stats,
  transactions = [],
  pendingDues = [],
}) => {
  if (!visible || !type) return null;

  const activeTransactions = transactions;

  let title = '';
  let subtitle = '';
  let accentColor = colors.primary;

  if (type === 'balance') {
    title = 'Current Balance Calculation';
    subtitle = 'Detailed audit formula & recent ledger history';
    accentColor = colors.primary;
  } else if (type === 'income') {
    title = 'Monthly Income Breakdown';
    subtitle = 'All collections and inflow transactions';
    accentColor = colors.secondary;
  } else if (type === 'expenses') {
    title = 'Expenses & Outflow Breakdown';
    subtitle = 'All society expenses and debit transactions';
    accentColor = colors.error;
  } else if (type === 'dues') {
    title = 'Pending Maintenance Dues';
    subtitle = 'Flats with unpaid monthly maintenance';
    accentColor = colors.tertiary;
  }

  const filteredTx =
    type === 'income'
      ? activeTransactions.filter((t) => t.isCredit)
      : type === 'expenses'
      ? activeTransactions.filter((t) => !t.isCredit)
      : activeTransactions;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconCircle, { backgroundColor: `${accentColor}20` }]}>
                <MaterialIcons
                  name={
                    type === 'balance'
                      ? 'account-balance'
                      : type === 'income'
                      ? 'trending-up'
                      : type === 'expenses'
                      ? 'trending-down'
                      : 'money-off'
                  }
                  size={24}
                  color={accentColor}
                />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Calculation Formula Card for BALANCE */}
            {type === 'balance' && (
              <View style={styles.calcCard}>
                <Text style={styles.calcTitle}>Balance Calculation Formula</Text>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Initial Base Balance:</Text>
                  <Text style={styles.calcVal}>₹{(stats?.baseBalance ?? 0).toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={[styles.calcLabel, { color: colors.primary }]}>+ Total Income Collected:</Text>
                  <Text style={[styles.calcVal, { color: colors.primary }]}>+{stats?.monthlyIncome || '₹0'}</Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={[styles.calcLabel, { color: colors.error }]}>- Total Outflow Expenses:</Text>
                  <Text style={[styles.calcVal, { color: colors.error }]}>-{stats?.monthlyExpenses || '₹0'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.calcRow}>
                  <Text style={styles.calcTotalLabel}>Net Current Balance:</Text>
                  <Text style={styles.calcTotalVal}>{stats?.currentBalance || '₹0'}</Text>
                </View>
              </View>
            )}

            {/* Income Progress Banner */}
            {type === 'income' && (
              <View style={styles.summaryBanner}>
                <View style={styles.bannerRow}>
                  <Text style={styles.bannerLabel}>Target Monthly Collection:</Text>
                  <Text style={styles.bannerVal}>{stats?.monthlyIncomeTarget || '₹3,00,000'}</Text>
                </View>
                <View style={styles.bannerRow}>
                  <Text style={styles.bannerLabel}>Current Collection:</Text>
                  <Text style={[styles.bannerVal, { color: colors.secondary }]}>
                    {stats?.monthlyIncome || '₹2,65,000'} ({stats?.financialProgressPercent || 88}%)
                  </Text>
                </View>
              </View>
            )}

            {/* Expenses Summary Banner */}
            {type === 'expenses' && (
              <View style={[styles.summaryBanner, { backgroundColor: 'rgba(255, 218, 214, 0.3)' }]}>
                <View style={styles.bannerRow}>
                  <Text style={styles.bannerLabel}>Total Outflow This Month:</Text>
                  <Text style={[styles.bannerVal, { color: colors.error }]}>
                    {stats?.monthlyExpenses || '₹82,450'}
                  </Text>
                </View>
              </View>
            )}

            {/* Dues List or Transactions List */}
            {type === 'dues' ? (
              <View style={styles.listSection}>
                <Text style={styles.listHeaderTitle}>Pending Dues List</Text>
                {pendingDues.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="check-circle" size={40} color={colors.primary} />
                    <Text style={styles.emptyTitle}>All Dues Paid!</Text>
                    <Text style={styles.emptySub}>No flats currently have pending maintenance payments.</Text>
                  </View>
                ) : (
                  pendingDues.map((d: any, idx: number) => (
                    <View key={d._id || idx} style={styles.txRow}>
                      <View style={styles.txLeft}>
                        <View style={[styles.txIconBox, { backgroundColor: 'rgba(135, 159, 191, 0.2)' }]}>
                          <Text style={styles.flatText}>{d.flat}</Text>
                        </View>
                        <View>
                          <Text style={styles.txTitle}>{d.residentName || d.ownerName}</Text>
                          <Text style={styles.txMeta}>Owner: {d.ownerName}</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.txAmount, { color: colors.error }]}>₹2,500</Text>
                        <Text style={styles.dueBadge}>Pending</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            ) : (
              <View style={styles.listSection}>
                <Text style={styles.listHeaderTitle}>Transaction Ledger ({filteredTx.length})</Text>
                {filteredTx.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="receipt-long" size={40} color={colors.outlineVariant} />
                    <Text style={styles.emptyTitle}>No Transactions Recorded</Text>
                    <Text style={styles.emptySub}>There are no transactions logged in your database ledger yet.</Text>
                  </View>
                ) : (
                  filteredTx.map((t) => (
                    <View key={t._id} style={styles.txRow}>
                      <View style={styles.txLeft}>
                        <View
                          style={[
                            styles.txIconBox,
                            { backgroundColor: t.isCredit ? 'rgba(63, 102, 81, 0.1)' : 'rgba(186, 26, 26, 0.1)' },
                          ]}
                        >
                          <MaterialIcons
                            name={t.isCredit ? 'arrow-downward' : 'arrow-upward'}
                            size={18}
                            color={t.isCredit ? colors.primary : colors.error}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.txTitle}>{t.title}</Text>
                          <Text style={styles.txMeta}>
                            {t.category} • {t.date}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.txAmount, { color: t.isCredit ? colors.primary : colors.error }]}>
                        {t.isCredit ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer Action Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                onClose();
                if (type === 'dues') {
                  onNavigate('People');
                } else {
                  onNavigate('Finance');
                }
              }}
            >
              <Text style={styles.actionBtnText}>
                {type === 'dues' ? 'Open People Directory' : 'Open Finance Screen'}
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 28, 25, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineSm,
    fontSize: 18,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  scrollBody: {
    paddingVertical: 16,
  },
  calcCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 16,
  },
  calcTitle: {
    ...typography.labelLg,
    color: colors.onSurface,
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  calcLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  calcVal: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 8,
  },
  calcTotalLabel: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  calcTotalVal: {
    ...typography.headlineSm,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryBanner: {
    backgroundColor: 'rgba(63, 102, 81, 0.08)',
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 16,
    gap: 6,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  bannerVal: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  listSection: {
    gap: 10,
    marginBottom: 16,
  },
  listHeaderTitle: {
    ...typography.labelLg,
    color: colors.onSurface,
    marginBottom: 6,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  txMeta: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  txAmount: {
    ...typography.bodyLg,
    fontWeight: '700',
  },
  flatText: {
    ...typography.labelSm,
    fontWeight: '700',
    color: colors.onSurface,
  },
  dueBadge: {
    ...typography.labelSm,
    color: colors.error,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  emptyTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  emptySub: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    ...typography.labelLg,
    color: '#ffffff',
    fontWeight: '700',
  },
});
