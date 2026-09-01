import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

interface FinancialProgressChartProps {
  percentage?: number;
  targetText?: string;
}

export const FinancialProgressChart: React.FC<FinancialProgressChartProps> = ({
  percentage = 90,
  targetText = "₹2,65,000 of ₹3,00,000 target",
}) => {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Progress</Text>
        <Text style={styles.iconSymbol}>monitoring</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.svgWrapper}>
          <Svg width={160} height={160} viewBox="0 0 100 100">
            {/* Background circle */}
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke={colors.surfaceContainerHighest}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress ring */}
            <Circle
              cx="50"
              cy="50"
              r={radius}
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </Svg>
          <View style={styles.centerText}>
            <Text style={styles.percentText}>{percentage}%</Text>
            <Text style={styles.collectedLabel}>Collected</Text>
          </View>
        </View>
        <Text style={styles.subText}>{targetText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xxl,
    padding: 24,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    ...typography.headlineMd,
  },
  iconSymbol: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 22,
    color: colors.onSurfaceVariant,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  svgWrapper: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    ...typography.displayLg,
    fontSize: 44,
    lineHeight: 48,
    color: colors.onSurface,
  },
  collectedLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  subText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
