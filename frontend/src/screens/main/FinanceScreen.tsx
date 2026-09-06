import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { ExpenseBreakdownBar } from '../../components/ExpenseBreakdownBar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { initialSocietyData } from '../../data/mockData';
import { useFocusEffect } from '@react-navigation/native';
import { financeService, FinanceSummaryData, TransactionItem } from '../../services/financeService';

export const FinanceScreen: React.FC<{ navigation: any }> = () => {
  const [summary, setSummary] = useState<FinanceSummaryData | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFinanceData = async () => {
    try {
      const [sumRes, txRes] = await Promise.all([
        financeService.getSummary(),
        financeService.getTransactions(),
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data);
      }
    } catch (err) {
      console.warn('Finance fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFinanceData();
    }, [])
  );

  if (loading && !summary) {
    return (
      <View style={styles.container}>
        <Header title="Finance" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Finance Details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Finance" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchFinanceData();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Balance Banner */}
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Society Balance</Text>
          <Text style={styles.balanceAmount}>{summary?.detailedBalance || '₹0'}</Text>
          <View style={styles.trendBadge}>
            <MaterialIcons name="trending-up" size={16} color={colors.primary} />
            <Text style={styles.trendText}>{summary?.balanceTrend || '+0% this month'}</Text>
          </View>
        </View>

        {/* Summary Cards: Inflow & Outflow */}
        <View style={styles.summaryRow}>
          <View style={styles.inflowCard}>
            <View style={[styles.cardTopStrip, { backgroundColor: colors.primary }]} />
            <MaterialIcons name="arrow-downward" size={24} color={colors.primary} style={styles.flowIcon} />
            <Text style={styles.flowLabel}>Total Inflow</Text>
            <Text style={styles.flowAmount}>{summary?.totalInflow || '₹0'}</Text>
          </View>

          <View style={styles.outflowCard}>
            <View style={[styles.cardTopStrip, { backgroundColor: colors.error }]} />
            <MaterialIcons name="arrow-upward" size={24} color={colors.error} style={styles.flowIcon} />
            <Text style={styles.flowLabel}>Total Outflow</Text>
            <Text style={styles.flowAmount}>{summary?.totalOutflow || '₹0'}</Text>
          </View>
        </View>

        {/* Major Expenses Breakdown */}
        {summary?.majorExpenses && summary.majorExpenses.length > 0 && (
          <View style={styles.sectionGap}>
            <Text style={styles.sectionTitle}>Major Expenses</Text>
            <ExpenseBreakdownBar categories={summary.majorExpenses} />
          </View>
        )}

        {/* Recent Transactions */}
        <View style={[styles.sectionGap, { marginBottom: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsCard}>
            {transactions.map((tx: any, idx: number) => (
              <View key={tx._id || tx.id || idx} style={styles.txRow}>
                <View
                  style={[
                    styles.txIconBg,
                    {
                      backgroundColor: tx.isCredit
                        ? colors.primaryContainer
                        : colors.errorContainer,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={
                      tx.category === 'Electricity'
                        ? 'bolt'
                        : tx.category === 'Maintenance'
                        ? 'home'
                        : 'plumbing'
                    }
                    size={20}
                    color={
                      tx.isCredit
                        ? colors.onPrimaryContainer
                        : colors.onErrorContainer
                    }
                  />
                </View>

                <View style={styles.txTextCol}>
                  <Text style={styles.txTitle} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.isCredit ? colors.primary : colors.onSurface },
                  ]}
                >
                  {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  balanceHeader: {
    paddingHorizontal: spacing.containerPaddingMobile,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(63, 102, 81, 0.05)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    ...typography.displayLg,
    color: colors.onSurface,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: 8,
  },
  trendText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: 16,
    marginBottom: 32,
  },
  inflowCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  outflowCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTopStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  flowIcon: {
    marginBottom: 8,
    opacity: 0.8,
  },
  flowLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  flowAmount: {
    ...typography.headlineMd,
    marginTop: 4,
  },
  sectionGap: {
    paddingHorizontal: spacing.containerPaddingMobile,
    marginBottom: 32,
  },
  approvalCard: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: borderRadius.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  approvalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(250, 249, 244, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  approvalContent: {
    flex: 1,
  },
  approvalTitle: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
    marginBottom: 4,
  },
  approvalDesc: {
    ...typography.bodyMd,
    color: colors.onSecondaryContainer,
    marginBottom: 12,
  },
  approvalBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  reviewBtnText: {
    ...typography.labelSm,
    color: colors.onSecondary,
  },
  dismissBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  dismissBtnText: {
    ...typography.labelSm,
    color: colors.secondary,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAllText: {
    ...typography.labelMd,
    color: colors.primary,
  },
  transactionsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    gap: 16,
  },
  txIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTextCol: {
    flex: 1,
  },
  txTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  txDate: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  txAmount: {
    ...typography.labelMd,
    fontWeight: '600',
  },
});
