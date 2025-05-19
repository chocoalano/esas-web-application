<script setup>
import { ref, watch } from 'vue'
import { stateForm } from './types'
import {
  useAppDebug,
  useAssetDefaultImg,
  useAssetDirectory,
  useAssetUrl,
} from '@/composables/useApp'

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

// Props
const props = defineProps({
  icon: { type: String, default: 'mdi-map-marker' },
  data: {
    type: Object,
    default: () => stateForm().formData,
  },
  title: { type: String, default: 'Form Perusahaan' },
  text: { type: String, default: 'Lengkapi data perusahaan dengan benar.' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['cancel'])

// Reactive formData dari props
const formData = ref({ ...props.data })

// Watch props.data jika berubah
watch(
  () => props.data,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { deep: true },
)

// Emit saat tombol cancel ditekan
const handleCancel = () => emit('cancel')
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-card-text>
      <v-skeleton-loader v-if="loading" type="card" class="mb-4">
        <template #default>
          <v-list-item v-for="n in 5" :key="n">
            <v-skeleton-loader type="text" class="mx-4" />
          </v-list-item>
        </template>
      </v-skeleton-loader>

      <template v-else>
        <v-list-item>
          <v-list-item-title>Numbers</v-list-item-title>
          <v-list-item-subtitle>{{ data.permit_numbers }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Dari tanggal</v-list-item-title>
          <v-list-item-subtitle>{{ data.start_date }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Sampai tanggal</v-list-item-title>
          <v-list-item-subtitle>{{ data.end_date }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Dari jam</v-list-item-title>
          <v-list-item-subtitle>{{ data.start_time }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Sampai jam</v-list-item-title>
          <v-list-item-subtitle>{{ data.end_time }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Keterangan</v-list-item-title>
          <v-list-item-subtitle>{{ data.notes }}</v-list-item-subtitle>
        </v-list-item>

        <v-img
          class="mx-auto"
          height="300"
          :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
          max-width="500"
          :src="`${assetUrl}/${data.file}`"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">Batal</v-btn>
    </v-card-actions>
  </v-card>
</template>
