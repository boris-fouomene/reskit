import { Platform } from 'react-native';

export const DEFAULT_IMAGE_DIMENSIONS = 36;

export const IS_ANDROID = Platform.OS === 'android';

const IS_IOS = Platform.OS === 'ios';


const PLATFORM_VERSION: number = (typeof Platform.Version == 'string' ? parseInt(Platform.Version) : Platform.Version) || 10;


export const IS_IOS_BELOW_11 = IS_IOS && PLATFORM_VERSION < 11;

