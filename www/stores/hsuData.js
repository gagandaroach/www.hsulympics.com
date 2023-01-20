import { defineStore } from 'pinia'

export const useHsuDataStore = defineStore('hsuStore', {
    state: () => ({
        sheets: {},
        teams: [],
        games: [],
        players: [],
        scores: [],
        lastUpdated: new Date().toUTCString(),
        // state
        loaded: false,
        loading: false,
        error: null
    }),
    getters: {
        tedams(state) {
            return state.sheets['Teams']
        },
    },
    actions: {
        async refreshSheets() {
            this.loading = true;
            try {
                this.sheets = await fetch('/api/sheets').then((response) => response.json());
                this.teams = this.sheets['Teams']
                this.games = this.sheets['Games']
                this.players = this.sheets['Players']
                this.scores = this.sheets['Scores']
                this.loaded = true;
                this.lastUpdated = new Date().toUTCString();
            } catch (error) {
                this.error = error
                console.log('hsu store ran into error :(')
                console.log(error)
            } finally {
                this.loading = false;
            }
        },
        teamPlayers(team_id) {
            let team_players = {};
            for (const player in this.players) {
                if (Object.hasOwnProperty.call(this.players, player)) {
                    const p = this.players[player];
                    if (p.team === team_id) {
                        team_players[player] = p;
                    }
                }
            }
            return team_players;
        }
    }
})
