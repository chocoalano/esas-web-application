<script setup>
import { usePeranStore } from '@/stores/pengaturan/peran'
import { ref, watchEffect, computed, onMounted } from 'vue'
// Props untuk membuat komponen lebih fleksibel
const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-map-marker',
  },
  selectItemPermission: {
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
      name: '',
      permission: [],
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
const store = usePeranStore()
// Inisialisasi formData berdasarkan props data
const idData = ref(props.id)
const formData = ref({
  name: props.data.name,
  permission: props.data.permission,
})
const userItems = ref([])

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

onMounted(async () => {
  const res_user = await store.apiGetUser()
  userItems.value = res_user.data
})
</script>
<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-text-field v-model="formData.name" label="Nama Peran" placeholder="Masukkan nama peran" variant="outlined"
          density="compact" :rules="[rules.required]" required></v-text-field>
        <v-autocomplete v-model="formData.user_ids" :items="userItems" item-title="name" item-value="id"
          label="Pilih Pengguna" chips closable-chips multiple variant="outlined" density="compact"></v-autocomplete>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Izin Akses</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectItemPermission" :key="item.name">
              <td>{{ item.name }}</td>
              <td v-for="i in item.permission" :key="i.id">
                <v-switch v-model="formData.permission" hide-details inset color="primary" :label="i.name"
                  :value="i.id"></v-switch>
              </td>
            </tr>
          </tbody>
        </v-table>
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
