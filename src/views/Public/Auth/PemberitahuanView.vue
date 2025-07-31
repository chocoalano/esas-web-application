<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const toast = useToast()
const router = useRouter()
const store = useAuthStore()

const bcreadscrumb = ref([{ title: 'Dashboard', disabled: false, href: '/app' }])
const datepicker = ref([null, null])
const page = ref(1)
const perpage = ref(10)
const items = ref([])
const hasMore = ref(true)
const isLoading = ref(false)

const updateBreadcrumbs = () => {
  const path = route.path.split('/').filter(Boolean)
  bcreadscrumb.value = path.map((segment, index) => ({
    title: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
    disabled: false,
    href: '/' + path.slice(0, index + 1).join('/'),
  }))
}

watch(() => route.path, updateBreadcrumbs, { immediate: true })

const getDateRange = () => {
  const [start, end] = datepicker.value
  const startStr = start ? new Date(start).toISOString().split('T')[0] : null
  const endStr = end ? new Date(end).toISOString().split('T')[0] : null
  return [startStr, endStr]
}

async function api(pageNum = 1, limit = 10, start = null, end = null) {
  try {
    const res = await store.GET_PEMBERITAHUAN_ACTION(pageNum, limit, start, end)
    return res.data || []
  } catch (err) {
    toast.error('Failed to fetch data:', err)
    return []
  }
}

async function load({ done }) {
  if (!hasMore.value || isLoading.value) return done('empty')

  isLoading.value = true
  const [startStr, endStr] = getDateRange()

  const res = await api(page.value, perpage.value, startStr, endStr)

  if (!res.length) {
    hasMore.value = false
    done('empty')
  } else {
    items.value.push(...res)
    page.value++
    done('ok')
  }

  isLoading.value = false
}

const refreshData = async () => {
  const [startStr, endStr] = getDateRange()
  page.value = 1
  items.value = []
  hasMore.value = true

  const res = await api(page.value, perpage.value, startStr, endStr)
  if (!res.length) hasMore.value = false
  items.value = res
  page.value++
}

const handleDateChange = refreshData
const handleLimitChange = refreshData

const handleClick = async (id) => {
  const read = await store.GET_READ_PEMBERITAHUAN_ACTION(id)
  if (read.status === 200) {
    const target = items.value.find((item) => item.id === id)
    if (target) {
      target.data.read_at = new Date().toISOString() // atau pakai read.data.read_at jika API mengembalikan
    }
    router.push({ path: '/app/aplikasi/izin' })
  } else {
    toast.error('Gagal menandai pemberitahuan sebagai dibaca.')
  }
}
</script>

<template>
  <v-container fluid class="py-2 full-height">
    <v-row align="center" justify="space-between">
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="bcreadscrumb" class="pa-2">
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-breadcrumbs>
      </v-col>

      <v-col cols="12" md="6" class="d-flex align-center gap-2 justify-md-end flex-wrap">
        <v-row no-gutters>
          <v-col md="8" class="pr-2">
            <v-date-input v-model="datepicker" label="Select range" clearable variant="outlined"
              prepend-inner-icon="mdi-calendar" @update:model-value="handleDateChange" density="compact" range
              rounded="lg" />
          </v-col>
          <v-col md="4">
            <v-select :items="[10, 20, 30, 40, 50]" density="compact" label="Limit" variant="outlined" rounded="lg"
              v-model="perpage" @update:model-value="handleLimitChange" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-infinite-scroll @load="load">
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" v-for="(item, index) in items" :key="index">
            <v-card class="mx-auto border border-thin pa-2" elevation="0"
              :append-icon="item.read_at ? 'mdi-check' : 'mdi-information'" :subtitle="item.data.message"
              :title="item.data.title" @click="handleClick(item.id)" />
          </v-col>
        </v-row>
      </v-container>
    </v-infinite-scroll>
  </v-container>
</template>

<style scoped>
.full-height {
  height: 100vh;
  overflow-y: auto;
}
</style>
