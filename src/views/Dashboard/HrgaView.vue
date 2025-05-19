<script setup>
import BarChartAbsen from '@/components/charts/BarChartAbsen.vue'
import PieChartAbsen from '@/components/charts/PieChartAbsen.vue'
import DasboardLayout from '@/components/Mains/DasboardLayout.vue'
import { useDashboardHrStore } from '@/stores/administrasiHR/dashboard'
import { onMounted, reactive, ref, computed } from 'vue'

const store = useDashboardHrStore()

const dateRange = ref({ start: null, end: null })
const companyId = ref(null)

const chartAbsen = reactive({
  labels: [],
  normal: [],
  telat: [],
})

const totals = reactive({
  akun: null,
  dept: null,
  posisi: null,
  absensi: null,
  izin: null,
  absenSekarang: null,
  absenAlphaSekarang: null,
  absenTelatSekarang: null,
})

// Ambil data statistik
async function statsData() {
  try {
    const { start, end } = dateRange.value
    const id = companyId.value

    const [akun, dept, posisi, absen, izin, absenSekarang, alpha, telat] = await Promise.all([
      store.apiCountUser(),
      store.apiCountDepartement(),
      store.apiCountPosisi(),
      store.apiCountAbsen(start, end, id),
      store.apiCountIzin(start, end, id),
      store.apiCountAbsenSekarang(),
      store.apiCountAbsenAlphaSekarang(),
      store.apiCountAbsenLateSekarang(),
    ])

    totals.akun = akun.data.total_user
    totals.dept = dept.data.total_departement
    totals.posisi = posisi.data.total_posisi
    totals.absensi = absen.data.total_absen
    totals.izin = izin.data.total_izin
    totals.absenSekarang = absenSekarang.data.total_absen
    totals.absenAlphaSekarang = alpha.data.total_absen
    totals.absenTelatSekarang = telat.data.total_absen
  } catch (error) {
    console.error('Gagal memuat data statistik:', error)
  }
}

// Ambil data chart
async function chartData() {
  try {
    const { start, end } = dateRange.value
    const id = companyId.value

    const absenChart = await store.apiChartAbsen(start, end, id)
    chartAbsen.labels = absenChart.labels
    chartAbsen.normal = absenChart.normal
    chartAbsen.telat = absenChart.telat
  } catch (error) {
    console.error('Gagal memuat data chart:', error)
  }
}

// Saat komponen dimuat
onMounted(async () => {
  await statsData()
  await chartData()
})

// Card dashboard
const cards = computed(() => [
  {
    title: 'Total Akun',
    subtitle: `Total keseluruhan akun ${totals.akun ?? '-'}`,
    text: 'Informasi data total akun',
    prependIcon: 'mdi-account',
  },
  {
    title: 'Total Departemen',
    subtitle: `Jumlah semua departemen ${totals.dept ?? '-'}`,
    text: 'Informasi data total departemen',
    prependIcon: 'mdi-domain',
  },
  {
    title: 'Total Posisi',
    subtitle: `Jumlah semua posisi kerja ${totals.posisi ?? '-'}`,
    text: 'Informasi data total posisi',
    prependIcon: 'mdi-briefcase',
  },
  {
    title: 'Total Absensi',
    subtitle: `Jumlah semua absensi ${totals.absensi ?? '-'}`,
    text: 'Informasi data total absensi',
    prependIcon: 'mdi-calendar-check',
  },
  {
    title: 'Total Izin',
    subtitle: `Rekap data izin ${totals.izin ?? '-'}`,
    text: 'Informasi data total izin',
    prependIcon: 'mdi-calendar-remove',
  },
  {
    title: 'Total Absensi sekarang',
    subtitle: `Absensi hari ini ${totals.absenSekarang ?? '-'}`,
    text: 'Informasi data total absen saat ini',
    prependIcon: 'mdi-clock-outline',
  },
  {
    title: 'Total Alpha sekarang',
    subtitle: `Alpha hari ini ${totals.absenAlphaSekarang ?? '-'}`,
    text: 'Informasi data total absen alpha saat ini',
    prependIcon: 'mdi-account-off',
  },
  {
    title: 'Total Terlambat sekarang',
    subtitle: `Terlambat hari ini ${totals.absenTelatSekarang ?? '-'}`,
    text: 'Informasi data total terlambat saat ini',
    prependIcon: 'mdi-timer-sand',
  },
])

// Handle perubahan filter
function handleDateRangeChange(v) {
  dateRange.value = {
    start: v.startDate,
    end: v.endDate,
  }
  statsData()
  chartData()
}

function handleDateCompanyChange(id) {
  companyId.value = id
  statsData()
  chartData()
}
</script>

<template>
  <DasboardLayout
    @date-range-changed="handleDateRangeChange"
    @company-changed="handleDateCompanyChange"
  >
    <v-row align="center" justify="center" dense>
      <v-col v-for="(card, index) in cards" :key="index" cols="12" md="3">
        <v-card
          class="mx-auto border border-thin"
          :title="card.title"
          :subtitle="card.subtitle"
          :prepend-icon="card.prependIcon"
          elevation="0"
        >
          <v-card-text>{{ card.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="6">
        <BarChartAbsen
          :labels="chartAbsen.labels"
          :dataNormal="chartAbsen.normal"
          :dataTerlambat="chartAbsen.telat"
        />
      </v-col>
      <v-col cols="12" md="6">
        <PieChartAbsen
          :labels="chartAbsen.labels"
          :dataNormal="chartAbsen.normal"
          :dataTerlambat="chartAbsen.telat"
        />
      </v-col>
    </v-row>
  </DasboardLayout>
</template>
