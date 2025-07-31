import { usePermissionCheck } from "@/composables/useApp";
import { useAuthStore } from "@/stores/auth/auth";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify/lib/framework.mjs";

export function useDefaultLayout() {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const display = useDisplay();
  // --- State Reaktif ---
  const drawerLeft = ref(true);
  const drawerRight = ref(true);

  // State untuk grup menu yang diperluas
  const dashboardExpanded = ref(false);
  const hrExpanded = ref(false);
  const settingsExpanded = ref(false);

  const railMenu = ref([
    { "icon": "mdi-view-dashboard", "value": "dashboard" },
    { "icon": "mdi-cog-clockwise", "value": "pengaturan" },
    { "icon": "mdi-desktop-classic", "value": "aplikasi" },
    { "icon": "mdi-robot", "value": "general" },
  ])
  const railMenuValue = ref('dashboard')

  const SET_RAIL_MENU = (v) => {
    railMenuValue.value = v
  }
  // --- Theme Toggling ---
  const theme = useTheme();
  // Ambil tema dari localStorage atau default ke 'light'
  const currentTheme = ref(localStorage.getItem('theme') || 'light');
  const setRailMenu = () => {
    const path = route.path.split('/').filter(Boolean)
    railMenuValue.value = path[1] ?? 'dashboard'
  }

  // Set tema global Vuetify saat komponen dimuat
  onMounted(() => {
    theme.global.name.value = currentTheme.value;
    authStore.GET_PROFILE_ACTION()
    setRailMenu()
  });

  // Watcher untuk menyimpan tema ke localStorage setiap kali berubah
  watch(
    () => theme.global.name.value,
    (val) => {
      localStorage.setItem('theme', val);
    }
  );

  watch(
    () => route.path,
    (_) => {
      setRailMenu()
    }
  );

  const TOOGLE_THEME_ACTION = () => {
    // Ganti tema berdasarkan tema saat ini
    const isDark = theme.global.current.value.dark;
    currentTheme.value = isDark ? 'light' : 'dark';
    theme.global.name.value = currentTheme.value;
  };
  const LOGOUT_ACTION = async () => {
    try {
      authStore.isLoading = true;
      await authStore.LOGOUT_ACTION();
      router.push('/login');
    } finally {
      authStore.isLoading = false;
    }
  };

  const filterMenu = (menu) => menu.filter((item) => usePermissionCheck(item.permission));
  const dashboardMenu = computed(() =>
    filterMenu([
      {
        text: 'Absensi',
        icon: 'mdi-chart-bar-stacked',
        to: '/app/dashboard/absensi',
        permission: 'view_any_user_attendances',
      },
    ])
  );
  const generalMenu = computed(() =>
    filterMenu([
      {
        text: 'Pengumuman',
        icon: 'mdi-bullhorn-variant-outline',
        to: '/app/general/pengumuman',
        permission: 'view_any_announcements',
      },
      {
        text: 'Lapor Bug',
        icon: 'mdi-bug-check-outline',
        to: '/app/general/laporan-bug',
        permission: 'view_any_bug_reports',
      },
      {
        text: 'Dokumentasi',
        icon: 'mdi-bookshelf',
        to: '/app/general/dokumentasi',
        permission: 'view_any_documentations',
      },
    ])
  );
  const hrMenu = computed(() =>
    filterMenu([
      {
        text: 'Izin',
        icon: 'mdi-checkbox-marked-circle-outline',
        to: '/app/aplikasi/izin',
        permission: 'view_any_permits',
      },
      {
        text: 'Absensi',
        icon: 'mdi-fingerprint',
        to: '/app/aplikasi/absensi',
        permission: 'view_any_user_attendances',
      },
      {
        text: 'Jadwal shift',
        icon: 'mdi-calendar-account',
        to: '/app/aplikasi/jadwal-kerja',
        permission: 'create_time_workes',
      },
    ])
  );
  const settingsMenu = computed(() =>
    filterMenu([
      {
        text: 'Perusahaan',
        icon: 'mdi-office-building-cog-outline',
        to: '/app/pengaturan/perusahaan',
        permission: 'view_any_companies',
      },
      {
        text: 'Departemen',
        icon: 'mdi-account-network',
        to: '/app/pengaturan/departemen',
        permission: 'view_any_departements',
      },
      {
        text: 'Level',
        icon: 'mdi-account-supervisor-circle',
        to: '/app/pengaturan/level',
        permission: 'view_any_job_levels',
      },
      {
        text: 'Posisi',
        icon: 'mdi-podium-silver',
        to: '/app/pengaturan/posisi',
        permission: 'view_any_job_positions',
      },
      {
        text: 'Peran',
        icon: 'mdi-account-group',
        to: '/app/pengaturan/peran',
        permission: 'view_any_roles',
      },
      {
        text: 'Jenis Izin',
        icon: 'mdi-medical-bag',
        to: '/app/pengaturan/jenis-izin',
        permission: 'view_any_permit_types',
      },
      {
        text: 'Jam Kerja',
        icon: 'mdi-timer-cog-outline',
        to: '/app/pengaturan/jam-kerja',
        permission: 'view_any_time_works',
      },
      {
        text: 'Pengguna',
        icon: 'mdi-account-box-plus-outline',
        to: '/app/pengaturan/pengguna',
        permission: 'view_any_users',
      },
    ])
  );
  return {
    authStore,
    dashboardMenu,
    generalMenu,
    hrMenu,
    settingsMenu,
    display,
    drawerLeft,
    drawerRight,
    dashboardExpanded,
    hrExpanded,
    settingsExpanded,
    theme,
    currentTheme,
    railMenu,
    railMenuValue,
    TOOGLE_THEME_ACTION,
    LOGOUT_ACTION,
    SET_RAIL_MENU,
  }
}
