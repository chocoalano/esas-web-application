<script setup>
import { ref, watchEffect, computed } from 'vue'
// Props untuk membuat komponen lebih fleksibel
const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-map-marker',
  },
  selectItemCompany: {
    type: Array,
    default: () => [],
  },
  selectItemDepartement: {
    type: Array,
    default: () => [],
  },
  id: {
    type: Number,
    default: null,
  },
  data: {
    type: Object,
    default: () => ({
      company_id: null,
      name: '',
    }),
  },
  title: {
    type: String,
    default: 'Form default',
  },
  text: {
    type: String,
    default: 'Lengkapi data dengan benar.',
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
          <v-col md="4" :cols="12">
            <v-autocomplete
              v-model="formData.company_id"
              :items="selectItemCompany"
              item-title="name"
              item-value="id"
              label="Nama Perusahaan"
              placeholder="Masukkan nama perusahaan"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            ></v-autocomplete>
          </v-col>

          <v-col md="4" :cols="12">
            <v-autocomplete
              v-model="formData.company_id"
              :items="selectItemDepartement"
              item-title="name"
              item-value="id"
              label="Nama Departemen"
              placeholder="Masukkan nama departemen"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            ></v-autocomplete>
          </v-col>

          <v-col md="4" :cols="12">
            <v-text-field
              v-model="formData.name"
              label="Nama Posisi"
              placeholder="Masukkan nama posisi"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            ></v-text-field>
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
