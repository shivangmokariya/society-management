import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

interface WaterTankVisualProps {
  tanks?: Array<{
    id: string;
    name: string;
    levelPercent: number;
    color?: string;
  }>;
  lastCleaned?: string;
  nextDue?: string;
}

export const WaterTankVisual: React.FC<WaterTankVisualProps> = ({
  tanks = [
    { id: 'tank-1', name: 'Tank 1', levelPercent: 85, color: colors.tertiaryContainer },
    { id: 'tank-2', name: 'Tank 2', levelPercent: 40, color: colors.tertiary },
  ],
  lastCleaned = '12 Aug',
  nextDue = '15 Sep',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tanksRow}>
        {tanks.map((tank) => (
          <View key={tank.id} style={styles.tankItem}>
            <View style={styles.tankBody}>
              <View
                style={[
                  styles.waterFill,
                  {
                    height: `${tank.levelPercent}%`,
                    backgroundColor: tank.color || colors.tertiary,
                  },
                ]}
              />
              <Text style={styles.percentText}>{tank.levelPercent}%</Text>
            </View>
            <Text style={styles.tankName}>{tank.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBanner}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Last Cleaned</Text>
          <Text style={styles.infoVal}>{lastCleaned}</Text>
        </View>
        <View style={styles.divider} />
        <View style={[styles.infoCol, { alignItems: 'flex-end' }]}>
          <Text style={styles.infoLabel}>Next Due</Text>
          <Text style={styles.infoVal}>{nextDue}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 20,
  },
  tanksRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 128,
  },
  tankItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  tankBody: {
    width: 64,
    height: 96,
    backgroundColor: colors.surfaceContainerHighest,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  waterFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  percentText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 96,
    ...typography.labelSm,
    fontWeight: '700',
    color: colors.onSurface,
  },
  tankName: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.md,
    padding: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  infoVal: {
    ...typography.bodyMd,
    fontWeight: '500',
    color: colors.onSurface,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: 12,
  },
});
