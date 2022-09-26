import colors from 'vuetify/es5/util/colors'
import minifyTheme from 'minify-css-string'

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  head: {
    titleTemplate: '%s - ISKER Group',
    title: 'Главная страница',
    meta: [
      { charset: 'utf-8' },
      // { name: 'viewport', content: 'width=1280px, initial-scale=1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'ISKER Group', name: 'ISKER Group', content: 'ISKER Group tender portal' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:locale', name: 'og:locale', content: 'ru_RU' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:title', name: 'og:title', content: 'ISKER Group' },
      { hid: 'og:description', name: 'og:description', content: 'ISKER Group tender portal' },
      { hid: 'og:image', name: 'og:image', content: '/icon.png' },
      { hid: 'og:url', name: 'og:url', content: 'http://tender.isker.kz/' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'ISKER Group' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon.png' }
    ]
  },
  server: {
    // host: '192.168.163.10', // default: localhost
    // port: 8080 // default: 3000

    default: 'localhost',
    port: 8080 // default: 3000

    // host: '0.0.0.0', // docker
    // port: 3000 // docker
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/css/main_styles.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    'nuxt-material-design-icons-iconfont',
    'nuxt-i18n',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'http://localhost:8000/',
    // baseURL: process.env.NODE_ENV === 'production' ? 'http://45.86.80.37:8000' : 'http://localhost:8000'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.shades.white,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
      },
    },
    options: { minifyTheme },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify/lib'],
  },

  router: {
    middleware: ['auth'] // Перенаправление на Логин если не залогинился
  },

  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        localStorage: {
          prefix: 'auth.'
        },
        token: {
          prefix: 'access_token.',
          property: 'access',
          maxAge: 60,
          global: true,
          required: true,
          type: 'Bearer'
        },
        refreshToken:{
          prefix: 'refresh_token.',
          property: 'refresh',
          data: 'refresh',
          maxAge: 60 * 60 * 24 * 30
        },

        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/token/', method: 'post' },
          login_bin: { url: '/api/token_bin/', method: 'post' },
          refresh: { url: '/api/token/refresh/', method: 'post' },
          user: { url: '/api/v1/profile/', method: 'get' },
          logout: { url: '/api/logout/', method: 'post' }
        },
        redirect: {
          login: '/',
          logout: '/',
          callback: '/',
          home: '/',
        },
      },
      local_bin: {
        scheme: 'refresh',
        localStorage: {
          prefix: 'auth.'
        },
        token: {
          prefix: 'access_token.',
          property: 'access',
          maxAge: 60,
          global: true,
          required: true,
          type: 'Bearer'
        },
        refreshToken:{
          prefix: 'refresh_token.',
          property: 'refresh',
          data: 'refresh',
          maxAge: 60 * 60 * 24 * 30
        },

        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/token_bin/', method: 'post' },
          refresh: { url: '/api/token/refresh/', method: 'post' },
          user: { url: '/api/v1/profile/', method: 'get' },
          logout: { url: '/api/logout/', method: 'post' }
        },
        redirect: {
          login: '/',
          logout: '/',
          callback: '/',
          home: '/',
        },
      }
    }
  }

}
