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
      type: '',
      is_payed: false,
      approve_line: true,
      approve_manager: true,
      approve_hr: true,
      with_file: true,
      show_mobile: true,
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
  type: props.data.type,
  is_payed: props.data.is_payed,
  approve_line: props.data.approve_line,
  approve_manager: props.data.approve_manager,
  approve_hr: props.data.approve_hr,
  with_file: props.data.with_file,
  show_mobile: props.data.show_mobile,
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
        <v-text-field
          v-model="formData.type"
          label="Nama type"
          placeholder="Masukkan nama type"
          variant="outlined"
          density="compact"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-switch
          v-model="formData.is_payed"
          :label="`Apakah izin ini akan dibayar? ${formData.is_payed ? `Ya` : `Tidak`}`"
          hide-details
          color="primary"
          inset
        ></v-switch>
        <v-switch
          v-model="formData.approve_line"
          :label="`Apakah izin ini akan membutuhkan persetujuan atasan?: ${formData.approve_line ? `Ya` : `Tidak`}`"
          hide-details
          color="primary"
          inset
        ></v-switch>
        <v-switch
          v-model="formData.approve_manager"
          :label="`Apakah izin ini akan membutuhkan persetujuan menejer?: ${formData.approve_manager ? `Ya` : `Tidak`}`"
          hide-details
          color="primary"
          inset
        ></v-switch>
        <v-switch
          v-model="formData.approve_hr"
          :label="`Apakah izin ini akan membutuhkan persetujuan HR?: ${formData.approve_hr ? `Ya` : `Tidak`}`"
          hide-details
          color="primary"
          inset
        ></v-switch>
        <v-switch
          v-model="formData.with_file"
          :label="`Apakah izin ini akan membutuhkan lampiran file?: ${formData.with_file ? `Ya` : `Tidak`}`"
          hide-details
          color="primary"
          inset
        ></v-switch>
        <v-switch
          v-model="formData.show_mobile"
          :label="`Apakah izin ini akan ditampilkan di mobile/smartphone?: ${formData.show_mobile ? `Ya` : `Tidak`}`"
          hide-details
          color="primary"
          inset
        ></v-switch>
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
