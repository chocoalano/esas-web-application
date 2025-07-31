<script setup>
import ApexChart from 'vue3-apexcharts'
import { computed } from 'vue'
import { useTheme } from 'vuetify' // Impor useTheme dari Vuetify

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

// Inisialisasi useTheme dari Vuetify
const theme = useTheme()

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
const chartOptions = computed(() => {
  const isDarkMode = theme.global.current.value.dark;

  // Mendapatkan warna dari tema Vuetify untuk konsistensi
  // Fallback ke warna default jika properti tema tidak ditemukan
  const textColorPrimary = isDarkMode ? theme.current.value.colors['on-background'] || '#E0E0E0' : theme.current.value.colors['on-surface'] || '#333333';
  const gridLineColor = isDarkMode ? '#424242' : '#E0E0E0'; // Warna garis grid

  return {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
      // Latar belakang chart mengambil warna "surface" Vuetify (biasanya latar card)
      background: theme.current.value.colors['surface'],
      // Warna teks umum pada chart (judul, label sumbu, dll.)
      foreColor: textColorPrimary,
    },
    // Konfigurasi tema ApexCharts
    theme: {
      mode: isDarkMode ? 'dark' : 'light', // Mode tema ApexCharts mengikuti Vuetify
      palette: 'palette1', // Palet warna untuk bar (opsional, bisa diganti)
      monochrome: {
        enabled: false,
        color: '#255aee',
        shadeTo: 'light',
        shadeIntensity: 0.65
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded',
        // Warna bar tetap seperti yang didefinisikan di `colors` array
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        // Menyesuaikan warna teks data labels di atas bar
        colors: [textColorPrimary],
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
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'], // Warna border bar
    },
    xaxis: {
      categories: props.labels,
      labels: {
        style: {
          colors: textColorPrimary, // Warna label kategori X-axis
        },
      },
      axisBorder: {
        show: true,
        color: gridLineColor, // Warna border sumbu X
      },
      axisTicks: {
        show: true,
        color: gridLineColor, // Warna ticks sumbu X
      }
    },
    yaxis: {
      title: {
        text: 'Jumlah Kehadiran',
        style: {
          color: textColorPrimary, // Warna judul Y-axis
        },
      },
      labels: {
        style: {
          colors: textColorPrimary, // Warna label nilai Y-axis
        },
      },
      axisBorder: {
        show: true,
        color: gridLineColor, // Warna border sumbu Y
      },
      axisTicks: {
        show: true,
        color: gridLineColor, // Warna ticks sumbu Y
      }
    },
    grid: {
      show: true,
      borderColor: gridLineColor, // Warna garis grid utama
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: false // Garis grid vertikal (jika ada)
        }
      },
      yaxis: {
        lines: {
          show: true // Garis grid horizontal
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} orang`,
      },
      // Mengatur tema tooltip ApexCharts bawaan
      theme: isDarkMode ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: undefined,
        color: textColorPrimary // Warna teks di dalam tooltip
      },
      fillSeriesColor: false, // Penting agar background tooltip tidak mengambil warna bar
    },
    // Warna bar untuk 'Normal' dan 'Terlambat'
    colors: ['#18b511', '#b5115a'], // Ini adalah warna utama bar Anda
    legend: {
      position: 'bottom',
      labels: {
        colors: textColorPrimary, // Warna teks legend
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0
      }
    },
  };
});
</script>

<template>
  <v-card class="mx-auto border border-thin" :title="props.title" :subtitle="props.subtitle" append-icon="mdi-chart-bar"
    elevation="0" rounded="xl">
    <template #text>
      <ApexChart type="bar" height="350" :options="chartOptions" :series="series" />
    </template>
  </v-card>
</template>
