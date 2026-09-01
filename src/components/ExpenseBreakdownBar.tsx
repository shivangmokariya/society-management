import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

export interface ExpenseCategory {
  category: string;
  amount: string;
  percentage: number;
  color: string;
}

interface ExpenseBreakdownBarProps {
  categories?: ExpenseCategory[];
}

export const ExpenseBreakdownBar: React.FC<ExpenseBreakdownBarProps> = ({
  categories = [
    { category: 'Security', amount: '₹90,000', percentage: 67, color: colors.primary },
    { category: 'Cleaning', amount: '₹25,000', percentage: 18, color: colors.secondary },
    { category: 'Electricity', amount: '₹18,500', percentage: 15, color: colors.tertiary },
  ],
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.list}>
        {categories.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.labelRow}>
              <View style={styles.categoryLeft}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.category}</Text>
              </View>
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    padding: 24,
    shadowColor: 'rgba(51, 58, 61, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  list: {
    gap: 20,
  },
  item: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  amountText: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
