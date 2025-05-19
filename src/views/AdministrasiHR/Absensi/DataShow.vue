<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAbsensiStore } from '@/stores/administrasiHR/absensi'
import {
  useAppDebug,
  useAssetDefaultImg,
  useAssetDirectory,
  useAssetUrl,
} from '@/composables/useApp'

const router = useRouter()
const route = useRoute()
const store = useAbsensiStore()

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

const loading = ref(true)
const data = ref(null)

const fetchData = async () => {
  try {
    loading.value = true
    const response = await store.apiGetShow(route.params.id)
    data.value = response?.data ?? null
  } catch (error) {
    console.error('Gagal memuat data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const handleCancel = () => {
  router.push({ name: 'admhr.absensi.list' })
}
const handleUpdate = () => {
  router.push({ name: 'admhr.absensi.edit', params: route.params.id })
}
</script>

<template>
  <v-card
    prepend-icon="mdi-information"
    :title="data?.title || 'Detail Absensi'"
    :text="data?.company?.name || '-'"
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

      <template v-else-if="data">
        <!-- <pre>{{ data }}</pre> -->
        <v-row>
          <v-col cols="12" md="4">
            <v-list lines="two">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-icon color="indigo" icon="mdi-account"></v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ data.user.company.name }}</v-list-item-title>
                <v-list-item-subtitle>Perusahaan</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title>{{ data.user.employee.departement.name }}</v-list-item-title>
                <v-list-item-subtitle>Departement</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title>{{ data.user.name }}</v-list-item-title>
                <v-list-item-subtitle>Nama</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title>{{ data.user.nip }}</v-list-item-title>
                <v-list-item-subtitle>NIP</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title
                  >{{ data.schedule.work_day }} |
                  {{ data.schedule.timework.name }}</v-list-item-title
                >
                <v-list-item-subtitle>Jadwal kerja</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="4">
            <v-list lines="two">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-icon color="indigo" icon="mdi-fingerprint"></v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title
                  >{{ data.time_in ?? '--:--:--' }} |
                  {{ data.time_out ?? '--:--:--' }}</v-list-item-title
                >
                <v-list-item-subtitle>Jam masuk & pulang</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title
                  >{{ data.status_in ?? '----' }} |
                  {{ data.status_out ?? '----' }}</v-list-item-title
                >
                <v-list-item-subtitle>Status masuk & pulang</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title
                  >{{ data.type_in ?? '----' }} | {{ data.type_out ?? '----' }}</v-list-item-title
                >
                <v-list-item-subtitle>Tech absensi masuk & pulang</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title
                  >{{ data.lat_in ?? '----' }} | {{ data.long_in ?? '----' }}</v-list-item-title
                >
                <v-list-item-subtitle>Kordinat masuk</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar></v-avatar>
                </template>
                <v-list-item-title
                  >{{ data.lat_out ?? '----' }} | {{ data.long_out ?? '----' }}</v-list-item-title
                >
                <v-list-item-subtitle>Kordinat pulang</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12" md="6">
                <div class="ma-4">
                  <v-img
                    :aspect-ratio="1"
                    class="bg-white"
                    :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                    :src="`${assetUrl}/${data.image_in}`"
                    cover
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="ma-4">
                  <v-img
                    :aspect-ratio="1"
                    class="bg-white"
                    :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                    :src="`${assetUrl}/${data.image_out}`"
                    cover
                  ></v-img>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-alert type="error" text="Data tidak ditemukan." variant="tonal" />
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel" color="error">Kembali</v-btn>
      <v-btn @click="handleUpdate" color="primary">Perbaharui</v-btn>
    </v-card-actions>
  </v-card>
</template>
