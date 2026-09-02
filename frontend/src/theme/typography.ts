import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 48,
    lineHeight: 52.8,
    letterSpacing: -0.96,
    color: colors.onSurface,
  },
  headlineLg: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 32,
    lineHeight: 38.4,
    letterSpacing: -0.32,
    color: colors.onSurface,
  },
  headlineLgMobile: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 26,
    lineHeight: 31.2,
    color: colors.onSurface,
  },
  headlineMd: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 24,
    lineHeight: 31.2,
    color: colors.onSurface,
  },
  bodyLg: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 18,
    lineHeight: 28.8,
    color: colors.onSurface,
  },
  bodyMd: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurface,
  },
  labelMd: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.14,
    color: colors.onSurfaceVariant,
  },
  labelSm: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    lineHeight: 14.4,
    letterSpacing: 0.6,
    color: colors.onSurfaceVariant,
  },
};
