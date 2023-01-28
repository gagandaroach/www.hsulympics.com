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
        refreshEnabled: true,
        refreshInterval: 5000,
        loaded: false,
        loading: false,
        error: null,
        // timer / live
        currentTime: Math.trunc(new Date().getTime() / 1000),
        intervalTimer: null,
        endTime: 1674927000,
        // endTime: Math.trunc(new Date().getTime() / 1000) + 3,
    }),
    getters: {
        live(state) {
            return (state.endTime - state.currentTime) <= 0;
        },
        diffTime(state) {
            return (state.endTime - state.currentTime)
        },
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
        activeGameScoresWithScore(state) {
            let active = {};
            // for each game score
            for (const game_score_id in state.scores) {
                if (Object.hasOwnProperty.call(state.scores, game_score_id)) {
                    const game_score = state.scores[game_score_id];
                    // if showing game score
                    if (game_score.show === "TRUE") {
                        const scores = game_score.scores;
                        let completelyScored = true;
                        // and each score is a number (well... not a '--')
                        for (let idx = 0; idx < scores.length; idx++) {
                            const s = scores[idx];
                            if (s == '--') {
                                completelyScored = false;
                                break;
                            }
                        }
                        if (completelyScored) {
                            active[game_score_id] = game_score;
                        }
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
        updateCurrentTime() {
            this.currentTime = Math.trunc(new Date().getTime() / 1000);
        },
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
            // join players list with teams list, returning just players for input team id
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
                if (game_placements[index - 1] == '--') {
                    return []
                }
            }

            for (let index = 1; index <= game_placements.length; index++) {
                const score = game_placements[index - 1]
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
            if (team_placements.length == 0) {
                // console.log(`game ${game_idx} has -- score, returning 0 for all teams.`)
                return team_scores;
            }

            // for place in placements
            for (let place = 1; place <= Object.keys(team_placements).length; place++) {

                // Only one team placed at position, set their score
                if (team_placements[place].length == 1) {
                    const team_id = team_placements[place];
                    team_scores[team_id] = placement_to_score_map[place];
                }

                // Multiple teams tied for position
                else if (team_placements[place].length >= 1) {
                    const num_tied_teams = team_placements[place].length;

                    // Compute the tied
                    let total_tie_score = 0
                    for (let idx2 = 0; idx2 < num_tied_teams; idx2++) {
                        total_tie_score = total_tie_score + placement_to_score_map[place + idx2];
                    }
                    const tie_score = total_tie_score / num_tied_teams;

                    for (let team_tied_idx = 0; team_tied_idx < num_tied_teams; team_tied_idx++) {
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
        },
        teamTotalScores() {
            const team_scores = {}

            // init team scores to 
            //      [game_score_id]:
            //          [team_id]: total score at this point
            // { "1": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, "2": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, ... }
            for (const score_idx in this.activeGameScores) {
                if (Object.hasOwnProperty.call(this.activeGameScores, score_idx)) {
                    team_scores[score_idx] = {}
                    for (let idx = 0; idx < this.num_teams; idx++) {
                        team_scores[score_idx][idx + 1] = 0;
                    }
                }
            }

            for (const score_idx in this.activeGameScores) {
                if (Object.hasOwnProperty.call(this.activeGameScores, score_idx)) {
                    const scores = this.teamScoresForGame(score_idx)
                    // first score, no summing
                    if (score_idx === "1") {
                        team_scores[score_idx] = scores;
                    }
                    // 1+, sum plus previous
                    else {
                        const prev_score_id = parseInt(score_idx) - 1;
                        for (let team_idx = 1; team_idx <= this.num_teams; team_idx++) {
                            const prev_totals = team_scores[prev_score_id];
                            team_scores[score_idx][team_idx] = prev_totals[team_idx] + scores[team_idx]
                        }
                    }
                }
            }
            return team_scores
            // {
            // "1": { "1": 20, "2": 14.5, "3": 10, "4": 8, "5": 14.5 },
            // "2": { "1": 30, "2": 22.5, "3": 26, "4": 28, "5": 27.5 },
            // "3": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 },
            // "4": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 },
            // "5": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 },
            // "6": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 },
            // "7": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 },
            // "8": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 },
            // "9": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 }, 
            // "10": { "1": 46, "2": 30.5, "3": 36, "4": 48, "5": 40.5 } 
            // }
        },
        teamPlacements() {
            const placements = {};
            const total_score_history = this.teamTotalScores();

            for (const score_idx in total_score_history) {
                if (Object.hasOwnProperty.call(total_score_history, score_idx)) {
                    const score = total_score_history[score_idx];
                    placements[score_idx] = this.convertDict(score);
                }
            }

            return placements
        },
        convertDict(dict) {
            // dict should be : {  "Team A": 10,  "Team B": 8,  "Team C": 8,  "Team D": 6,  "Team E": 6};
            // Create an array of objects with the key and value as properties
            let arr = Object.entries(dict).map(([key, value]) => ({ key, value }));

            // Sort the array in descending order by value
            arr.sort((a, b) => b.value - a.value);

            // Initialize an empty dictionary for the new key-value pairs
            let newDict = {};

            // Initialize a variable to keep track of the current rank
            let currentRank = 1;

            // Iterate through the sorted array
            for (let i = 0; i < arr.length; i++) {
                // If the current element has the same value as the previous element
                // and is not the first element in the array
                if (i > 0 && arr[i].value === arr[i - 1].value) {
                    // Skip the current rank
                }
                // If the current element does not have the same value as the previous element
                // or is the first element in the array
                else {
                    // Set the current rank to the current index + 1
                    currentRank = i + 1;
                }
                // If the current rank is not already a key in the new dictionary
                if (!newDict[currentRank]) {
                    // Add the current rank as a key and an array containing the current key as the value
                    newDict[currentRank] = [arr[i].key];
                }
                // If the current rank is already a key in the new dictionary
                else {
                    // Push the current key to the existing array of keys
                    newDict[currentRank].push(arr[i].key);
                }
            }

            return newDict;
        },
        getTeamById(team_id) {
            for (const team_name in this.teams) {
                if (Object.hasOwnProperty.call(this.teams, team_name)) {
                    const team = this.teams[team_name];
                    if (team.id == team_id) {
                        return team;
                    }
                }
            }
            return {};
        },
    },
})
