<script setup>
import { ref, watch } from 'vue';
import { useForm } from './useForm'; // Pastikan path ini benar
import Editor from '@tinymce/tinymce-vue'
import { useAssetUrl } from '@/composables/useApp';

const assetUrl = useAssetUrl()
const {
  formRef,
  formData,
  handleConfirm,
  handleCancel,
  isEditMode,
  cancelText,
  icon,
  title,
  text,
  rules,
} = useForm();

const newImageFile = ref(null)

watch(() => formData.image, (newValue) => {
  if (isEditMode.value && typeof newValue === 'string' && newValue !== '') {
    newImageFile.value = null; // Clear the actual file input model
  }
}, { immediate: true });

watch(() => newImageFile.value, (newValue) => {
  formData.value.image = newValue
}, { immediate: true });
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0" rounded="xl">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" :cols="12">
            <v-switch v-model="formData.status" :label="`Status: ${formData.status.toString()}`" hide-details inset
              color="primary" :rules="[rules.required]" rounded="lg"></v-switch>
          </v-col>
          <v-col md="4" :cols="12">
            <v-text-field v-model="formData.title" label="Judul laporan" placeholder="Masukkan judul" variant="outlined"
              density="compact" :rules="[rules.required]" rounded="lg" required />
          </v-col>
          <v-col md="4" :cols="12">
            <v-select v-model="formData.platform" label="Platform" variant="outlined" density="compact"
              :items="['web', 'android', 'ios']" :rules="[rules.required]" rounded="lg" required></v-select>
          </v-col>
          <v-col md="12" :cols="12">
            <Editor v-model="formData.message" api-key="1y2xcrnwbiunmm74mc7dvp2yufif40ojh4gvq385t4f8bzch" :init="{
              height: 400,
              menubar: false,
              plugins:
                'anchor autolink charmap codesample emoticons lists searchreplace table visualblocks wordcount',
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            }" />
          </v-col>
          <v-col md="12" :cols="12" class="mt-5">
            <v-file-upload density="compact" v-model="newImageFile" :rules="[rules.required]"
              rounded="lg"></v-file-upload>
          </v-col>
          <v-col cols="12" v-if="formData.image">
            <v-img :src="`${assetUrl}/${formData.image}`" alt="Gambar saat ini" max-width="200" class="my-5" cover />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn color="primary" type="submit"> {{ isEditMode ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
