// public variables defined at build time, cannot be overriden by env
// https://nuxt.com/docs/getting-started/configuration#app-configuration
export default defineAppConfig({
    title: 'Hsulympics',
    theme: {
        // dark: true,
        colors: {
            primary: 'bg-red-700 text-white',
        }
    }
})
