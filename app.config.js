export default ({ config }) => ({
  ...config,
  name: "edushield",
  slug: "edushield",
  version: "1.0.0",
  sdkVersion: "54.0.0",
  orientation: "portrait",
  icon: "./assets/edushield-high-resolution-logo-transparent (1).png",
  userInterfaceStyle: "light",
  newArchEnabled: true,

  splash: {
    image: "./assets/edushield-high-resolution-logo-transparent (1).png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },

  ios: {
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "EduShield necesita tu ubicación para activar alertas de seguridad.",
      NSCameraUsageDescription:
        "Esta aplicación necesita acceso a la cámara para tomar o cambiar tu foto de perfil.",
      NSPhotoLibraryUsageDescription:
        "Esta aplicación necesita acceso a tu galería para seleccionar una foto de perfil.",
    },
  },

  android: {
    permissions: [
      "ACCESS_FINE_LOCATION",
      "CAMERA",
      "RECORD_AUDIO",
      "READ_MEDIA_IMAGES",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.darmando.alcala.edushield",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },

  plugins: [
    "expo-asset",
    "expo-font",
    "expo-maps",
    "expo-camera",
    "expo-media-library",
    "expo-image-picker",
  ],

  extra: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    eas: {
      projectId: "f242d91a-53ea-462d-85fc-d27c7d957669",
    },
  },
});
