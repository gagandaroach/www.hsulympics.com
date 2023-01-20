import { defineStore } from 'pinia'

export const useHsuDataStore = defineStore('hsuStore', {
    state: () => ({
        sheets: {},

        // state
        loaded: false,
        loading: false,
        error: null
    }),
    getters: {
        teams(state) {
            return state.sheets['Teams']
        },
        games(state) {
            return state.sheets['Games']
        },
        players(state) {
            return state.sheets['Players']
        },
        scores(state) {
            return state.sheets['Scores']
        }
    },
    actions: {
        async refreshSheets() {
            this.loading = true;
            try {
                this.sheets = await fetch('/api/sheets').then((response) => response.json());
                console.log('loaded this.sheets: ')
                console.log(this.sheets)
                this.loaded = true;
            } catch (error) {
                this.error = error
                console.log('hsu store ran into error :(')
                console.log(error)
            } finally {
                this.loading = false;
            }
        }
    }
})
