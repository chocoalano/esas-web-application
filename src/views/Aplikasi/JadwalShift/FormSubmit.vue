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

const onCompanyChange = () => {
  store.CREATE_DATA_ACTION()
}
const onDepartemenChange = () => {
  store.CREATE_DATA_ACTION()
}
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.company_id" :items="store.companyOptions" item-title="name"
              item-value="id" label="Pilih Perusahaan" variant="outlined" density="compact" rounded="lg"
              :rules="[rules.required]" @update:modelValue="onCompanyChange" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.departement" :items="store.departemenOptions" item-title="name"
              item-value="id" label="Pilih Departemen" variant="outlined" density="compact" rounded="lg"
              :rules="[rules.required]" @update:modelValue="onDepartemenChange" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-switch v-model="formData.is_rolling"
              :label="`Apakah shift/waktu kerja akan berputar? : ${formData.is_rolling ? 'Ya' : 'Tidak'}`"
              inset></v-switch>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.user_id" :items="store.userOptions" item-title="name" item-value="id"
              label="Pilih Pengguna" variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
              multiple required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-select v-model="formData.time_work_id" :items="store.timeOptions" item-title="name" item-value="id"
              label="Pilih Jam Kerja" variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
              required></v-select>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.is_rolling">
            <v-select v-model="formData.time_work_rolling_id" :items="store.timeOptions" item-title="name"
              item-value="id" label="Pilih perputaran jam kerja" variant="outlined" density="compact" rounded="lg"
              :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col md="4" :cols="12">
            <v-date-input v-model="formData.work_day_start" label="PIlih tanggal mulai" clearable variant="outlined"
              prepend-icon="" prepend-inner-icon="mdi-calendar" density="compact" rounded="lg" />
          </v-col>
          <v-col md="4" :cols="12">
            <v-date-input v-model="formData.work_day_finish" label="PIlih tanggal selesai" clearable variant="outlined"
              prepend-icon="" prepend-inner-icon="mdi-calendar" density="compact" rounded="lg" />
          </v-col>
          <v-col md="4" :cols="12">
            <v-select v-model="formData.dayoff" label="PIlih hari libur untuk shift ini." :items="[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ]" multiple variant="outlined" density="compact" rounded="lg"></v-select>
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
