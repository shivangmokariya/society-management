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
import { WaterTankVisual } from '../../components/WaterTankVisual';
import { RecordTankerModal } from '../../components/RecordTankerModal';
import { LogComplaintModal } from '../../components/LogComplaintModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { initialSocietyData } from '../../data/mockData';
import { operationService, ComplaintItem, AssetItem, WaterTankItem } from '../../services/operationService';

export const OperationsScreen: React.FC<{ navigation: any }> = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [tanks, setTanks] = useState<WaterTankItem[]>([]);

  // Dynamic Modals State
  const [tankerModalVisible, setTankerModalVisible] = useState(false);
  const [logComplaintModalVisible, setLogComplaintModalVisible] = useState(false);
  const [waterLastCleaned, setWaterLastCleaned] = useState('');
  const [expandedComplaintId, setExpandedComplaintId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOperationsData = async () => {
    try {
      const [compRes, assetRes, tankRes] = await Promise.all([
        operationService.getComplaints(),
        operationService.getAssets(),
        operationService.getWaterTanks(),
      ]);

      if (compRes.success && compRes.data) {
        setComplaints(compRes.data);
      }
      if (assetRes.success && assetRes.data) {
        setAssets(assetRes.data);
      }
      if (tankRes.success && tankRes.data?.tanks) {
        setTanks(tankRes.data.tanks);
        if (tankRes.data.waterLastCleaned) {
          setWaterLastCleaned(tankRes.data.waterLastCleaned);
        }
      }
    } catch (err) {
      console.warn('Operations fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
  }, []);

  const handleAddNewComplaint = (newComplaint: ComplaintItem) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const handleRecordTankerSuccess = (arrivalDate: string) => {
    setWaterLastCleaned(arrivalDate);
  };

  if (loading && complaints.length === 0 && assets.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Operations" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Operations Hub...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Operations" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOperationsData(); }} />
        }
      >
        {/* Title Greeting */}
        <View style={styles.titleSection}>
          <Text style={styles.hubTitle}>Operations Hub</Text>
          <Text style={styles.hubSub}>Real-time status of community assets and requests.</Text>
        </View>

        {/* Quick Actions Bento Grid */}
        <View style={styles.sectionGap}>
          <View style={styles.bentoGrid}>
            <TouchableOpacity
              style={styles.bentoPrimaryBtn}
              activeOpacity={0.8}
              onPress={() => setLogComplaintModalVisible(true)}
            >
              <MaterialIcons name="report-problem" size={24} color={colors.onPrimary} />
              <Text style={styles.bentoPrimaryText}>Log Complaint</Text>
            </TouchableOpacity>

            <View style={styles.bentoCol}>
              <TouchableOpacity
                style={styles.bentoSecondaryBtn}
                activeOpacity={0.8}
                onPress={() => setTankerModalVisible(true)}
              >
                <MaterialIcons name="local-shipping" size={20} color={colors.tertiary} />
                <Text style={styles.bentoSecondaryText}>Record Tanker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bentoSecondaryBtn} activeOpacity={0.8}>
                <MaterialIcons name="assignment-ind" size={20} color={colors.secondary} />
                <Text style={styles.bentoSecondaryText}>Staff Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Active Complaints */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Complaints ({complaints.length})</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setLogComplaintModalVisible(true)}
            >
              <Text style={styles.viewAllText}>+ Log New</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.complaintList}>
            {complaints.map((c: any, index: number) => {
              const compId = c._id || c.id || `comp-${index}`;
              const isExpanded = expandedComplaintId === compId;

              return (
                <TouchableOpacity
                  key={compId}
                  style={styles.complaintCard}
                  activeOpacity={0.85}
                  onPress={() => setExpandedComplaintId(isExpanded ? null : compId)}
                >
                  <View style={styles.complaintHeader}>
                    <View style={styles.complaintTextCol}>
                      <Text style={styles.complaintTitle}>{c.title}</Text>
                      <Text style={styles.complaintSub}>
                        {c.category} • {c.flat ? `Flat ${c.flat} • ` : ''}{c.timeAgo || 'Reported recently'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            c.status === 'In Progress'
                              ? 'rgba(182, 236, 241, 0.3)'
                              : 'rgba(255, 218, 214, 0.4)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color:
                              c.status === 'In Progress'
                                ? colors.onSecondaryContainer
                                : colors.error,
                          },
                        ]}
                      >
                        {c.status || 'Open'}
                      </Text>
                    </View>
                  </View>

                  {/* Complaint Description Details */}
                  {!!c.description && (
                    <View style={styles.descriptionBox}>
                      <Text style={styles.descriptionLabel}>Description:</Text>
                      <Text style={styles.descriptionText} numberOfLines={isExpanded ? undefined : 2}>
                        {c.description}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Water Management */}
        {tanks.length > 0 && (
          <View style={styles.sectionGap}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Water Management</Text>
              <TouchableOpacity onPress={() => setTankerModalVisible(true)} style={styles.tankerShortcutBtn}>
                <MaterialIcons name="local-shipping" size={16} color={colors.tertiary} />
                <Text style={styles.tankerShortcutText}>Record Tanker</Text>
              </TouchableOpacity>
            </View>

            <WaterTankVisual
              tanks={tanks.map((t: any, idx: number) => ({
                id: t._id || t.id || `tank-${idx}`,
                name: t.name,
                levelPercent: t.levelPercent,
                color: t.color,
              }))}
              lastCleaned={waterLastCleaned || 'N/A'}
              nextDue="15th of next month"
            />
          </View>
        )}

        {/* Asset Health */}
        {assets.length > 0 && (
          <View style={styles.sectionGap}>
            <Text style={styles.sectionTitle}>Asset Health</Text>

            <View style={styles.assetList}>
              {assets.map((ast: any, index: number) => (
                <View
                  key={ast._id || ast.id || index}
                  style={[
                    styles.assetCard,
                    ast.status === 'Service Due' && styles.assetServiceDue,
                  ]}
                >
                  <View style={styles.assetLeft}>
                    <View
                      style={[
                        styles.assetIconBg,
                        {
                          backgroundColor:
                            ast.status === 'Service Due'
                              ? 'rgba(255, 218, 214, 0.3)'
                              : 'rgba(125, 166, 142, 0.2)',
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={(ast.icon as any) || 'devices'}
                        size={20}
                        color={ast.status === 'Service Due' ? colors.error : colors.primary}
                      />
                    </View>
                    <Text style={styles.assetName}>{ast.name}</Text>
                  </View>

                  {ast.status === 'Active' ? (
                    <View style={styles.activeTag}>
                      <View style={styles.activeDot} />
                      <Text style={styles.activeTagText}>Active</Text>
                    </View>
                  ) : (
                    <Text style={styles.serviceDueText}>Service Due</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Staff Attendance Summary */}
        <View style={[styles.sectionGap, { marginBottom: 32 }]}>
          <View style={styles.staffCard}>
            <View style={styles.staffLeft}>
              <Text style={styles.staffLabel}>Staff Today</Text>
              <View style={styles.staffCountRow}>
                <Text style={styles.staffPresentNum}>
                  {initialSocietyData.staffAttendance.presentCount}
                </Text>
                <Text style={styles.staffTotalSub}>
                  / {initialSocietyData.staffAttendance.totalCount} Present
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.staffArrowBtn} activeOpacity={0.8}>
              <MaterialIcons name="arrow-forward" size={20} color={colors.secondaryContainer} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Dynamic Modals */}
      <RecordTankerModal
        visible={tankerModalVisible}
        onClose={() => setTankerModalVisible(false)}
        onSuccess={handleRecordTankerSuccess}
      />

      <LogComplaintModal
        visible={logComplaintModalVisible}
        onClose={() => setLogComplaintModalVisible(false)}
        onSuccess={handleAddNewComplaint}
      />
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
  titleSection: {
    paddingHorizontal: spacing.containerPaddingMobile,
    marginTop: 16,
    marginBottom: 24,
  },
  hubTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 4,
  },
  hubSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  sectionGap: {
    paddingHorizontal: spacing.containerPaddingMobile,
    marginBottom: 32,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoPrimaryBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 120,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bentoPrimaryText: {
    ...typography.labelMd,
    color: colors.onPrimary,
  },
  bentoCol: {
    flex: 1,
    gap: 16,
  },
  bentoSecondaryBtn: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.lg,
    padding: 12,
    gap: 8,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bentoSecondaryText: {
    ...typography.labelMd,
    color: colors.onSurface,
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
  viewAllText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  tankerShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(49, 102, 107, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  tankerShortcutText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.tertiary,
    fontWeight: '600',
  },
  complaintList: {
    gap: 12,
  },
  complaintCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 16,
    gap: 10,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  complaintTextCol: {
    flex: 1,
  },
  complaintTitle: {
    ...typography.labelMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  complaintSub: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    ...typography.labelSm,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  descriptionBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: 10,
    gap: 4,
  },
  descriptionLabel: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  descriptionText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 18,
  },
  assetList: {
    gap: 12,
  },
  assetCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  assetServiceDue: {
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(186, 26, 26, 0.5)',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetName: {
    ...typography.bodyMd,
    fontWeight: '500',
    color: colors.onSurface,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  activeTagText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  serviceDueText: {
    ...typography.labelSm,
    color: colors.error,
  },
  staffCard: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: borderRadius.xxl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  staffLeft: {
    gap: 4,
  },
  staffLabel: {
    ...typography.labelMd,
    color: colors.onSecondaryContainer,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  staffCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  staffPresentNum: {
    ...typography.displayLg,
    color: colors.onSecondaryContainer,
  },
  staffTotalSub: {
    ...typography.bodyMd,
    color: colors.onSecondaryContainer,
    opacity: 0.8,
  },
  staffArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.onSecondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
