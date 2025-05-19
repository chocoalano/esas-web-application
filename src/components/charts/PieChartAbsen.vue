<script setup>
import ApexChart from 'vue3-apexcharts'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Grafik Donut Absensi',
  },
  subtitle: {
    type: String,
    default: 'Berikut adalah laporan grafik donut absensi',
  },
  labels: {
    type: Array,
    default: () => ['Normal', 'Terlambat'],
  },
  dataNormal: {
    type: Array,
    required: true, // sekarang array
  },
  dataTerlambat: {
    type: Array,
    required: true, // sekarang array
  },
})

// Hitung total dari dataNormal dan dataTerlambat
const series = computed(() => [
  props.dataNormal.reduce((sum, val) => sum + val, 0),
  props.dataTerlambat.reduce((sum, val) => sum + val, 0),
])

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  labels: props.labels,
  dataLabels: {
    enabled: true,
  },
  legend: {
    position: 'bottom',
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} orang`,
    },
  },
  colors: ['#1E88E5', '#F50057'],
}))
</script>

<template>
  <v-card
    class="mx-auto border border-thin"
    :title="props.title"
    :subtitle="props.subtitle"
    append-icon="mdi-chart-donut"
    elevation="0"
  >
    <template #text>
      <ApexChart type="donut" height="350" :options="chartOptions" :series="series" />
    </template>
  </v-card>
</template>
