<script setup>
import { ref, watchEffect, computed } from 'vue'

// Props untuk membuat komponen lebih fleksibel
const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-map-marker',
  },
  id: {
    type: Number,
    default: null,
  },
  data: {
    type: Object,
    default: () => ({
      companyName: '',
      latitude: '',
      longitude: '',
      radius: '',
      address: '',
    }),
  },
  title: {
    type: String,
    default: 'Form Perusahaan',
  },
  text: {
    type: String,
    default: 'Lengkapi data perusahaan dengan benar.',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  confirmText: {
    type: String,
    default: 'Simpan',
  },
})

// Emit untuk mengirim event saat tombol ditekan
const emit = defineEmits(['cancel', 'confirm'])

// Inisialisasi formData berdasarkan props data
const idData = ref(props.id)
const formData = ref({
  companyName: props.data.companyName,
  latitude: props.data.latitude,
  longitude: props.data.longitude,
  radius: props.data.radius,
  address: props.data.address,
})

// Mengatur state form apakah untuk create atau edit
const isEditMode = computed(() => !!props.data.id)

// Validasi form
const rules = {
  required: (value) => !!value || 'Field ini wajib diisi',
  positiveNumber: (value) => {
    if (value === null || value === undefined || value === '') return 'Field ini wajib diisi'
    return Number(value) > 0 || 'Harus lebih besar dari 0'
  },
  latitude: (value) => {
    if (value === null || value === undefined || value === '') return 'Field ini wajib diisi'
    const num = Number(value)
    return (num >= -90 && num <= 90) || 'Latitude harus antara -90 dan 90'
  },
  longitude: (value) => {
    if (value === null || value === undefined || value === '') return 'Field ini wajib diisi'
    const num = Number(value)
    return (num >= -180 && num <= 180) || 'Longitude harus antara -180 dan 180'
  },
  address: (value) => {
    if (!value) return 'Field ini wajib diisi'
    return value.length <= 500 || 'Alamat tidak boleh lebih dari 500 karakter'
  },
}

const formRef = ref(null)

// Fungsi cancel untuk form
const handleCancel = () => {
  emit('cancel')
}

// Fungsi submit untuk form
const handleConfirm = () => {
  if (formRef.value.validate()) {
    emit('confirm', { form: formData, id: idData })
  }
}

// Watch jika data diubah di luar
watchEffect(() => {
  formData.value = { ...props.data } // Untuk mendukung perubahan data ketika props berubah
})
</script>
<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="6" :cols="12">
            <v-text-field
              v-model="formData.companyName"
              label="Nama Perusahaan"
              placeholder="Masukkan nama perusahaan"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field
              v-model="formData.latitude"
              label="Latitude"
              placeholder="Masukkan latitude"
              variant="outlined"
              density="compact"
              type="number"
              :rules="[rules.required, rules.latitude]"
              required
            ></v-text-field>
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field
              v-model="formData.longitude"
              label="Longitude"
              placeholder="Masukkan longitude"
              variant="outlined"
              density="compact"
              type="number"
              :rules="[rules.required, rules.longitude]"
              required
            ></v-text-field>
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field
              v-model="formData.radius"
              label="Radius Absensi"
              placeholder="Masukkan radius absensi (meter)"
              variant="outlined"
              density="compact"
              type="number"
              :rules="[rules.required, rules.positiveNumber]"
              required
            ></v-text-field>
          </v-col>

          <v-col md="12" :cols="12">
            <v-textarea
              v-model="formData.address"
              label="Alamat Lengkap"
              placeholder="Masukkan alamat lengkap"
              variant="outlined"
              density="compact"
              :rules="[rules.required, rules.address]"
              required
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn color="primary" @click="handleConfirm">
          {{ isEditMode ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
