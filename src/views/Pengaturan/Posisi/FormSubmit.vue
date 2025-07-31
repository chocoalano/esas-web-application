<script setup>
import { useForm } from './useForm'; // Pastikan path ini benar

const {
  store,
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
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0" rounded="xl">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.company_id" :items="store.companyOptions" item-title="name"
              item-value="id" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan" variant="outlined"
              density="compact" rounded="lg" :rules="[rules.required]" required></v-autocomplete>
          </v-col>

          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.departement_id" :items="store.departemenOptions" item-title="name"
              item-value="id" label="Nama Departemen" placeholder="Masukkan nama departemen" variant="outlined"
              density="compact" rounded="lg" :rules="[rules.required]" required></v-autocomplete>
          </v-col>

          <v-col md="4" :cols="12">
            <v-text-field v-model="formData.name" label="Nama Level" placeholder="Masukkan nama level"
              variant="outlined" density="compact" rounded="lg" :rules="[rules.required]" required></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-if="isEditMode">
        <v-alert border="start" close-label="Tutup Peringatan" color="warning"
          title="Peringatan Penting: Data Berelasi!" variant="tonal">
          Data ini memiliki **keterkaitan erat dengan informasi lain dalam sistem**. Setiap
          perubahan, termasuk penggantian nama dll, dapat **secara langsung memengaruhi
          data pengguna atau entitas lain yang terhubung**. Harap tinjau ulang konsekuensi
          sebelum melanjutkan pembaharuan.
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn color="primary" rounded="lg" type="submit"> {{ isEditMode ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
