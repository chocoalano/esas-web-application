<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'
import useRules from '@/plugins/validator'
import { useDokumentasiStore } from '@/stores/dokumentasi'

const router = useRouter()
const route = useRoute()
const store = useDokumentasiStore()

const formRef = ref(null)

const formData = ref({
  title: '',
  subtitle: '',
  status: false,
  text_docs: '',
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
      router.push({ name: 'adm.dokumentasi.show', params: { id: id } })
    }
  }, 3000) // 3000 ms = 3 detik
}
const rules = useRules()

const handleCancel = () => {
  router.push({ name: 'adm.dokumentasi.list' })
}

const handleConfirm = async () => {
  const response = route.params.id
    ? await store.apiPutUpdate(formData.value, route.params.id)
    : await store.apiPostAdd(formData.value)
  handleAlert(response.success, response.message, route.params.id)
}
const setEdit = async () => {
  const response = await store.apiGetShow(route.params.id)
  formData.value = response.data
}

onMounted(() => {
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
            <v-text-field
              v-model="formData.title"
              label="Judul"
              placeholder="Masukkan judul"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col md="6" :cols="12">
            <v-text-field
              v-model="formData.subtitle"
              label="Sub Judul"
              placeholder="Masukkan sub judul"
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
              v-model="formData.text_docs"
              api-key="1y2xcrnwbiunmm74mc7dvp2yufif40ojh4gvq385t4f8bzch"
              :init="{
                height: 400,
                menubar: false,
                plugins:
                  'anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
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
