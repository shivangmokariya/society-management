import { Platform } from 'react-native';

/**
 * Google AdMob Configuration & Safety Module
 * ------------------------------------------
 * PRODUCTION SETUP INSTRUCTIONS:
 * 1. Set `USE_TEST_ADS = false` when building for production release.
 * 2. Replace `PRODUCTION_APP_ID_ANDROID` and `PRODUCTION_APP_ID_IOS` below with your real AdMob App IDs.
 * 3. Update `app.json` (under `expo.plugins` -> `react-native-google-mobile-ads`) with your real AdMob App IDs.
 * 4. Update `AndroidManifest.xml` (<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" ... />) with your real Android App ID.
 * 5. Replace `PRODUCTION_BANNER_ID_ANDROID` and `PRODUCTION_BANNER_ID_IOS` below with your real Banner Ad Unit IDs.
 */

// Toggle test ads (false for production builds; set to true if testing with Google test IDs)
export const USE_TEST_ADS = false;

// Google Official Test IDs
export const TEST_APP_ID_ANDROID = 'ca-app-pub-3940256099942544~3347511713';
export const TEST_APP_ID_IOS = 'ca-app-pub-3940256099942544~1458002511';
export const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';

// PRODUCTION ADMOB IDs
export const PRODUCTION_APP_ID_ANDROID = 'ca-app-pub-9212869320871563~3401237654';
export const PRODUCTION_APP_ID_IOS = 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX';
export const PRODUCTION_BANNER_ID_ANDROID = 'ca-app-pub-9212869320871563/2640644157';
export const PRODUCTION_BANNER_ID_IOS = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

/**
 * Returns the appropriate Banner Ad Unit ID based on environment, OS, and test settings.
 */
export const getBannerAdUnitId = (): string => {
  if (__DEV__ || USE_TEST_ADS) {
    return TEST_BANNER_ID;
  }

  return Platform.select({
    android: PRODUCTION_BANNER_ID_ANDROID,
    ios: PRODUCTION_BANNER_ID_IOS,
    default: TEST_BANNER_ID,
  });
};

/**
 * Central list of screens where ads should NOT be displayed by default.
 * Add route names here to suppress bottom banner ads on specific screens.
 */
export const AD_DISABLED_SCREENS: string[] = [
  'Login',
  'RegisterSecretary',
  'ForgotPassword',
  'VerifyOtp',
  'ResetPassword',
];

import { initAdMob as initAdMobPlatform } from '../services/adMobService';

/**
 * Safely initializes Mobile Ads SDK on supported native platforms.
 */
export const initAdMob = async (): Promise<void> => {
  return initAdMobPlatform();
};
