<script setup>
import { usePermissionCheck } from '@/composables/useApp'
import { useDokumentasiStore } from '@/stores/dokumentasi'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useDokumentasiStore()
const { permissionCheck } = usePermissionCheck()

const loading = ref(false)
const data = ref({
  title: '',
  subtitle: '',
  status: false,
  text_docs: '',
})
const setCompany = async () => {
  const response = await store.apiGetShow(route.params.id)
  data.value = response.data
}

onMounted(() => {
  setCompany()
})

const handleCancel = () => {
  router.push({ name: 'adm.dokumentasi.list' })
}
const handleUpdate = () => {
  router.push({ name: 'adm.dokumentasi.edit', params: { id: route.params.id } })
}
</script>

<template>
  <v-card
    prepend-icon="mdi-information"
    :title="data.title"
    :text="data.subtitle"
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
        <div v-html="data.text_docs" class="px-5" />
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">Batalkan</v-btn>
      <v-btn @click="handleUpdate" color="primary" v-if="permissionCheck('update_role')"
        >Perbaharui</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
