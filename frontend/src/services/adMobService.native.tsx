import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';

/**
 * Native (Android & iOS) implementation of AdMob service.
 */
export const initAdMob = async (): Promise<void> => {
  try {
    await mobileAds().initialize();
    console.log('[AdMob] Native Mobile Ads SDK initialized successfully.');
  } catch (error) {
    console.warn('[AdMob] Native SDK initialization failed:', error);
  }
};

export const renderBannerAd = (
  unitId: string,
  onAdFailedToLoad: (error: any) => void
): React.ReactNode => {
  return (
    <BannerAd
      unitId={unitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdFailedToLoad={onAdFailedToLoad}
    />
  );
};
