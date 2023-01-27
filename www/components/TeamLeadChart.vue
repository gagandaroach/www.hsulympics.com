<template>
    <div class="flex flex-col px-8 pb-20 h-[30rem]">
        <div class="text-4xl text-white text-center p-4">
            Team Rank
        </div>
        <Line id="my-chart-id" :options="options" :data="chartData()" />
    </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { useHsuDataStore } from "~/stores/hsuData";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

const hsuStore = useHsuDataStore()
if (!hsuStore.loaded) {
    hsuStore.refreshSheets()
};

function chartData() {
    const labels = []
    labels.push('')
    const datasets = []

    const placements_history = hsuStore.teamPlacements()
    const active_game_scores = hsuStore.activeGameScoresWithScore;

    for (const score_idx in active_game_scores) {
        if (Object.hasOwnProperty.call(active_game_scores, score_idx)) {
            const score = active_game_scores[score_idx];
            labels.push(score.id)
        }
    }

    for (let team_idx = 0; team_idx < hsuStore.num_teams; team_idx++) {
        const team = hsuStore.getTeamById((team_idx + 1).toString());
        const data = []
        data.push(5)

        for (let label_idx = 0; label_idx < labels.length; label_idx++) {
            const game_id = labels[label_idx];
            const placements = placements_history[game_id];
            let found = false;

            for (const place in placements) {
                if (Object.hasOwnProperty.call(placements, place)) {
                    const teams_array = placements[place];
                    for (let ta_idx = 0; ta_idx < teams_array.length && !found; ta_idx++) {
                        const team_id = teams_array[ta_idx];
                        if (team_id == team.id) {
                            data.push(place);
                            found = true;
                            break;
                        }
                    }
                }
            }
        }

        const dataset = {
            label: team.name,
            borderColor: `#${team.color}`,
            borderWidth: 4,
            data: data,
            tension: 0
        };

        datasets.push(dataset);
    }
    return {
        labels: labels,
        datasets: datasets
    }
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    layout: {
        padding: 5
    },
    scales: {
        y: {
            border: {
                color: 'white'
            },
            beginAtZero: false,
            ticks: {
                stepSize: 1, color: 'white'
            },
            reverse: true,
            title: {
                display: true,
                text: 'Place',
                color: 'white'
            },
        },
        x: {
            border: {
                color: 'white'
            },
            title: {
                display: true,
                text: 'Game',
                color: 'white'
            },
            ticks: { color: 'white' }
        }
    }
}

</script>