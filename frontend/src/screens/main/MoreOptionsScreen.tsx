import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { societyService } from '../../services/societyService';
import { SocietySettingsModal } from '../../components/SocietySettingsModal';

interface MoreOptionsScreenProps {
  navigation: any;
}

export const MoreOptionsScreen: React.FC<MoreOptionsScreenProps> = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [societyModalVisible, setSocietyModalVisible] = useState(false);
  const [societySettings, setSocietySettings] = useState<{
    maintenanceAmount: number;
    maintenanceDueDate: string;
    monthSchedule?: { [key: number]: number };
  }>({
    maintenanceAmount: 2500,
    maintenanceDueDate: '5th of every month',
  });

  React.useEffect(() => {
    (async () => {
      try {
        const res = await societyService.getSocietyDetails();
        if (res.success && res.data) {
          setSocietySettings({
            maintenanceAmount: res.data.maintenanceAmount || 2500,
            maintenanceDueDate: res.data.maintenanceDueDate || '5th of every month',
            monthSchedule: res.data.monthSchedule,
          });
        }
      } catch (err) {
        console.warn('Error fetching society details:', err);
      }
    })();
  }, []);

  const menuItems = [
    {
      id: 'my-profile',
      title: 'My Profile',
      subtitle: 'Edit name, phone number & profile avatar',
      icon: 'manage-accounts',
      action: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'add-owner',
      title: 'Add New Owner',
      subtitle: 'Register property landlord or owner',
      icon: 'person-add',
      action: () => navigation.navigate('AddOwner'),
    },
    {
      id: 'add-tenant',
      title: 'Add New Tenant',
      subtitle: 'Record a new tenant residency',
      icon: 'group-add',
      action: () => navigation.navigate('AddTenant'),
    },
    {
      id: 'society-profile',
      title: 'Society Profile & Maintenance',
      subtitle: `Configure monthly dues (₹${societySettings.maintenanceAmount}) & due date (${societySettings.maintenanceDueDate})`,
      icon: 'apartment',
      action: () => setSocietyModalVisible(true),
    },
    {
      id: 'logout',
      title: 'Sign Out',
      subtitle: 'Log out of secretary account',
      icon: 'logout',
      danger: true,
      action: () => logout(),
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="More Options" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Management & Actions</Text>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuRow,
                idx === menuItems.length - 1 && styles.noBorderRow,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconCircle,
                  item.danger && { backgroundColor: colors.errorContainer },
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={20}
                  color={item.danger ? colors.error : colors.primary}
                />
              </View>

              <View style={styles.textCol}>
                <Text
                  style={[
                    styles.menuTitle,
                    item.danger && { color: colors.error },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              <MaterialIcons
                name="chevron-right"
                size={20}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Society Settings Modal */}
      <SocietySettingsModal
        visible={societyModalVisible}
        onClose={() => setSocietyModalVisible(false)}
        currentSettings={societySettings}
        onSaveSuccess={(newSettings) => {
          setSocietySettings({
            maintenanceAmount: newSettings.maintenanceAmount,
            maintenanceDueDate: newSettings.maintenanceDueDate,
            monthSchedule: newSettings.monthSchedule,
          });
        }}
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
    padding: spacing.containerPaddingMobile,
    paddingBottom: 100,
  },
  sectionTitleRow: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  menuCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    gap: 16,
  },
  noBorderRow: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(125, 166, 142, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  menuTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
