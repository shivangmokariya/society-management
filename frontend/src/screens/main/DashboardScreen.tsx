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
import { StatCard } from '../../components/StatCard';
import { FinancialProgressChart } from '../../components/FinancialProgressChart';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { initialSocietyData } from '../../data/mockData';
import { StatBreakdownModal } from '../../components/StatBreakdownModal';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { societyService, DashboardData } from '../../services/societyService';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<'balance' | 'income' | 'expenses' | 'dues' | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await societyService.getDashboardData(token || undefined);
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboard();
    }, [token])
  );

  const stats = dashboardData?.dashboardStats;
  const society = dashboardData?.society;
  const secretaryName = user?.fullName || society?.secretaryName || initialSocietyData.secretaryName;
  const societyName = society?.name || initialSocietyData.name;

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchDashboard();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Good morning, {secretaryName}</Text>
          <Text style={styles.greetingSubtitle}>Here's what's happening in {societyName} today.</Text>
        </View>

        {/* 4 Stat Cards Grid */}
        <View style={styles.sectionGap}>
          <View style={styles.statGrid}>
            <StatCard
              label="Current Balance"
              value={stats?.currentBalance || initialSocietyData.currentBalance}
              accentColor="rgba(125, 166, 142, 0.2)"
              textColor={colors.onSurface}
              onPress={() => setSelectedStatType('balance')}
            />
            <StatCard
              label="Income (This Month)"
              value={stats?.monthlyIncome || initialSocietyData.monthlyIncome}
              accentColor="rgba(182, 236, 241, 0.2)"
              textColor={colors.secondary}
              onPress={() => setSelectedStatType('income')}
            />
            <StatCard
              label="Expenses"
              value={stats?.monthlyExpenses || initialSocietyData.monthlyExpenses}
              accentColor="rgba(255, 218, 214, 0.3)"
              textColor={colors.error}
              onPress={() => setSelectedStatType('expenses')}
            />
            <StatCard
              label="Pending Dues"
              value={`${stats?.pendingDuesFlats ?? initialSocietyData.pendingDuesFlats} Flats`}
              accentColor="rgba(135, 159, 191, 0.2)"
              textColor={colors.tertiary}
              onPress={() => setSelectedStatType('dues')}
            />
          </View>
        </View>

        {/* Financial Progress Radial Chart */}
        <View style={styles.sectionGap}>
          <FinancialProgressChart
            percentage={stats?.financialProgressPercent ?? initialSocietyData.financialProgressPercent}
            targetText={`${stats?.monthlyIncome || initialSocietyData.monthlyIncome} of ${
              stats?.monthlyIncomeTarget || initialSocietyData.monthlyIncomeTarget
            } target`}
          />
        </View>

        {/* Attention Required */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attention Required</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>
                {(dashboardData?.attentionItems || initialSocietyData.attentionItems).length} Tasks
              </Text>
            </View>
          </View>

          <View style={styles.attentionList}>
            {(dashboardData?.attentionItems || initialSocietyData.attentionItems).map((item: any, idx: number) => (
              <View
                key={item._id || item.id || idx}
                style={[
                  styles.attentionCard,
                  {
                    borderLeftColor:
                      item.type === 'error'
                        ? colors.error
                        : item.type === 'tertiary'
                        ? colors.tertiary
                        : colors.secondary,
                  },
                ]}
              >
                <MaterialIcons
                  name={(item.icon as any) || 'info'}
                  size={20}
                  color={
                    item.type === 'error'
                      ? colors.error
                      : item.type === 'tertiary'
                      ? colors.tertiary
                      : colors.secondary
                  }
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextCol}>
                  <Text style={styles.attentionCardTitle}>{item.title}</Text>
                  <Text style={styles.attentionCardSub}>{item.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.timelineList}>
              {/* Vertical line connector */}
              <View style={styles.timelineLine} />

              {(dashboardData?.recentActivities || initialSocietyData.recentActivities).map((act: any, index: number) => (
                <View key={act.id} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDotOuter,
                      { borderColor: act.active ? colors.primary : colors.surfaceVariant },
                    ]}
                  >
                    <View
                      style={[
                        styles.timelineDotInner,
                        { backgroundColor: act.active ? colors.primary : colors.surfaceVariant },
                      ]}
                    />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{act.title}</Text>
                    <Text style={styles.timelineTime}>{act.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Upcoming */}
        <View style={[styles.sectionGap, { marginBottom: 32 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Upcoming</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upcomingScroll}>
            {(dashboardData?.upcomingEvents || initialSocietyData.upcomingEvents).map((evt: any, index: number) => (
              <View
                key={evt._id || evt.id || index}
                style={[
                  styles.eventCard,
                  {
                    backgroundColor:
                      evt.bgClass === 'primaryContainer'
                        ? colors.primaryContainer
                        : colors.secondaryContainer,
                  },
                ]}
              >
                <MaterialIcons
                  name={evt.icon as any}
                  size={32}
                  color={
                    evt.bgClass === 'primaryContainer'
                      ? colors.onPrimaryContainer
                      : colors.onSecondaryContainer
                  }
                  style={{ opacity: 0.8, marginBottom: 12 }}
                />
                <Text
                  style={[
                    styles.eventTitle,
                    {
                      color:
                        evt.bgClass === 'primaryContainer'
                          ? colors.onPrimaryContainer
                          : colors.onSecondaryContainer,
                    },
                  ]}
                >
                  {evt.title}
                </Text>
                <Text
                  style={[
                    styles.eventTime,
                    {
                      color:
                        evt.bgClass === 'primaryContainer'
                          ? colors.onPrimaryContainer
                          : colors.onSecondaryContainer,
                    },
                  ]}
                >
                  {evt.time}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <StatBreakdownModal
        visible={!!selectedStatType}
        type={selectedStatType}
        onClose={() => setSelectedStatType(null)}
        onNavigate={(screen) => navigation.navigate(screen)}
        stats={stats}
        transactions={dashboardData?.recentTransactions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  greetingSection: {
    paddingHorizontal: spacing.containerPaddingMobile,
    marginVertical: 24,
  },
  greetingTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 8,
  },
  greetingSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  sectionGap: {
    paddingHorizontal: spacing.containerPaddingMobile,
    marginBottom: 32,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  badgeCount: {
    backgroundColor: colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeCountText: {
    ...typography.labelSm,
    color: colors.onErrorContainer,
    fontSize: 10,
  },
  attentionList: {
    gap: 12,
  },
  attentionCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardIcon: {
    marginTop: 2,
  },
  cardTextCol: {
    flex: 1,
  },
  attentionCardTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  attentionCardSub: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  viewAllText: {
    ...typography.labelSm,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  activityCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xxl,
    padding: 24,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  timelineList: {
    position: 'relative',
    paddingLeft: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: colors.surfaceVariant,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 24,
  },
  timelineDotOuter: {
    position: 'absolute',
    left: -24,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineContent: {
    gap: 4,
  },
  timelineTitle: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  timelineTime: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  upcomingScroll: {
    gap: 16,
  },
  eventCard: {
    width: 240,
    borderRadius: borderRadius.xxl,
    padding: 24,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  eventTitle: {
    ...typography.headlineMd,
    marginBottom: 4,
  },
  eventTime: {
    ...typography.bodyMd,
    opacity: 0.9,
  },
});
