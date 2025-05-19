<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import { useAuthStore } from '@/stores/auth'
import { useDokumentasiStore } from '@/stores/dokumentasi'
import { usePermissionCheck } from '@/composables/useApp'

const drawerLeft = ref(true)
const drawerRight = ref(true)
const dashboardExpanded = ref(false)
const hrExpanded = ref(false)
const settingsExpanded = ref(false)

const theme = useTheme()
const currentTheme = ref(localStorage.getItem('theme') || 'light')
theme.global.name.value = currentTheme.value

const toggleTheme = () => {
  const isDark = theme.global.current.value.dark
  currentTheme.value = isDark ? 'light' : 'dark'
  theme.global.name.value = currentTheme.value
}

watch(
  () => theme.global.name.value,
  (val) => {
    localStorage.setItem('theme', val)
  },
)

const router = useRouter()
const authStore = useAuthStore()
const dokumentasiStore = useDokumentasiStore()
const { permissionCheck } = usePermissionCheck()

const logout = async () => {
  try {
    authStore.isLoading = true
    await authStore.logout()
    router.push('/login')
  } finally {
    authStore.isLoading = false
  }
}

// === Dokumentasi Sidebar ===
const documentationItems = ref([])
const searchDocs = ref('')
const pageDocs = ref(1)
const perPageDocs = 10
const isLoadingDocs = ref(false)
const hasMoreDocs = ref(true)

// Fungsi memuat data dokumentasi
const loadDocumentation = async ({ done } = {}) => {
  if (isLoadingDocs.value || !hasMoreDocs.value) {
    done?.()
    return
  }

  isLoadingDocs.value = true

  try {
    const response = await dokumentasiStore.apiListPaginateSidebar(pageDocs.value, searchDocs.value)
    const docs = response?.data?.data ?? []

    if (pageDocs.value === 1) {
      documentationItems.value = docs
    } else {
      documentationItems.value.push(...docs)
    }

    if (docs.length < perPageDocs) {
      hasMoreDocs.value = false
    } else {
      pageDocs.value++
    }
  } catch (error) {
    console.error('Gagal memuat dokumentasi:', error)
    hasMoreDocs.value = false
  } finally {
    isLoadingDocs.value = false
    done?.()
  }
}

// Watch pencarian: reset dan load ulang
watch(searchDocs, () => {
  pageDocs.value = 1
  hasMoreDocs.value = true
  loadDocumentation()
})

// Initial load
onMounted(() => {
  loadDocumentation()
})

// Menu
const filterMenu = (menu) => menu.filter((item) => permissionCheck(item.permission))

const dashboardMenu = computed(() =>
  filterMenu([
    {
      text: 'Absensi',
      icon: 'mdi-french-fries',
      to: '/app/dashboard-hrga',
      permission: 'view_any_user::attendance',
    },
  ]),
)

const hrMenu = computed(() =>
  filterMenu([
    {
      text: 'Pengumuman',
      icon: 'mdi-alert',
      to: '/app/administrasi-hr/pengumuman',
      permission: 'view_any_announcement',
    },
    {
      text: 'Izin',
      icon: 'mdi-checkbox-marked-circle-outline',
      to: '/app/administrasi-hr/izin',
      permission: 'view_any_permit',
    },
    {
      text: 'Absensi',
      icon: 'mdi-fingerprint',
      to: '/app/administrasi-hr/absensi',
      permission: 'view_any_user::attendance',
    },
    {
      text: 'Jadwal Kerja',
      icon: 'mdi-calendar-account',
      to: '/app/administrasi-hr/jadwal-kerja',
      permission: 'view_any_user::timework::schedule',
    },
    {
      text: 'Laporan Bug',
      icon: 'mdi-responsive',
      to: '/app/administrasi-hr/laporan-bug',
      permission: 'view_any_bug::report',
    },
  ]),
)

const settingsMenu = computed(() =>
  filterMenu([
    {
      text: 'Perusahaan',
      icon: 'mdi-office-building-cog-outline',
      to: '/app/pengaturan/perusahaan',
      permission: 'view_any_company',
    },
    {
      text: 'Departemen',
      icon: 'mdi-account-network',
      to: '/app/pengaturan/departemen',
      permission: 'view_any_departement',
    },
    {
      text: 'Level',
      icon: 'mdi-account-supervisor-circle',
      to: '/app/pengaturan/level',
      permission: 'view_any_job::level',
    },
    {
      text: 'Posisi',
      icon: 'mdi-podium-silver',
      to: '/app/pengaturan/posisi',
      permission: 'view_any_job::position',
    },
    {
      text: 'Peran',
      icon: 'mdi-account-group',
      to: '/app/pengaturan/peran',
      permission: 'view_any_role',
    },
    {
      text: 'Jenis Izin',
      icon: 'mdi-medical-bag',
      to: '/app/pengaturan/jenis-izin',
      permission: 'view_any_permit::type',
    },
    {
      text: 'Jam Kerja',
      icon: 'mdi-timer-cog-outline',
      to: '/app/pengaturan/jam-kerja',
      permission: 'view_any_time::work',
    },
    {
      text: 'Pengguna',
      icon: 'mdi-account-box-plus-outline',
      to: '/app/pengaturan/pengguna',
      permission: 'view_any_user',
    },
  ]),
)
</script>

<template>
  <v-app id="inspire">
    <!-- App Bar -->
    <v-app-bar elevation="0" class="border-b border-gray-200">
      <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
      <v-app-bar-title>Application</v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-information-outline" @click="drawerRight = !drawerRight" />
        <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" />
        <v-btn icon="mdi-bell-outline" to="/app/pemberitahuan" />
        <v-btn icon="mdi-account" to="/app/profile" />
        <v-btn icon="mdi-logout" @click="logout" :loading="authStore.isLoading" />
      </template>
    </v-app-bar>

    <!-- Left Navigation Drawer -->
    <v-navigation-drawer v-model="drawerLeft" :width="280">
      <v-list nav dense>
        <!-- Dashboard -->
        <v-list-group
          v-if="dashboardMenu.length"
          v-model="dashboardExpanded"
          prepend-icon="mdi-apps"
          no-action
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Dashboard" />
          </template>
          <v-list-item
            v-for="(item, i) in dashboardMenu"
            :key="i"
            :prepend-icon="item.icon"
            :title="item.text"
            :to="item.to"
            nav
          />
        </v-list-group>

        <!-- Pengaturan -->
        <v-list-group
          v-if="settingsMenu.length"
          v-model="settingsExpanded"
          prepend-icon="mdi-cog"
          no-action
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Pengaturan" />
          </template>
          <v-list-item
            v-for="(item, i) in settingsMenu"
            :key="i"
            :prepend-icon="item.icon"
            :title="item.text"
            :to="item.to"
            nav
          />
        </v-list-group>

        <!-- HR -->
        <v-list-group
          v-if="hrMenu.length"
          v-model="hrExpanded"
          prepend-icon="mdi-format-list-checkbox"
          no-action
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Administrasi HR" />
          </template>
          <v-list-item
            v-for="(item, i) in hrMenu"
            :key="i"
            :prepend-icon="item.icon"
            :title="item.text"
            :to="item.to"
            nav
          />
        </v-list-group>

        <!-- Dokumentasi -->
        <v-list-item to="/app/dokumentasi">
          <template #prepend><v-icon>mdi-file-sign</v-icon></template>
          <v-list-item-title>Dokumentasi</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Right Drawer: Dokumentasi -->
    <v-navigation-drawer v-model="drawerRight" location="right" :width="280">
      <v-list nav dense>
        <v-list-item>
          <v-text-field
            v-model="searchDocs"
            label="Cari"
            placeholder="Cari keterangan..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="mt-5"
          />
        </v-list-item>

        <div style="max-height: calc(100vh - 120px); overflow-y: auto">
          <v-infinite-scroll
            :load="loadDocumentation"
            :disabled="!hasMoreDocs || isLoadingDocs"
            :key="searchDocs"
            mode="manual"
          >
            <template v-for="item in documentationItems" :key="item.id">
              <v-list-item class="flex-wrap" lines="three" :to="`/app/dokumentasi/${item.id}`">
                <v-list-item-title class="font-weight-bold mb-2">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 text-wrap">
                  {{ item.subtitle }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
            <template v-slot:load-more="{ props }">
              <v-btn
                icon="mdi-refresh"
                size="small"
                variant="text"
                v-bind="props"
                v-if="hasMoreDocs"
              ></v-btn>
              <p class="text-grey" v-else>Semua data telah dimuat.</p>
            </template>
          </v-infinite-scroll>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-background">
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
