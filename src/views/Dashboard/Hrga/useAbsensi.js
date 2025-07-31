import { useAbsensiDasborStore } from '@/stores/dashboard/HRGA/absensi'
import { onMounted, reactive, ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useToast } from 'vue-toast-notification'
import { storeToRefs } from 'pinia'

export function useAbsensi() {
  const store = useAbsensiDasborStore()
  const toast = useToast()

  const allCompanies = ref([])
  const selectedCompanyId = ref(null)
  const companyId = ref(null)

  const { isLoading } = storeToRefs(store)

  const dateRange = ref({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
  })

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

  const vuetifyColors = {
    primary: '#2196F3',
    secondary: '#9C27B0',
    success: '#4CAF50',
    info: '#00ACC1',
    warning: '#FB8C00',
    error: '#F44336',
    default: '#BDBDBD',
  }

  function hexToRGBA(colorName, opacity = 0.12) {
    const hex = vuetifyColors[colorName] || colorName || vuetifyColors.default
    const bigint = parseInt(hex.replace('#', ''), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  async function fetchCompanyOptions() {
    try {
      const res = await store.GET_COMPANY_ACTION()
      allCompanies.value = res?.data || []
      if (allCompanies.value.length > 0 && selectedCompanyId.value === null) {
        selectedCompanyId.value = allCompanies.value[0].id
        companyId.value = selectedCompanyId.value
      }
    } catch (error) {
      toast.error('Gagal memuat opsi perusahaan')
    }
  }

  async function statsData() {
    try {
      // Pastikan dateRange.value bukan null sebelum mencoba mengakses propertinya
      if (!dateRange.value || !dateRange.value.startDate || !dateRange.value.endDate) {
        console.warn("Rentang tanggal tidak lengkap atau null, melewati pengambilan data statistik.");
        // Optionally reset totals if no valid date range
        totals.akun = '-';
        totals.dept = '-';
        totals.posisi = '-';
        totals.absensi = '-';
        totals.izin = '-';
        totals.absenSekarang = '-';
        totals.absenAlphaSekarang = '-';
        totals.absenTelatSekarang = '-';
        return;
      }

      const { startDate, endDate } = dateRange.value;
      const id = companyId.value;

      const res = await store.DASHBOARD_ACTION(startDate, endDate, id);
      totals.akun = res.userCount ?? '-';
      totals.dept = res.departemenCount ?? '-';
      totals.posisi = res.positionCount ?? '-';
      totals.absensi = res.attendanceCount ?? '-';
      totals.izin = res.permitCount ?? '-';
      totals.absenSekarang = res.AttendanceNowCount ?? '-';
      totals.absenAlphaSekarang = res.AttendanceAlphaNowCount ?? '-';
      totals.absenTelatSekarang = res.AttendanceLateCount ?? '-';
    } catch (error) {
      console.error('Gagal memuat data statistik:', error);
    }
  }

  async function chartData() {
    try {
      // Pastikan dateRange.value bukan null sebelum mencoba mengakses propertinya
      if (!dateRange.value || !dateRange.value.startDate || !dateRange.value.endDate) {
        console.warn("Rentang tanggal tidak lengkap atau null, melewati pengambilan data chart.");
        // Optionally clear chart data if no valid date range
        chartAbsen.labels = [];
        chartAbsen.normal = [];
        chartAbsen.telat = [];
        return;
      }

      const { startDate, endDate } = dateRange.value;
      const id = companyId.value;

      const res = await store.GET_CHART_ACTION(startDate, endDate, id);
      chartAbsen.labels = res.labels || []; // Perhatikan: sebelumnya res.original.labels
      chartAbsen.normal = res.normal || [];
      chartAbsen.telat = res.telat || [];
    } catch (error) {
      console.error('Gagal memuat data chart:', error);
    }
  }

  watch([dateRange, companyId], async ([newDateRange, newCompanyId], [oldDateRange, oldCompanyId]) => {
    const dateRangeChanged = newDateRange?.startDate !== oldDateRange?.startDate || newDateRange?.endDate !== oldDateRange?.endDate
    const companyChanged = newCompanyId !== oldCompanyId

    if (dateRangeChanged || companyChanged) {
      await Promise.all([statsData(), chartData()])
    }
  }, { deep: true })

  onMounted(async () => {
    await fetchCompanyOptions()
    await statsData()
    await chartData()
  })

  const cards = computed(() => [
    {
      title: 'Total Akun',
      subtitle: `Total keseluruhan akun <div class="font-weight-bold text-h6">${totals.akun ?? '-'}</div>`,
      text: 'Informasi data total akun',
      prependIcon: 'mdi-account',
      color: 'primary',
    },
    {
      title: 'Total Departemen',
      subtitle: `Jumlah semua departemen <div class="font-weight-bold text-h6">${totals.dept ?? '-'}</div>`,
      text: 'Informasi data total departemen',
      prependIcon: 'mdi-domain',
      color: 'success',
    },
    {
      title: 'Total Posisi',
      subtitle: `Jumlah semua posisi kerja <div class="font-weight-bold text-h6">${totals.posisi ?? '-'}</div>`,
      text: 'Informasi data total posisi',
      prependIcon: 'mdi-briefcase',
      color: 'info',
    },
    {
      title: 'Total Absensi',
      subtitle: `Jumlah semua absensi <div class="font-weight-bold text-h6">${totals.absensi ?? '-'}</div>`,
      text: 'Informasi data total absensi',
      prependIcon: 'mdi-calendar-check',
      color: 'secondary',
    },
    {
      title: 'Total Izin',
      subtitle: `Rekap data izin <div class="font-weight-bold text-h6">${totals.izin ?? '-'}</div>`,
      text: 'Informasi data total izin',
      prependIcon: 'mdi-calendar-remove',
      color: 'primary',
    },
    {
      title: 'Absensi Sekarang',
      subtitle: `Absensi hari ini <div class="font-weight-bold text-h6">${totals.absenSekarang ?? '-'}</div>`,
      text: 'Informasi data total absen saat ini',
      prependIcon: 'mdi-clock-outline',
      color: 'info',
    },
    {
      title: 'Alpha Sekarang',
      subtitle: `Alpha hari ini <div class="font-weight-bold text-h6">${totals.absenAlphaSekarang ?? '-'}</div>`,
      text: 'Informasi data total absen alpha saat ini',
      prependIcon: 'mdi-account-off',
      color: 'error',
    },
    {
      title: 'Terlambat Sekarang',
      subtitle: `Terlambat hari ini <div class="font-weight-bold text-h6">${totals.absenTelatSekarang ?? '-'}</div>`,
      text: 'Informasi data total terlambat saat ini',
      prependIcon: 'mdi-timer-sand',
      color: 'warning',
    },
  ])

  return {
    isLoading,
    dateRange,
    allCompanies,
    selectedCompanyId,
    companyId,
    chartAbsen,
    totals,
    cards,
    vuetifyColors,

    // Functions
    hexToRGBA,
    statsData,
    chartData,
  }
}
