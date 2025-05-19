<script setup>
import { ref, watch } from 'vue'
import { capitalizeWords } from '@/plugins/string'
// Props
const props = defineProps({
  icon: { type: String, default: 'mdi-map-marker' },
  data: {
    type: Object,
    default: () => ({
      company_id: '',
      name: '',
      company: {
        name: '',
      },
      job_positions: [],
      job_levels: [],
      employees: [],
    }),
  },
  title: { type: String, default: 'Form data' },
  text: { type: String, default: 'Lengkapi data data dengan benar.' },
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
          <v-list-item-title>Nama Perusahaan</v-list-item-title>
          <v-list-item-subtitle>{{ formData.company.name }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Nama Departemen</v-list-item-title>
          <v-list-item-subtitle>{{ formData.name }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Posisi/jabatan yang tersedia</v-list-item-title>
          <v-list-item-subtitle>{{
            formData.job_positions.map((j) => capitalizeWords(j.name)).join(', ')
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Level yang tersedia</v-list-item-title>
          <v-list-item-subtitle>{{
            formData.job_levels.map((j) => capitalizeWords(j.name)).join(', ')
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Level yang tersedia</v-list-item-title>
          <v-list-item-subtitle>{{
            formData.employees.map((j) => capitalizeWords(j.user.name)).join(', ')
          }}</v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">{{ cancelText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
