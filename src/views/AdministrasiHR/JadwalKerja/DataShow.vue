<script setup>
import { ref, watch } from 'vue'
import {
  useAppDebug,
  useAssetUrl,
  useAssetDirectory,
  useAssetDefaultImg,
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
    default: () => ({
      title: '',
      status: false,
      message: '',
      platform: '',
      image: null,
    }),
  },
  cancelText: { type: String, default: 'Batal' },
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
  <v-card :prepend-icon="icon" :title="formData.title">
    <v-card-text>
      <v-skeleton-loader v-if="loading" type="card" class="mb-4">
        <template #default>
          <v-list-item v-for="n in 5" :key="n">
            <v-skeleton-loader type="text" class="mx-4" />
          </v-list-item>
        </template>
      </v-skeleton-loader>

      <template v-else>
        <div v-html="formData.message" class="mx-5"></div>
        <div class="my-5 mx-5">
          <v-img
            :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
            :src="`${assetUrl}/${formData.image}`"
            aspect-ratio="1"
            max-width="300"
            class="bg-grey-lighten-2 py-5 px-5"
          />
        </div>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">{{ cancelText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
