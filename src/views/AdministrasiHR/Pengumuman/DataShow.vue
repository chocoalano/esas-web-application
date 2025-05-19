<script setup>
import { usePengumumanStore } from '@/stores/administrasiHR/pengumuman'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = usePengumumanStore()

const loading = ref(false)
const data = ref({
  company_id: '',
  title: '',
  status: false,
  content: '',
  company: {
    name: '',
  },
})
const setCompany = async () => {
  const response = await store.apiGetShow(route.params.id)
  data.value = response.data.pengumuman
}

onMounted(() => {
  setCompany()
})

const handleCancel = () => {
  router.push({ name: 'admhr.pengumuman.list' })
}
const handleUpdate = () => {
  router.push({ name: 'admhr.pengumuman.edit', params: { id: route.params.id } })
}
</script>

<template>
  <v-card
    prepend-icon="mdi-information"
    :title="data.title"
    :text="data.company.name"
    class="border border-thin"
    elevation="0"
  >
    <v-card-text>
      <v-skeleton-loader v-if="loading" type="card" class="mb-4">
        <template #default>
          <v-list-item v-for="n in 5" :key="n">
            <v-skeleton-loader type="text" class="mx-4" />
          </v-list-item>
        </template>
      </v-skeleton-loader>

      <template v-else>
        <div v-html="data.content" class="px-5" />
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">Batalkan</v-btn>
      <v-btn @click="handleUpdate" color="primary">Perbaharui</v-btn>
    </v-card-actions>
  </v-card>
</template>
