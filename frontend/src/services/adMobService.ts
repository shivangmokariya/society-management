import React from 'react';

/**
 * Base AdMob service interface / default fallback.
 * Metro resolves adMobService.native.tsx on native platforms and adMobService.web.tsx on Web.
 */
export const initAdMob = async (): Promise<void> => {};

export const renderBannerAd = (
  _unitId: string,
  _onAdFailedToLoad: (error: any) => void
): React.ReactNode => {
  return null;
};
