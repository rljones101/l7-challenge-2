<script setup>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { computed } from 'vue'
Chart.register(...registerables)

const props = defineProps({
  userPlots: Array,
})

const chartData = computed(() => ({
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  datasets: [
    {
      label: 'Your file',
      data: props.userPlots,
      backgroundColor: '#e522c1',
    },
    {
      label: "Benford's Law",
      data: [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6],
      backgroundColor: '#29b3dc',
    },
  ],
}))
</script>

<template>
  <BarChart :chartData="chartData" />
</template>

<style scoped></style>
