<script setup>
import { ref } from 'vue';
import { useForm } from './useForm'; // Pastikan path ini benar

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
} = useForm();

const timeMenuIn = ref(false)
const timeMenuOut = ref(false)
// Validasi minLength harus didefinisikan dengan benar
// Pastikan bahwa rules.minLength ada di dalam objek rules.
const customRules = {
  required: value => !!value || 'Field is required',
  minLength: length => value => value.length >= length || `Minimal ${length} karakter`,
  timeFormat: value => /^[0-9]{2}:[0-9]{2}$/.test(value) || 'Format waktu salah',
};

</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" cols="12">
            <v-autocomplete v-model="formData.company_id" :items="store.companyOptions" item-title="name"
              item-value="id" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan" variant="outlined"
              density="compact" rounded="lg" :rules="[customRules.required]" required />
          </v-col>

          <v-col md="4" cols="12">
            <v-autocomplete v-model="formData.departemen_id" :items="store.departemenOptions" item-title="name"
              item-value="id" label="Nama Departemen" placeholder="Masukkan nama departemen" variant="outlined"
              density="compact" rounded="lg" :rules="[customRules.required]" required />
          </v-col>

          <v-col md="4" cols="12">
            <v-text-field v-model="formData.name" label="Nama jam kerja" placeholder="Masukkan nama jam kerja"
              variant="outlined" density="compact" rounded="lg"
              :rules="[customRules.required, customRules.minLength(3)]" required />
          </v-col>

          <v-col md="6" cols="12">
            <v-menu v-model="timeMenuIn" :close-on-content-click="false" transition="scale-transition" max-width="290px"
              offset-y>
              <template #activator="{ props: menuProps }">
                <v-text-field v-bind="menuProps" v-model="formData.in"
                  @update:model-value="(val) => (formData.in = formatTime(val))" label="Jam Masuk" variant="outlined"
                  density="compact" rounded="lg" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                  :rules="[customRules.required, customRules.timeFormat]" />
              </template>
              <v-time-picker v-model="formData.in" format="24hr" full-width />
            </v-menu>
          </v-col>

          <v-col md="6" cols="12">
            <v-menu v-model="timeMenuOut" :close-on-content-click="false" transition="scale-transition"
              max-width="290px" offset-y>
              <template #activator="{ props: menuProps }">
                <v-text-field v-bind="menuProps" v-model="formData.out"
                  @update:model-value="(val) => (formData.out = formatTime(val))" label="Jam Pulang" variant="outlined"
                  density="compact" rounded="lg" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                  :rules="[customRules.required, customRules.timeFormat]" />
              </template>
              <v-time-picker v-model="formData.out" format="24hr" full-width />
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-alert v-if="isEditMode" border="start" close-label="Tutup Peringatan" color="warning"
          title="Peringatan Penting: Data Berelasi!" variant="tonal">
          Data ini memiliki **keterkaitan erat dengan informasi lain dalam sistem**. Setiap
          perubahan, termasuk penggantian nama departemen, jam masuk/pulang, dapat **secara langsung memengaruhi
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
