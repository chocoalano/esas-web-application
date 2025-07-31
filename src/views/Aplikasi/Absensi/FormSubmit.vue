<script setup>
import dayjs from 'dayjs';
import { useForm } from './useForm';
import { ref, watch } from 'vue';

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
  rules
} = useForm();

const timeInMenu = ref(false);
const timeOutMenu = ref(false);

const newImageInFile = ref(null);
const newImageOutFile = ref(null);

// --- Crucial Watchers for File Inputs ---
// When formData.image_in (the URL string from API) changes,
// we want to reset newImageInFile so that the file input is ready for a *new* upload.
watch(() => formData.image_in, (newValue) => {
  if (isEditMode.value && typeof newValue === 'string' && newValue !== '') {
    newImageInFile.value = null; // Clear the actual file input model
  }
}, { immediate: true }); // Run immediately on component mount

watch(() => formData.image_out, (newValue) => {
  if (isEditMode.value && typeof newValue === 'string' && newValue !== '') {
    newImageOutFile.value = null;
  }
}, { immediate: true });
watch(() => newImageInFile.value, (newValue) => {
  formData.value.image_in = newValue
}, { immediate: true }); // Run immediately on component mount

watch(() => newImageOutFile.value, (newValue) => {
  formData.value.image_out = newValue
}, { immediate: true });
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="3" :cols="12">
            <v-autocomplete v-model="formData.company_id" :items="store.companyOptions" item-title="name"
              item-value="id" label="Pilih Perusahaan" variant="outlined" density="compact" :rules="[rules.required]"
              required />
          </v-col>

          <v-col md="3" :cols="12">
            <v-autocomplete v-model="formData.departement_id" :items="store.deptOptions" item-title="name"
              item-value="id" label="Pilih Departemen" variant="outlined" density="compact" :rules="[rules.required]"
              required />
          </v-col>

          <v-col md="3" :cols="12">
            <v-autocomplete v-model="formData.user_id" :items="store.userOptions" item-title="name" item-value="id"
              label="Pilih User" variant="outlined" density="compact" :rules="[rules.required]" required />
          </v-col>

          <v-col md="3" :cols="12">
            <v-autocomplete v-model="formData.user_timework_schedule_id" :items="store.scheduleOptions"
              item-title="timework.name" item-value="id" label="Pilih Jadwal" variant="outlined" density="compact"
              :rules="[rules.required]" required>
              <template v-slot:item="{ props: listItemProps, item: listItem }">
                <v-list-item v-bind="listItemProps"
                  :title="`${listItem.raw.timework.name} | ${listItem.raw.timework.in} - ${listItem.raw.timework.out}`"
                  :subtitle="dayjs(listItem.raw.work_day).format('DD/MM/YYYY')" />
              </template>
            </v-autocomplete>
          </v-col>

          <v-col md="3" :cols="12">
            <v-menu v-model="timeInMenu" :close-on-content-click="false" transition="scale-transition" max-width="290px"
              offset-y>
              <template #activator="{ props: menuProps }">
                <v-text-field v-bind="menuProps" v-model="formData.time_in" label="Jam Masuk" variant="outlined"
                  density="compact" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                  :rules="[rules.required]" />
              </template>
              <v-time-picker v-model="formData.time_in" format="24hr" full-width
                @update:model-value="(val) => { formData.time_in = val; timeInMenu = false; }" />
            </v-menu>
          </v-col>

          <v-col md="3" :cols="12">
            <v-menu v-model="timeOutMenu" :close-on-content-click="false" transition="scale-transition"
              max-width="290px" offset-y>
              <template #activator="{ props: menuProps }">
                <v-text-field v-bind="menuProps" v-model="formData.time_out" label="Jam Pulang" variant="outlined"
                  density="compact" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                  :rules="[rules.required]" />
              </template>
              <v-time-picker v-model="formData.time_out" format="24hr" full-width
                @update:model-value="(val) => { formData.time_out = val; timeOutMenu = false; }" />
            </v-menu>
          </v-col>

          <v-col md="3" :cols="12">
            <v-radio-group v-model="formData.status_in" inline :rules="[rules.required]">
              <template v-slot:label>
                <div>Pilih status <strong>jam masuk</strong></div>
              </template>
              <v-radio value="late" label="Terlambat"></v-radio>
              <v-radio value="unlate" label="Tidak Terlambat"></v-radio>
              <v-radio value="normal" label="Normal"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col md="3" :cols="12">
            <v-radio-group v-model="formData.status_out" inline :rules="[rules.required]">
              <template v-slot:label>
                <div>Pilih status <strong>jam pulang</strong></div>
              </template>
              <v-radio value="late" label="Terlambat"></v-radio>
              <v-radio value="unlate" label="Tidak Terlambat"></v-radio>
              <v-radio value="normal" label="Normal"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col md="6" :cols="12">
            <v-radio-group v-model="formData.type_in" inline :rules="[rules.required]">
              <template v-slot:label>
                <div>Pilih metode <strong>Absensi masuk</strong></div>
              </template>
              <v-radio value="qrcode" label="Kode QR"></v-radio>
              <v-radio value="face-device" label="Pendeteksi wajah"></v-radio>
              <v-radio value="face-geolocation" label="Kordinat lokasi"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col md="6" :cols="12">
            <v-radio-group v-model="formData.type_out" inline :rules="[rules.required]">
              <template v-slot:label>
                <div>Pilih metode <strong>Absensi pulang</strong></div>
              </template>
              <v-radio value="qrcode" label="Kode QR"></v-radio>
              <v-radio value="face-device" label="Pendeteksi wajah"></v-radio>
              <v-radio value="face-geolocation" label="Kordinat lokasi"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col md="3" :cols="12">
            <v-text-field v-model="formData.lat_in" label="Latitude jam masuk" placeholder="Masukkan kordinat latitude"
              variant="outlined" density="compact" :rules="[rules.required, rules.coordinate]" required />
          </v-col>
          <v-col md="3" :cols="12">
            <v-text-field v-model="formData.long_in" label="Longitude jam masuk"
              placeholder="Masukkan kordinat longitude" variant="outlined" density="compact"
              :rules="[rules.required, rules.coordinate]" required />
          </v-col>

          <v-col md="3" :cols="12">
            <v-text-field v-model="formData.lat_out" label="Latitude jam pulang"
              placeholder="Masukkan kordinat latitude" variant="outlined" density="compact"
              :rules="[rules.required, rules.coordinate]" required />
          </v-col>
          <v-col md="3" :cols="12">
            <v-text-field v-model="formData.long_out" label="Longitude jam pulang"
              placeholder="Masukkan kordinat longitude" variant="outlined" density="compact"
              :rules="[rules.required, rules.coordinate]" required />
          </v-col>

          <v-col md="6" :cols="12">
            <v-file-input density="compact" v-model="newImageInFile" label="Unggah Foto Masuk" prepend-icon="mdi-camera"
              variant="outlined" />
          </v-col>

          <v-col md="6" :cols="12">
            <v-file-input density="compact" v-model="newImageOutFile" label="Unggah Foto Pulang"
              prepend-icon="mdi-camera" variant="outlined" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn color="primary" type="submit">
          {{ isEditMode ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<style scoped>
/* Tambahkan gaya khusus di sini jika diperlukan */
</style>
