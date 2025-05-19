<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'
import useRules from '@/plugins/validator'
import { usePengumumanStore } from '@/stores/administrasiHR/pengumuman'

const router = useRouter()
const route = useRoute()
const store = usePengumumanStore()

const formRef = ref(null)

const formData = ref({
  company_id: '',
  title: '',
  status: false,
  content: '',
})

const alertState = ref({
  show: false,
  title: '',
  message: '',
  type: 'error',
})

const handleAlert = (success, message, id = null) => {
  alertState.value = {
    show: true,
    title: success ? 'Berhasil' : 'Gagal',
    message: message,
    type: success ? 'success' : 'error',
  }

  // Menghilangkan alert setelah 3 detik
  setTimeout(() => {
    alertState.value.show = false
    if (id) {
      router.push({ name: 'admhr.pengumuman.show', params: { id: id } })
    }
  }, 3000) // 3000 ms = 3 detik
}

const selectItemCompany = ref([])
const rules = useRules()

const handleCancel = () => {
  router.push({ name: 'admhr.pengumuman.list' })
}

const handleConfirm = async () => {
  // tambahkan validasi atau pengiriman form di sini
  console.log('Submit data', formData.value)
  const response = route.params.id
    ? await store.apiPutUpdate(formData.value, route.params.id)
    : await store.apiPostAdd(formData.value)
  handleAlert(response.success, response.message, route.params.id)
}

const setCompany = async () => {
  const response = await store.apiGetCompany()
  selectItemCompany.value = response.data
}
const setEdit = async () => {
  const response = await store.apiGetShow(route.params.id)
  formData.value = response.data.pengumuman
}

onMounted(() => {
  setCompany()
  if (route.params.id) {
    setEdit()
  }
})
</script>

<template>
  <v-card
    prepend-icon="mdi-information"
    title="Form data"
    text="Silahkan lengkapi form ini dengan benar!"
    class="border border-thin"
    elevation="0"
  >
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="6" :cols="12">
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
            />
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field
              v-model="formData.title"
              label="Judul pengumuman"
              placeholder="Masukkan judul"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>

          <v-col md="12" :cols="12">
            <v-switch color="primary" v-model="formData.status" label="Status" hide-details inset />
          </v-col>

          <v-col md="12" :cols="12">
            <Editor
              v-model="formData.content"
              api-key="1y2xcrnwbiunmm74mc7dvp2yufif40ojh4gvq385t4f8bzch"
              :init="{
                height: 400,
                menubar: false,
                plugins:
                  'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-if="alertState.show">
        <v-alert
          v-model="alertState.show"
          :color="alertState.type"
          :title="alertState.title"
          density="compact"
          theme="dark"
          :icon="
            alertState.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-close-circle-multiple'
          "
          class="mb-5"
        >
          {{ alertState.message }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleCancel">Batalkan</v-btn>
        <v-btn color="primary" @click="handleConfirm">
          {{ route.params.id ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
