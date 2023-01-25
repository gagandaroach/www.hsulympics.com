<template>
    <div class="flex flex-col m-auto bg-stone-900 m-8 h-96">
        <div class="text-4xl text-white text-center">
            Team Leads
        </div>
        <!-- <Line id="my-chart-id" :options="options" :data="data" /> -->
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

const chartXAxis = "";

function chartData() {
    const labels = []
    const datasets = []
    
    const active_game_scores = hsuStore.activeGameScores;
    const total_score_history = hsuStore.teamTotalScores();

    for (const score_idx in active_game_scores) {
        if (Object.hasOwnProperty.call(active_game_scores, score_idx)) {
            const score = active_game_scores[score_idx];
            labels.push(score.id)
        }
    }

    for (let team_idx = 0; team_idx < hsuStore.num_teams; team_idx++)
    {
        const team = hsuStore.getTeamById((team_idx + 1).toString());
        const data = []
        for (let label_idx = 0; label_idx < labels.length; label_idx++)
        {
            const game_id = labels[label_idx];
            const ts = total_score_history[game_id][team.id];
            console.log(ts)
            data.push(ts);
        }
        const dataset = {
            label: team.name,
            borderColor: `#${team.color}`,
            data: data
        };
        datasets.push(dataset);
    }
    console.log('labels')
    console.log(labels)
    console.log('datasets')
    console.log(datasets)

    return {
        labels: labels,
        datasets: datasets
    }
}

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Team 1',
            borderColor: '#0000ff',
            data: [40, 39, 10, 40, 39, 80, 40]
        },
        {
            label: 'Team 2',
            borderColor: '#000000',
            data: [10, 29, 11, 43, 3, 30, 10]
        },
        {
            label: 'Team 3',
            borderColor: '#008000',
            data: [3, 39, 10, 2, 87, 80, 40]
        },
        {
            label: 'Team 4',
            borderColor: '#ff0000',
            data: [2, 4, 10, 40, 3, 80, 6]

        },
        {
            label: 'Team 5',
            borderColor: '#ffff00',
            data: [40, 76, 2, 40, 39, 12, 40]
        }
    ]
}
const options = {
    responsive: true,
    maintainAspectRatio: false,
}
</script>