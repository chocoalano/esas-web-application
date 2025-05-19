<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  icon: { type: String, default: 'mdi-map-marker' },
  data: {
    type: Object,
    default: () => ({
      type: '',
      is_payed: false,
      approve_line: true,
      approve_manager: true,
      approve_hr: true,
      with_file: true,
      show_mobile: true,
    }),
  },
  title: { type: String, default: 'Form Perusahaan' },
  text: { type: String, default: 'Lengkapi data perusahaan dengan benar.' },
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
          <v-list-item-title>Jenis Izin</v-list-item-title>
          <v-list-item-subtitle>{{ formData.type }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Apakah jenis izin ini dibayar?</v-list-item-title>
          <v-list-item-subtitle :class="formData.is_payed ? 'text-success' : 'text-error'">
            {{ formData.is_payed ? 'Ya' : 'Tidak' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Apakah jenis izin ini membutuhkan persetujuan atasan ?
          </v-list-item-title>
          <v-list-item-subtitle :class="formData.approve_line ? 'text-success' : 'text-error'">
            {{ formData.approve_line ? 'Ya' : 'Tidak' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Apakah jenis izin ini membutuhkan persetujuan manager ?
          </v-list-item-title>
          <v-list-item-subtitle :class="formData.approve_manager ? 'text-success' : 'text-error'">
            {{ formData.approve_manager ? 'Ya' : 'Tidak' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Apakah jenis izin ini membutuhkan persetujuan HR ?
          </v-list-item-title>
          <v-list-item-subtitle :class="formData.approve_hr ? 'text-success' : 'text-error'">
            {{ formData.approve_hr ? 'Ya' : 'Tidak' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title> Apakah jenis izin ini membutuhkan lampiran ? </v-list-item-title>
          <v-list-item-subtitle :class="formData.with_file ? 'text-success' : 'text-error'">
            {{ formData.with_file ? 'Ya' : 'Tidak' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Apakah jenis izin ini ditampilkan untuk pengguna smartphone ?
          </v-list-item-title>
          <v-list-item-subtitle :class="formData.show_mobile ? 'text-success' : 'text-error'">
            {{ formData.show_mobile ? 'Ya' : 'Tidak' }}
          </v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">{{ cancelText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
