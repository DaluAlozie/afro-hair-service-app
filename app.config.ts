import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "Crown Space",
  slug: "afro-hair-service",
  ...config,
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_API_KEY
        }
      }
    },
    ios: {
      ...config.ios,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [process.env.GOOGLE_IOS_URL_SCHEME]
          }
        ]
      }
    }
  });