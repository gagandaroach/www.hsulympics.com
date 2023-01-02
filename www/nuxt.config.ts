import fs from 'fs'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    css: ['~/assets/css/main.css'],

    // https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
    runtimeConfig: {
        GOOGLE_API_KEY: fs.readFileSync('google-api-key.txt', 'utf-8'),
        HSULYMPICS_SPREADSHEET_ID: fs.readFileSync('google-api-hsu-sheets-id.txt', 'utf-8'),
        public: { apiBase: '/api' }
    },

    // 
    app: {
        pageTransition:
        {
            name: 'page', mode: 'out-in'
        }
    }
})