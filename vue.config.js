const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
 /* transpileDependencies: true,

  chainWebpack: (config) => {
    // Make sure the feature flags are injected correctly into the build
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0]['process.env'], {
        __VUE_OPTIONS_API__: JSON.stringify(true), // Enable or disable Options API
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // Disable Vue DevTools in production
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // Suppress hydration mismatch warnings
      });
      return definitions;
    });
  },

  pluginOptions: {
    vuetify: {
      // Vuetify plugin options
    },
  },

  pwa: {
    name: 'CattleInsurance',
    themeColor: '#4A90E2',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('/auth/(login|forgot-password|reset-password)'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'auth-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 },
          },
        },
        {
          urlPattern: new RegExp('^https://pashudhanbima.in/API/cattleInsuranceApi'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },*/
  pluginOptions: {
    vuetify: {
      // Vuetify plugin options
    },
  },
  pwa: {
    name: 'Pashudhanbima',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    manifestOptions: {
      short_name: 'VuePWA',
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
});
