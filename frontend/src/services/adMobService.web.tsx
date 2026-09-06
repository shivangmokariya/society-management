import React from 'react';

/**
 * Web implementation of AdMob service (Stub).
 * Native AdMob SDK is not supported on Web platform.
 */
export const initAdMob = async (): Promise<void> => {
  // Safe no-op on Web
};

export const renderBannerAd = (
  _unitId: string,
  _onAdFailedToLoad: (error: any) => void
): React.ReactNode => {
  return null;
};
