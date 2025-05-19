<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useDashboardHrStore } from '@/stores/administrasiHR/dashboard'

// Reactive breadcrumb items
const items = ref([
  {
    title: 'Dashboard',
    disabled: false,
    href: '/app',
  },
])
const { mobile } = useDisplay()
const store = useDashboardHrStore()
// Reactive datepicker model
const company = ref('')
const company_selected = ref([])
const datepicker = ref([null, null])

// Emit for communication with parent
const emit = defineEmits(['date-range-changed'])

// Get current route
const route = useRoute()

// Update breadcrumb based on current route path
const updateBreadcrumbs = () => {
  const path = route.path.split('/').filter(Boolean)

  items.value = path.map((segment, index) => ({
    title: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
    disabled: false,
    href: '/' + path.slice(0, index + 1).join('/'),
  }))
}

// Watch the route.path specifically, not the whole route object
watch(() => route.path, updateBreadcrumbs, { immediate: true })

// Emit formatted date range
const handleDateChange = (value) => {
  if (value !== null) {
    const [startDate, endDate] = value
    if (startDate && endDate) {
      emit('date-range-changed', {
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0],
      })
    }
  }
}
// Emit formatted date range
const handleCompanyChange = (value) => {
  if (value !== null) {
    emit('company-changed', value)
  }
}
onMounted(async () => {
  const { data } = await store.apiGetCompany()
  company_selected.value = data
})
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
        <v-select
          v-model="company"
          class="mt-6 mr-6"
          density="compact"
          variant="outlined"
          :items="company_selected"
          item-title="name"
          item-value="id"
          @update:model-value="handleCompanyChange"
        ></v-select>
        <v-date-input
          v-model="datepicker"
          label="Select range"
          :max-width="mobile ? '100%' : '368px'"
          clearable
          variant="outlined"
          prepend-icon=""
          prepend-inner-icon="mdi-calendar"
          @update:model-value="handleDateChange"
          density="compact"
          class="mt-6 mr-3"
          multiple="range"
        />
      </v-col>
    </v-row>

    <!-- Slot for content -->
    <slot></slot>
  </v-container>
</template>
