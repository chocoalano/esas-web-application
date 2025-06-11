<script setup>
import { usePeranStore } from '@/stores/pengaturan/peran'
import { onMounted, ref, watch } from 'vue'

// Props
const props = defineProps({
  icon: { type: String, default: 'mdi-account-key' },
  data: {
    type: Object,
    default: () => ({
      role_ids: [],
      user_ids: [], // multiple user IDs assigned to the role
    }),
  },
  title: { type: String, default: 'Form Role' },
  text: { type: String, default: 'Silakan isi informasi role dengan benar.' },
  cancelText: { type: String, default: 'Batal' },
  submitText: { type: String, default: 'Simpan' },
  loading: { type: Boolean, default: false },
})
const roleItems = ref([])
const userItems = ref([])
const store = usePeranStore()

onMounted(async () => {
  const res_peran = await store.apiGetPeran()
  const res_user = await store.apiGetUser()
  roleItems.value = res_peran.data
  userItems.value = res_user.data
})

const emit = defineEmits(['cancel', 'submit'])

// Reactive form data
const formData = ref({ ...props.data })

// Watch props.data agar bisa update form jika ada perubahan dari parent
watch(
  () => props.data,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { deep: true }
)

// Cancel action
const handleCancel = () => emit('cancel')

// Submit action
const handleSubmit = () => emit('submit', { form: formData })
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-card-text>
      <v-skeleton-loader v-if="loading" type="card" class="mb-4">
        <template #default>
          <v-list-item v-for="n in 3" :key="n">
            <v-skeleton-loader type="text" class="mx-4" />
          </v-list-item>
        </template>
      </v-skeleton-loader>

      <template v-else>
        <v-autocomplete v-model="formData.role_ids" :items="roleItems" item-title="name" item-value="id"
          label="Pilih peran" multiple chips clearable variant="outlined" density="compact" />
        <v-autocomplete v-model="formData.user_ids" :items="userItems" item-title="name" item-value="id"
          label="Pilih Pengguna" chips closable-chips multiple variant="outlined" density="compact"></v-autocomplete>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel" color="secondary" variant="outlined">{{ cancelText }}</v-btn>
      <v-btn @click="handleSubmit" color="primary" :loading="loading">{{ submitText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
