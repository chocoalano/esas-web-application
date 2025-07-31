<script setup>
import { useForm } from './useForm'; // Pastikan path ini benar
import Editor from '@tinymce/tinymce-vue'
const {
  store,
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
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0" rounded="xl">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="6" :cols="12">
            <v-autocomplete v-model="formData.company_id" :items="store.companyOptions" item-title="name"
              item-value="id" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan" variant="outlined"
              density="compact" rounded="lg" :rules="[rules.required]" required />
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field v-model="formData.title" label="Judul pengumuman" placeholder="Masukkan judul"
              variant="outlined" density="compact" rounded="lg" :rules="[rules.required]" required />
          </v-col>

          <v-col md="12" :cols="12">
            <v-switch color="primary" v-model="formData.status" label="Status" hide-details inset />
          </v-col>

          <v-col md="12" :cols="12">
            <Editor v-model="formData.content" api-key="1y2xcrnwbiunmm74mc7dvp2yufif40ojh4gvq385t4f8bzch" :init="{
              height: 400,
              menubar: false,
              plugins:
                'anchor autolink charmap codesample emoticons searchreplace table visualblocks wordcount',
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            }" />
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
