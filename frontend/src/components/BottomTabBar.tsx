import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const tabIconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Dashboard: 'dashboard',
  People: 'group',
  Finance: 'account-balance-wallet',
  Operations: 'settings-suggest',
  MoreOptions: 'more-horiz',
};

const tabLabelMap: Record<string, string> = {
  Dashboard: 'Home',
  People: 'People',
  Finance: 'Finance',
  Operations: 'Ops',
  MoreOptions: 'More',
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.barContent}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = tabIconMap[route.name] || 'dashboard';
          const label = tabLabelMap[route.name] || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <MaterialIcons
                name={iconName}
                size={24}
                color={isFocused ? colors.primary : colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.primary : colors.onSurfaceVariant },
                  isFocused && styles.activeTabLabel,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 249, 244, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 58, 61, 0.06)',
    paddingBottom: 12,
    zIndex: 50,
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    ...typography.labelSm,
    fontSize: 12,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
