<script setup>
import ApexChart from 'vue3-apexcharts'
import { computed } from 'vue'
import { useTheme } from 'vuetify' // Impor useTheme dari Vuetify

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
    required: true,
  },
  dataTerlambat: {
    type: Array,
    required: true,
  },
})

// Inisialisasi useTheme dari Vuetify
const theme = useTheme()

// Hitung total dari dataNormal dan dataTerlambat
const series = computed(() => [
  props.dataNormal.reduce((sum, val) => sum + val, 0),
  props.dataTerlambat.reduce((sum, val) => sum + val, 0),
])

const chartOptions = computed(() => {
  const isDarkMode = theme.global.current.value.dark;

  // Tentukan warna teks yang konsisten untuk dark/light mode
  // Anda bisa sesuaikan ini dengan variabel tema Vuetify Anda
  const textColorPrimary = isDarkMode ? theme.current.value.colors['on-background'] || '#E0E0E0' : theme.current.value.colors['on-surface'] || '#333333';
  const textColorSecondary = isDarkMode ? theme.current.value.colors['on-background'] || '#BDBDBD' : theme.current.value.colors['on-surface-variant'] || '#616161';

  return {
    chart: {
      type: 'donut',
      height: 350,
      toolbar: {
        show: false,
      },
      // Mengatur warna latar belakang chart agar cocok dengan background card Vuetify
      background: theme.current.value.colors['surface'], // Menggunakan warna 'surface' Vuetify
      foreColor: textColorPrimary, // Warna teks umum pada chart
    },
    // Konfigurasi tema ApexCharts
    theme: {
      mode: isDarkMode ? 'dark' : 'light', // Mode tema ApexCharts mengikuti Vuetify
      palette: 'palette1', // Palet warna untuk segmen donat (ini tidak berubah berdasarkan tema)
      monochrome: {
        enabled: false,
        color: '#255aee',
        shadeTo: 'light',
        shadeIntensity: 0.65
      },
    },
    labels: props.labels,
    dataLabels: {
      enabled: true,
      style: {
        // MENYESUAIKAN WARNA TEKS DATA LABELS DI DALAM DONAT
        colors: [textColorPrimary], // Menggunakan warna teks primary
        fontSize: '14px',
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: isDarkMode ? '#000000' : '#EEEEEE', // Warna bayangan data label
        opacity: 0.45
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        // MENYESUAIKAN WARNA TEKS LEGEND
        colors: textColorPrimary,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} orang`,
      },
      // MENGATUR TEMA TOOLTIP APEXCHARTS BAWAAN DAN WARNA TEKS MANUAL
      theme: isDarkMode ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: undefined,
        color: textColorPrimary // Warna teks di dalam tooltip
      },
      // Latar belakang tooltip juga bisa disesuaikan jika tema bawaan 'dark'/'light' tidak cukup
      fillSeriesColor: false, // Penting agar background tooltip tidak mengambil warna slice
      onDatasetHover: {
        highlightDataSeries: true,
      },
      marker: {
        show: true,
      },
      x: {
        show: true,
        formatter: undefined,
      },
      // Background tooltip (opsional, jika theme: 'dark'/'light' belum cukup)
      // custom: function({series, seriesIndex, dataPointIndex, w}) {
      //   return '<div class="arrow_box" style="background-color: ' + (isDarkMode ? '#333' : '#FFF') + '; color: ' + textColorPrimary + ';">' +
      //     '<span>' + w.globals.labels[seriesIndex] + ': ' + series[seriesIndex] + ' orang</span>' +
      //     '</div>'
      // }
    },
    // Warna segmen donat (ini biasanya tetap, tidak berubah dengan tema)
    colors: ['#18b511', '#b5115a'],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '22px',
              fontWeight: 'bold',
              color: textColorPrimary, // Warna teks 'Total' di tengah
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0) + ' orang'
              }
            },
            value: {
              fontSize: '16px',
              color: textColorSecondary, // Warna teks nilai individu di tengah donat
              formatter: function (val) {
                return val + ' orang'
              }
            }
          }
        }
      }
    }
  };
});
</script>

<template>
  <v-card class="mx-auto border border-thin" :title="props.title" :subtitle="props.subtitle"
    append-icon="mdi-chart-donut" elevation="0" rounded="xl">
    <template #text>
      <ApexChart type="donut" height="350" :options="chartOptions" :series="series" />
    </template>
  </v-card>
</template>
