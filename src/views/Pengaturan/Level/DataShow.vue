<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  icon: { type: String, default: 'mdi-map-marker' },
  selectItemCompany: {
    type: Array,
    default: () => [],
  },
  selectItemDepartement: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Object,
    default: () => ({
      company_id: null,
      departement_id: null,
      name: '',
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
        <v-autocomplete
          v-model="formData.company_id"
          :items="selectItemCompany"
          item-title="name"
          item-value="id"
          label="Nama Perusahaan"
          placeholder="Masukkan nama perusahaan"
          variant="outlined"
          density="compact"
          disabled
        ></v-autocomplete>
        <v-autocomplete
          v-model="formData.company_id"
          :items="selectItemDepartement"
          item-title="name"
          item-value="id"
          label="Nama Departemen"
          placeholder="Masukkan nama departemen"
          variant="outlined"
          density="compact"
          disabled
        ></v-autocomplete>
        <v-text-field
          v-model="formData.name"
          label="Nama Level"
          placeholder="Masukkan nama level"
          variant="outlined"
          density="compact"
          disabled
        ></v-text-field>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">{{ cancelText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
