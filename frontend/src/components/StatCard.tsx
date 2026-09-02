import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

interface StatCardProps {
  label: string;
  value: string;
  accentColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  accentColor = 'rgba(125, 166, 142, 0.2)',
  textColor = colors.onSurface,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.cornerAccent, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.lg,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'rgba(51, 58, 61, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
    flex: 1,
    minWidth: '45%',
  },
  cornerAccent: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  content: {
    zIndex: 1,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    ...typography.headlineMd,
  },
});
