export default {
  expo: {
    name: "Ecolens",
    slug: "Ecolens",
    version: "1.0.0",
    scheme: "ecolens",
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    },
    plugins: ["expo-font", "expo-router"],
  },
};
