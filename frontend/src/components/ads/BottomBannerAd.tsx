import React, { useState } from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { getBannerAdUnitId } from '../../config/adConfig';
import { renderBannerAd } from '../../services/adMobService';

export interface BottomBannerAdProps {
  /** Toggle whether ad should be rendered. Defaults to true. */
  enabled?: boolean;
  /** Optional custom Ad Unit ID to override default configuration */
  adUnitIdOverride?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export const BottomBannerAd: React.FC<BottomBannerAdProps> = ({
  enabled = true,
  adUnitIdOverride,
  style,
}) => {
  const [adFailed, setAdFailed] = useState(false);

  // Do not render if explicitly disabled, if previous load failed, or on Web platform
  if (!enabled || adFailed || Platform.OS === 'web') {
    return null;
  }

  const adUnitId = adUnitIdOverride || getBannerAdUnitId();
  const banner = renderBannerAd(adUnitId, (error: any) => {
    console.warn('[BottomBannerAd] Banner ad failed to load gracefully:', error);
    setAdFailed(true);
  });

  if (!banner) {
    return null;
  }

  return <View style={[styles.container, style]}>{banner}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 4,
    zIndex: 10,
  },
});
