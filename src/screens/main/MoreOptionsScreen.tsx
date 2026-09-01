import React from 'react';
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

interface MoreOptionsScreenProps {
  navigation: any;
}

export const MoreOptionsScreen: React.FC<MoreOptionsScreenProps> = ({ navigation }) => {
  const menuItems = [
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
      id: 'reg-secretary',
      title: 'Register Secretary',
      subtitle: 'Request access as a society secretary',
      icon: 'admin-panel-settings',
      action: () => navigation.navigate('RegisterSecretary'),
    },
    {
      id: 'society-profile',
      title: 'Society Profile',
      subtitle: 'Green View Society settings & rules',
      icon: 'apartment',
      action: () => {},
    },
    {
      id: 'logout',
      title: 'Sign Out',
      subtitle: 'Log out of secretary account',
      icon: 'logout',
      danger: true,
      action: () =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
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
