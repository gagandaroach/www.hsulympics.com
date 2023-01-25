import { defineStore } from 'pinia'

const placement_to_score_map = {
    1: 20,
    2: 16,
    3: 13,
    4: 10,
    5: 8
}

export const useHsuDataStore = defineStore('hsuStore', {
    state: () => ({
        sheets: {},
        teams: [],
        games: [],
        players: [],
        scores: [],
        lastUpdated: new Date().toLocaleString(),
        // state
        loaded: false,
        loading: false,
        error: null
    }),
    getters: {
        activeGames(state) {
            let active = {};
            for (const game in state.games) {
                if (Object.hasOwnProperty.call(state.games, game)) {
                    const game_score = state.games[game];
                    if (game_score.show === "TRUE") {
                        active[game] = game_score;
                    }
                }
            }
            return active;
        },
        activeGameScores(state) {
            let active = {};
            for (const gs in state.scores) {
                if (Object.hasOwnProperty.call(state.scores, gs)) {
                    const score = state.scores[gs];
                    if (score.show === "TRUE") {
                        active[gs] = score;
                    }
                }
            }
            return active;
        },
        num_teams(state) {
            if (state.loaded) {
                return state.scores["1"].scores.length
            } else {
                return 0;
            }
        }
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
                this.lastUpdated = new Date().toLocaleString();
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
        },
        teamPositionsForGame(game_idx) {
            // { "id": "1", "scores": [ "1", "2", "4", "5", "2" ], "show": "TRUE" }
            // { "id": "7", "scores": [ "--", "--", "--", "--", "--" ], "show": "TRUE" }
            const game_score = this.scores[game_idx];
            const game_placements = game_score.scores;

            const placements = {}
            for (let index = 1; index <= game_placements.length; index++) {
                placements[index.toString()] = []
                if (game_placements[index-1] == '--')
                {
                    return []
                }
            }

            for (let index = 1; index <= game_placements.length; index++) {
                const score = game_placements[index-1]
                // console.log(score)
                placements[score].push(index)
            }

            return placements;
        },
        teamScoresForGame(game_idx) {
            // { "1": [ 1 ], "2": [ 2, 5 ], "3": [], "4": [ 3 ], "5": [ 4 ] }
            // { "1": [ 4 ], "2": [ 3 ], "3": [ 5 ], "4": [ 1 ], "5": [ 2 ] }
            const team_placements = this.teamPositionsForGame(game_idx);

            // init scores
            // { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
            const team_scores = {}
            const game_score = this.scores[game_idx];
            for (let idx = 0; idx < game_score.scores.length; idx++) {
                team_scores[idx + 1] = 0;
            }
            
            // teamPositions is undefined, have -- in score :( 
            // so return 0 for all teams
            if (team_placements.length == 0)
            {
                // console.log(`game ${game_idx} has -- score, returning 0 for all teams.`)
                return team_scores;
            }

            // for place in placements
            for (let place = 1; place <= Object.keys(team_placements).length; place++) {

                // Only one team placed at position, set their score
                if (team_placements[place].length == 1)
                {
                    const team_id = team_placements[place];
                    team_scores[team_id] = placement_to_score_map[place];
                }

                // Multiple teams tied for position
                else if (team_placements[place].length >= 1)
                {
                    const num_tied_teams = team_placements[place].length;

                    // Compute the tied
                    let total_tie_score = 0
                    for (let idx2 = 0; idx2 < num_tied_teams; idx2++) {
                        total_tie_score = total_tie_score + placement_to_score_map[place + idx2];
                    }
                    const tie_score = total_tie_score / num_tied_teams;

                    for (let team_tied_idx = 0; team_tied_idx < num_tied_teams; team_tied_idx++)
                    {
                        const team_id = team_placements[place][team_tied_idx];
                        team_scores[team_id] = tie_score;
                    }
                }
            }
            return team_scores
        },
        totalScores() {
            const team_scores = {}
            for (let idx = 0; idx < this.num_teams; idx++) {
                team_scores[idx + 1] = 0;
            }

            for (const score_idx in this.activeGameScores) {
                if (Object.hasOwnProperty.call(this.activeGameScores, score_idx)) {
                    const score = this.activeGameScores[score_idx];
                    const game_team_scores = this.teamScoresForGame(score.id);
                    for (const team_id in game_team_scores) {
                        if (Object.hasOwnProperty.call(game_team_scores, team_id)) {
                            if (team_id != undefined) {
                                team_scores[team_id] += game_team_scores[team_id];
                            }
                        }
                    }
                }
            }

            return team_scores;
        }
    }
})