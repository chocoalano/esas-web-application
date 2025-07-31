<script setup>
import { usePerusahaanForm } from './useForm'; // Pastikan path ini benar

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
} = usePerusahaanForm();
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0" rounded="xl">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="6" :cols="12">
            <v-text-field v-model="formData.name" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan"
              variant="outlined" density="compact" rounded="lg" :rules="[rules.required]" required></v-text-field>
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field v-model="formData.latitude" label="Latitude" placeholder="Masukkan latitude"
              variant="outlined" density="compact" rounded="lg" type="number" :rules="[rules.required, rules.latitude]"
              required></v-text-field>
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field v-model="formData.longitude" label="Longitude" placeholder="Masukkan longitude"
              variant="outlined" density="compact" rounded="lg" type="number" :rules="[rules.required, rules.longitude]"
              required></v-text-field>
          </v-col>

          <v-col md="6" :cols="12">
            <v-text-field v-model="formData.radius" label="Radius Absensi" placeholder="Masukkan radius absensi (meter)"
              variant="outlined" density="compact" rounded="lg" type="number"
              :rules="[rules.required, rules.positiveNumber]" required></v-text-field>
          </v-col>

          <v-col md="12" :cols="12">
            <v-textarea v-model="formData.full_address" label="Alamat Lengkap" placeholder="Masukkan alamat lengkap"
              variant="outlined" density="compact" rounded="lg" :rules="[rules.required, rules.address]"
              required></v-textarea>
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
