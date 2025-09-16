<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import dayjs from 'dayjs'
import { usePermissionCheck } from '@/composables/useApp'
import { useAuthStore } from '@/stores/auth/auth'

// Responsiveness helper
const { mobile } = useDisplay()
const { permissionCheck } = usePermissionCheck()
const authdata = useAuthStore()
// Props (bisa dikembangkan untuk lebih fleksibel)
defineProps({
  defaultPath: {
    type: String,
    default: 'app',
  },
  permission: {
    type: Array,
    default: () => [],
  },
})

// Explicitly define emits to fix the ESLint error
const emit = defineEmits(['date-range-changed', 'btn-changed'])

// Initialize items for breadcrumbs
const items = ref([{ title: 'Dashboard', disabled: false, href: 'app' }])

// Ref for date picker (prevent null issues)
const datepicker = ref(null) // Default ke hari ini

// Get current route
const route = useRoute()

// Update breadcrumbs dynamically
const updateBreadcrumbs = () => {
  const path = route.path.split('/').filter(Boolean)

  items.value = path.map((segment, index) => ({
    title: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
    disabled: false,
    href: '/' + path.slice(0, index + 1).join('/'),
  }))
}

// Watch route changes
watch(() => route.path, updateBreadcrumbs, { immediate: true })

// Handle date range selection
const handleDateChange = (value) => {
  if (!value || value.length < 2) {
    emit('date-range-changed', {
      startDate: null,
      endDate: null,
    })
  } else {
    const sortedDates = [...value].sort((a, b) => new Date(a) - new Date(b))
    const startDate = sortedDates[0] // Tanggal terkecil
    const endDate = sortedDates[sortedDates.length - 1] // Tanggal terbesar
    if (startDate && endDate) {
      emit('date-range-changed', {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      })
    }
  }
}

// Button toggle handling
const toggle = ref(null)
const handleBtnChange = (value) => {
  if (value) {
    emit('btn-changed', { btn: value })
  }
}
</script>

<template>
  <v-container fluid class="py-2">
    <v-row align="center" justify="space-between">
      <!-- Breadcrumbs -->
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="items" class="pa-2">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>

      <!-- Date Picker & Toggle Buttons -->
      <v-col cols="12" md="6" class="d-flex align-center gap-2 justify-md-end flex-wrap">
        <v-date-input v-model="datepicker" label="Select range" :max-width="mobile ? '100%' : '368px'" clearable
          variant="outlined" prepend-icon="" prepend-inner-icon="mdi-calendar" @update:model-value="handleDateChange"
          density="compact" class="mt-6 mr-3" multiple="range" rounded="xl" />
        <v-btn-toggle v-model="toggle" @update:model-value="handleBtnChange" density="comfortable" group
          variant="outlined" rounded="xl">
          <v-btn icon="mdi-filter" v-if="permissionCheck(permission[0])" value="filter"></v-btn>
          <v-btn icon="mdi-refresh" v-if="permissionCheck(permission[1])" value="refresh"></v-btn>
          <v-btn icon="mdi-plus" v-if="permissionCheck(permission[2])" value="add"></v-btn>
          <v-btn icon="mdi-file-excel"
            v-if="permissionCheck(permission[3]) || authdata.profile?.employee?.departement_id === 13"
            value="export"></v-btn>
          <v-btn icon="mdi-printer"
            v-if="permissionCheck(permission[4]) || authdata.profile?.employee?.departement_id === 13"
            value="print"></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Slot for content -->
    <slot></slot>
  </v-container>
</template>
