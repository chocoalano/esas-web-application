<script setup>
import { useForm } from './useForm'; // Pastikan path ini benar

const {
  formRef,
  formData,
  handleConfirm, // <-- Tambahkan ini
  handleCancel,  // <-- Tambahkan ini
  isEditMode,    // <-- Tambahkan ini
  cancelText,    // <-- Tambahkan ini
  icon,          // <-- Tambahkan ini
  title,         // <-- Tambahkan ini
  text,          // <-- Tambahkan ini
  rules,         // <-- Tambahkan ini
} = useForm();
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="formData.type" label="Nama type" placeholder="Masukkan nama type" variant="outlined"
              density="compact" :rules="[rules.required]" required rounded="lg"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.is_payed"
              :label="`Apakah izin ini akan dibayar? ${formData.is_payed ? `Ya` : `Tidak`}`" hide-details
              color="primary" inset></v-switch>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.approve_line"
              :label="`Apakah izin ini akan membutuhkan persetujuan atasan?: ${formData.approve_line ? `Ya` : `Tidak`}`"
              hide-details color="primary" inset></v-switch>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.approve_manager"
              :label="`Apakah izin ini akan membutuhkan persetujuan menejer?: ${formData.approve_manager ? `Ya` : `Tidak`}`"
              hide-details color="primary" inset></v-switch>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.approve_hr"
              :label="`Apakah izin ini akan membutuhkan persetujuan HR?: ${formData.approve_hr ? `Ya` : `Tidak`}`"
              hide-details color="primary" inset></v-switch>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.with_file"
              :label="`Apakah izin ini akan membutuhkan lampiran file?: ${formData.with_file ? `Ya` : `Tidak`}`"
              hide-details color="primary" inset></v-switch>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.show_mobile"
              :label="`Apakah izin ini akan ditampilkan di mobile/smartphone?: ${formData.show_mobile ? `Ya` : `Tidak`}`"
              hide-details color="primary" inset></v-switch>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-alert v-if="isEditMode" border="start" close-label="Tutup Peringatan" color="warning"
          title="Peringatan Penting: Data Berelasi!" variant="tonal">
          Data ini memiliki **keterkaitan erat dengan informasi lain dalam sistem**. Setiap
          perubahan, termasuk penggantian nama posisi, dapat **secara langsung memengaruhi
          data pengguna atau entitas lain yang terhubung**. Harap tinjau ulang konsekuensi
          sebelum melanjutkan pembaharuan.
        </v-alert>
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
