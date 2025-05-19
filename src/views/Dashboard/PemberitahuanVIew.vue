<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const store = useAuthStore()

const bcreadscrumb = ref([{ title: 'Dashboard', disabled: false, href: '/app' }])
const datepicker = ref([null, null])

const page = ref(1)
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

async function api(pageNum = 1, start = null, end = null) {
  try {
    const res = await store.getPemberitahuan(pageNum, start, end)
    return res.data.data || []
  } catch (err) {
    console.error('Failed to fetch data:', err)
    return []
  }
}

async function load({ done }) {
  if (!hasMore.value || isLoading.value) {
    done('empty')
    return
  }

  isLoading.value = true

  const [start, end] = datepicker.value
  const startStr = start ? new Date(start).toISOString().split('T')[0] : null
  const endStr = end ? new Date(end).toISOString().split('T')[0] : null

  const res = await api(page.value, startStr, endStr)
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

const handleDateChange = async (value) => {
  const [start, end] = value || []
  if (start && end) {
    const startStr = new Date(start).toISOString().split('T')[0]
    const endStr = new Date(end).toISOString().split('T')[0]

    // Reset
    page.value = 1
    items.value = []
    hasMore.value = true

    const res = await api(page.value, startStr, endStr)

    if (!res.length) {
      hasMore.value = false
    }

    items.value = res
    page.value++
  }
}

const handleClick = async (id) => {
  const read = await store.getReadPemberitahuan(id)
  if (read.success) {
    router.push({ path: '/app/administrasi-hr/izin' })
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
        <v-date-input
          v-model="datepicker"
          label="Select range"
          clearable
          variant="outlined"
          prepend-icon=""
          prepend-inner-icon="mdi-calendar"
          @update:model-value="handleDateChange"
          density="compact"
          class="mt-6 mr-3"
          range
        />
      </v-col>
    </v-row>

    <!-- Important: give v-infinite-scroll a scrollable container -->
    <v-infinite-scroll @load="load">
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" v-for="(item, index) in items" :key="index">
            <v-card
              class="mx-auto border border-thin pa-2"
              elevation="0"
              :append-icon="item.read_at ? 'mdi-check' : 'mdi-information'"
              :subtitle="item.data.body"
              :title="item.data.title"
              @click="handleClick(item.id)"
            >
            </v-card>
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
