// public variables defined at build time, cannot be overriden by env
// https://nuxt.com/docs/getting-started/configuration#app-configuration
export default defineAppConfig({
    title: 'Hsulympics 2022',
    theme: {
        // dark: true,
        colors: {
            primary: 'bg-red-200',
        }
    }
})
