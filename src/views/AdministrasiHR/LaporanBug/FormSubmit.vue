<script setup>
import { ref, watchEffect, computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import useRules from '@/plugins/validator'
import { useAssetUrl } from '@/composables/useApp'

const assetUrl = useAssetUrl()
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
      title: '',
      status: false,
      message: '',
      platform: '',
      image: null,
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
const rules = useRules()

// 👇 simpan url image lama jika dalam mode edit
const previewImage = ref(typeof props.data.image === 'string' ? props.data.image : null)

const idData = ref(props.id)
const formData = ref({
  title: props.data.title,
  status: props.data.status,
  message: props.data.message,
  platform: props.data.platform,
  image: null,
})

// Mengatur state form apakah untuk create atau edit
const isEditMode = computed(() => !!props.data.id)

const formRef = ref(null)

// Fungsi cancel untuk form
const handleCancel = () => {
  emit('cancel')
}

// Fungsi submit untuk form
const handleConfirm = () => {
  if (formRef.value?.validate()) {
    // Kirim previewImage jika tidak upload baru
    emit('confirm', {
      form: {
        ...formData.value,
        image: formData.value.image || previewImage.value,
      },
      id: idData.value,
    })
  }
}

// Watch jika data diubah di luar
watchEffect(() => {
  formData.value = {
    title: props.data.title,
    status: props.data.status,
    message: props.data.message,
    platform: props.data.platform,
    image: null, // reset untuk v-file-upload
  }
  previewImage.value = typeof props.data.image === 'string' ? props.data.image : null
})
</script>
<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" :cols="12">
            <v-switch
              v-model="formData.status"
              :label="`Status: ${formData.status.toString()}`"
              hide-details
              inset
              color="primary"
              :rules="[rules.required]"
            ></v-switch>
          </v-col>
          <v-col md="4" :cols="12">
            <v-text-field
              v-model="formData.title"
              label="Judul laporan"
              placeholder="Masukkan judul"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col md="4" :cols="12">
            <v-select
              v-model="formData.platform"
              label="Platform"
              variant="outlined"
              density="compact"
              :items="['web', 'android', 'ios']"
              :rules="[rules.required]"
              required
            ></v-select>
          </v-col>
          <v-col md="12" :cols="12">
            <Editor
              v-model="formData.message"
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
          <v-col md="12" :cols="12">
            <v-file-upload
              density="compact"
              v-model="formData.image"
              :rules="[rules.required]"
            ></v-file-upload>
          </v-col>
          <v-col cols="12" v-if="previewImage">
            <v-img
              :src="`${assetUrl}/${previewImage}`"
              alt="Gambar saat ini"
              max-width="200"
              class="my-5"
              cover
            />
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
