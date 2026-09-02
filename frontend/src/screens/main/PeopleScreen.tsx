import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { initialSocietyData, Resident } from '../../data/mockData';
import { residentService } from '../../services/residentService';
import { societyService } from '../../services/societyService';
import { getImageUrl } from '../../services/api';
import { PaymentHistoryModal } from '../../components/PaymentHistoryModal';

export const PeopleScreen: React.FC<{ navigation: any }> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [residents, setResidents] = useState<any[]>(initialSocietyData.residents);
  const [loading, setLoading] = useState(true);

  // Payment Modal state
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [societySettings, setSocietySettings] = useState<{
    maintenanceAmount?: number;
    maintenanceDueDate?: string;
  }>({
    maintenanceAmount: initialSocietyData.maintenanceAmount,
    maintenanceDueDate: initialSocietyData.maintenanceDueDate,
  });

  const fetchSocietyDetails = async () => {
    try {
      const res = await societyService.getSocietyDetails();
      if (res.success && res.data) {
        setSocietySettings({
          maintenanceAmount: res.data.maintenanceAmount || initialSocietyData.maintenanceAmount,
          maintenanceDueDate: res.data.maintenanceDueDate || initialSocietyData.maintenanceDueDate,
        });
      }
    } catch (err) {
      console.warn('Error fetching society settings:', err);
    }
  };

  const fetchResidentsList = async () => {
    try {
      const res = await residentService.getResidents();
      if (res.success && res.data && res.data.length > 0) {
        setResidents(res.data);
      }
    } catch (err) {
      console.warn('Error fetching residents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidentsList();
    fetchSocietyDetails();
  }, []);

  const handleOpenPaymentHistory = (resident: any) => {
    setSelectedResident(resident);
    setPaymentModalVisible(true);
  };

  const filters = ['All', 'Block A', 'Block B', 'Block C'];

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.flat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.ownerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.residentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      selectedFilter === 'All' || r.block === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Header title="People" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search & Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <MaterialIcons
              name="search"
              size={20}
              color={colors.onSurfaceVariant}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by flat, name, or vehicle..."
              placeholderTextColor={colors.outline}
            />
          </View>

          {/* Quick Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((f) => {
              const isActive = selectedFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(f)}
                  activeOpacity={0.8}
                >
                  {f === 'All' && (
                    <MaterialIcons
                      name="apartment"
                      size={18}
                      color={isActive ? colors.onPrimary : colors.onSurfaceVariant}
                    />
                  )}
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {f === 'All' ? 'All Blocks' : f}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.8}>
              <MaterialIcons name="filter-list" size={18} color={colors.onSurfaceVariant} />
              <Text style={styles.filterText}>More</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Directory List */}
        <View style={styles.directoryList}>
          {filteredResidents.map((r) => (
            <TouchableOpacity
              key={r.id || r._id}
              style={styles.flatCard}
              activeOpacity={0.9}
              onPress={() => handleOpenPaymentHistory(r)}
            >
              {/* Decorative Accent Line */}
              <View
                style={[
                  styles.cardAccentLine,
                  {
                    backgroundColor:
                      r.status === 'Vacant'
                        ? 'rgba(113, 121, 115, 0.2)'
                        : r.paymentStatus === 'Pending'
                        ? 'rgba(186, 26, 26, 0.4)'
                        : 'rgba(63, 102, 81, 0.4)',
                  },
                ]}
              />

              {/* Card Header Row */}
              <View style={styles.cardHeaderRow}>
                <TouchableOpacity
                  onPress={() => handleOpenPaymentHistory(r)}
                  activeOpacity={0.7}
                >
                  <View style={styles.flatTitleRow}>
                    <Text style={styles.flatNumber}>{r.flat}</Text>
                    <View
                      style={[
                        styles.statusTag,
                        r.status === 'Vacant'
                          ? { backgroundColor: colors.surfaceContainerHighest }
                          : { backgroundColor: 'rgba(63, 102, 81, 0.1)' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          r.status === 'Vacant'
                            ? { color: colors.onSurfaceVariant }
                            : { color: colors.primary },
                        ]}
                      >
                        {r.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ownerText}>
                    Owner: <Text style={{ textDecorationLine: 'underline', color: colors.primary }}>{r.ownerName}</Text>
                  </Text>
                </TouchableOpacity>

                {/* Payment Status Badge */}
                <TouchableOpacity
                  style={styles.badgeWrapper}
                  onPress={() => handleOpenPaymentHistory(r)}
                  activeOpacity={0.7}
                >
                  {r.paymentStatus === 'Paid' ? (
                    <View style={styles.paidBadge}>
                      <MaterialIcons name="check-circle" size={16} color="#284E3B" />
                      <Text style={styles.paidBadgeText}>Paid</Text>
                    </View>
                  ) : r.paymentStatus === 'Pending' ? (
                    <View style={styles.pendingBadgeCol}>
                      <View style={styles.pendingBadge}>
                        <MaterialIcons name="schedule" size={16} color="#935500" />
                        <Text style={styles.pendingBadgeText}>Pending</Text>
                      </View>
                      {r.pendingAmount && (
                        <Text style={styles.dueAmountText}>{r.pendingAmount}</Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.noDuesBadge}>
                      <MaterialIcons name="info" size={16} color={colors.onSurfaceVariant} />
                      <Text style={styles.noDuesText}>No Dues</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Resident / Tenant Info Box */}
              {r.status !== 'Vacant' ? (
                <TouchableOpacity
                  style={styles.residentBox}
                  activeOpacity={0.8}
                  onPress={() => handleOpenPaymentHistory(r)}
                >
                  <View style={styles.avatarWrapper}>
                    {r.avatarUrl ? (
                      <Image source={{ uri: getImageUrl(r.avatarUrl) }} style={styles.residentAvatar} />
                    ) : (
                      <MaterialIcons name="person" size={24} color={colors.onSurfaceVariant} />
                    )}
                  </View>
                  <View style={styles.residentTextCol}>
                    <Text style={styles.residentLabel}>
                      Current Resident {r.isSelfOwner ? '(Owner Self)' : '(Rent / Tenant)'}
                    </Text>
                    <Text style={styles.residentName} numberOfLines={1}>
                      {r.residentName}
                    </Text>
                    <Text style={styles.viewPaymentHint}>Tap to view payment history & dues →</Text>
                  </View>
                  <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
                    <MaterialIcons name="call" size={20} color={colors.onSecondaryContainer} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <View style={styles.vacantBox}>
                  <MaterialIcons name="vpn-key" size={24} color={colors.outline} />
                  <Text style={styles.vacantText}>Available for rent</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Maintenance Payment History Modal */}
      <PaymentHistoryModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        resident={selectedResident}
        societySettings={societySettings}
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
  searchSection: {
    paddingHorizontal: spacing.containerPaddingMobile,
    paddingVertical: 16,
    gap: 16,
  },
  searchBox: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  directoryList: {
    paddingHorizontal: spacing.containerPaddingMobile,
    gap: 16,
    paddingBottom: 24,
  },
  flatCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    padding: 24,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  flatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flatNumber: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusTagText: {
    ...typography.labelSm,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  ownerText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F3ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  paidBadgeText: {
    ...typography.labelSm,
    color: '#284E3B',
  },
  pendingBadgeCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  pendingBadgeText: {
    ...typography.labelSm,
    color: '#935500',
  },
  dueAmountText: {
    ...typography.labelSm,
    color: colors.error,
  },
  noDuesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  noDuesText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  residentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 16,
    gap: 16,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  residentAvatar: {
    width: '100%',
    height: '100%',
  },
  residentTextCol: {
    flex: 1,
  },
  residentLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  residentName: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
  viewPaymentHint: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(182, 236, 241, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacantBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
  },
  vacantText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
