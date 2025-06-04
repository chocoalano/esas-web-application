<template>
  <v-card prepend-icon="mdi-sun-clock" :title="`Form ${id ? 'edit' : 'tambah'} data jadwal kerja`"
    text="Silahkan lengkapi form dibawah ini">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.company_id" :items="selectCompany" item-title="name" item-value="id"
              label="Pilih Perusahaan" variant="outlined" density="compact" :rules="[rules.required]"
              @update:modelValue="onCompanyChange" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.departement" :items="selectDepartemen" item-title="name" item-value="id"
              label="Pilih Departemen" variant="outlined" density="compact" :rules="[rules.required]"
              @update:modelValue="
                () => onDepartemenChange(formData.company_id, formData.departement)
              " required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.user_id" :items="selectUser" item-title="name" item-value="id"
              label="Pilih Pengguna" variant="outlined" density="compact" :rules="[rules.required]" multiple
              required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-select v-model="formData.time_work_id" :items="selectTimework" item-title="name" item-value="id"
              label="Pilih Jam Kerja" variant="outlined" density="compact" :rules="[rules.required]"
              required></v-select>
          </v-col>
          <v-col md="4" :cols="12">
            <v-date-input v-model="formData.work_day_start" v-on:update:model-value="onDateChangeStart"
              label="PIlih tanggal mulai" clearable variant="outlined" prepend-icon="" prepend-inner-icon="mdi-calendar"
              density="compact" />
          </v-col>
          <v-col md="4" :cols="12">
            <v-date-input v-model="formData.work_day_finish" v-on:update:model-value="onDateChangeFinish"
              label="PIlih tanggal selesai" clearable variant="outlined" prepend-icon=""
              prepend-inner-icon="mdi-calendar" density="compact" />
          </v-col>
          <v-col md="4" :cols="12">
            <v-select v-model="formData.dayoff" label="Select" :items="[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ]" multiple variant="outlined" density="compact"></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel"> Tutup </v-btn>

        <v-btn color="primary" @click="handleConfirm">
          {{ id ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { useForm } from './useForm'
import { stateForm } from './types'
import { formatDateToYMD } from '@/composables/useApp'

const props = defineProps({
  id: { type: Number, default: null },
  data: { type: Object, default: () => stateForm() },
})

function onDateChangeStart(value) {
  formData.value.work_day_start = formatDateToYMD(value)
}
function onDateChangeFinish(value) {
  formData.value.work_day_finish = formatDateToYMD(value)
}

const emit = defineEmits(['cancel', 'confirm'])

const {
  id,
  formData,
  formRef,
  selectCompany,
  selectDepartemen,
  selectUser,
  selectTimework,
  rules,
  handleCancel,
  handleConfirm,
  onCompanyChange,
  onDepartemenChange,
} = useForm(props, emit)
</script>
