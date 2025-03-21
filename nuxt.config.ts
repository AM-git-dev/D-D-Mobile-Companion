// https://nuxt.com/docs/api/configuration/nuxt-config
  
  export default defineNuxtConfig({
    typescript: {
      shim: false, // Désactive TypeScript
      strict: false
    },
    compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules:[
      '@pinia/nuxt'
  ],
  css: ["@/assets/styles.css"],
runtimeConfig: {
  public: {
    firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
  }
}
  })
  

