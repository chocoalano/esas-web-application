<script setup>
import ApexChart from 'vue3-apexcharts'
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Grafik Bar Absensi',
  },
  subtitle: {
    type: String,
    default: 'Berikut adalah laporan grafik bar absensi',
  },
  labels: {
    type: Array,
    required: true,
    // contoh: ['Jan', 'Feb', 'Mar']
  },
  dataNormal: {
    type: Array,
    required: true,
    // contoh: [10, 20, 15]
  },
  dataTerlambat: {
    type: Array,
    required: true,
    // contoh: [2, 5, 3]
  },
})

// Series disusun berdasarkan dua kategori absen
const series = computed(() => [
  {
    name: 'Normal',
    data: props.dataNormal,
  },
  {
    name: 'Terlambat',
    data: props.dataTerlambat,
  },
])

// Opsi chart
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: props.labels,
  },
  yaxis: {
    title: {
      text: 'Jumlah Kehadiran',
    },
  },
  fill: {
    opacity: 1,
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
    append-icon="mdi-chart-bar"
    elevation="0"
  >
    <template #text>
      <ApexChart type="bar" height="350" :options="chartOptions" :series="series" />
    </template>
  </v-card>
</template>
