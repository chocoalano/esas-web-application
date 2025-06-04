<script setup>
import useRules from '@/plugins/validator'
import { ref, watchEffect, computed, onMounted } from 'vue'
import { stateForm } from './types'
import { useIzinStore } from '@/stores/administrasiHR/izin'
import dayjs from 'dayjs'
import { formatDateToYMD } from '@/composables/useApp'

const store = useIzinStore()
const selectCompany = ref([])
const selectDepartement = ref([])
const selectUser = ref([])
const selectPermit = ref([])
const selectSchedule = ref([])
const selectTimework = ref([])
const modal_time1 = ref(false)
const modal_time2 = ref(false)
const modal_time3 = ref(false)
const modal_time4 = ref(false)
const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  data: {
    type: Object,
    default: () => stateForm().formData,
  },
})
const emit = defineEmits(['cancel', 'confirm'])
const idData = ref(props.id)
const formData = ref({
  company_id: props.data.company_id,
  departement_id: props.data.departement_id,
  user_id: props.data.user_id,
  permittype_id: props.data.permittype_id,
  schedule_id: props.data.schedule_id,
  permit_numbers: props.data.permit_numbers,
  timein_adjust: props.data.timein_adjust,
  timeout_adjust: props.data.timeout_adjust,
  current_shift_id: props.data.current_shift_id,
  adjust_shift_id: props.data.adjust_shift_id,
  start_date: props.data.start_date,
  end_date: props.data.end_date,
  start_time: props.data.start_time,
  end_time: props.data.end_time,
  notes: props.data.notes,
  file: props.data.file,
})
const isEditMode = computed(() => !!props.id)
const rules = useRules()
const formRef = ref(null)
const handleCancel = () => {
  emit('cancel')
}
const handleConfirm = () => {
  if (formRef.value.validate()) {
    emit('confirm', { form: formData.value, id: idData.value })
  }
}

const getKelengkapanFormFilter = async () => {
  const [company, departemen, user, permit] = await Promise.all([
    store.apiGetCompany(),
    store.apiGetDepartement(),
    store.apiGetUser(),
    store.apiGetPermit(),
  ])
  selectCompany.value = company.data
  selectDepartement.value = departemen.data
  selectUser.value = user.data
  selectPermit.value = permit.data
}
const onCompanyChange = async (id) => {
  const response = await store.apiGetDepartement(id)
  selectDepartement.value = response.data
}
const onDepartementChange = async (id) => {
  const response = await store.apiGetUser(formData.value.company_id, id)
  selectUser.value = response.data
}
const onUserChange = async (id) => {
  const [schedule, permitType] = await Promise.all([
    store.apiGetSchedule(formData.value.company_id, formData.value.departement_id, id),
    store.apiGetPermit(),
  ])
  selectSchedule.value = schedule.data
  selectPermit.value = permitType.data
}
const onPermitChange = async (id) => {
  const response = await store.apiGetNumbers(id)
  formData.value.permit_numbers = response.data

  if (id === 16) {
    const response = await store.apiGetShift(
      formData.value.company_id,
      formData.value.departement_id,
    )
    selectTimework.value = response.data
  }
}

onMounted(() => getKelengkapanFormFilter())

const selectScheduleProps = (item) => {
  return {
    title: dayjs(item.work_day).format('DD/MM/YYYY'),
    subtitle: `${item.time_work.name}|${item.time_work.in}-${item.time_work.out}`,
  }
}

// Watch jika data diubah di luar
watchEffect(() => {
  formData.value = { ...props.data } // Untuk mendukung perubahan data ketika props berubah
})

function onDateChangeStart(value) {
  formData.value.start_date = formatDateToYMD(value)
}
function onDateChangeEnd(value) {
  formData.value.end_date = formatDateToYMD(value)
}

</script>
<template>
  <v-card prepend-icon="mdi-information-outline" title="Form Izin"
    text="Silahkan pilih jenis form dan lengkapi form yang anda pilih dengan benar!">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.company_id" :items="selectCompany" item-title="name" item-value="id"
              label="Pilih Perusahaan" variant="outlined" density="compact" :rules="[rules.required]"
              @update:modelValue="onCompanyChange" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.departement_id" :items="selectDepartement" item-title="name"
              item-value="id" label="Pilih Departement" variant="outlined" density="compact" :rules="[rules.required]"
              @update:modelValue="onDepartementChange" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.user_id" :items="selectUser" item-title="name" item-value="id"
              label="Pilih User" variant="outlined" density="compact" :rules="[rules.required]"
              @update:modelValue="onUserChange" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.permittype_id" :items="selectPermit" item-title="type" item-value="id"
              label="Pilih Jenis Izin" variant="outlined" density="compact" @update:modelValue="onPermitChange"
              :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.schedule_id" :items="selectSchedule" :item-props="selectScheduleProps"
              item-title="name" item-value="id" label="Pilih Jadwal" variant="outlined" density="compact"
              :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-text-field v-model="formData.permit_numbers" label="Izin Numbers" placeholder="Nomor izin otomatis"
              variant="outlined" density="compact" :rules="[rules.required]" required disabled />
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-date-input v-model="formData.start_date" v-on:update:model-value="onDateChangeStart"
              label="Pilih tanggal mulai" clearable variant="outlined" prepend-icon="" prepend-inner-icon="mdi-calendar"
              density="compact" />
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-date-input v-model="formData.end_date" v-on:update:model-value="onDateChangeEnd"
              label="Pilih tanggal selesai" clearable variant="outlined" prepend-icon=""
              prepend-inner-icon="mdi-calendar" density="compact" />
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-text-field v-model="formData.start_time" :active="modal_time1" :focused="modal_time1"
              label="Pilih jam mulai" variant="outlined" prepend-inner-icon="mdi-clock-time-four-outline" readonly
              density="compact">
              <v-dialog v-model="modal_time1" activator="parent" width="auto">
                <v-time-picker v-if="modal_time1" v-model="formData.start_time" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-text-field v-model="formData.end_time" :active="modal_time2" :focused="modal_time2"
              label="Pilih jam selesai" prepend-inner-icon="mdi-clock-time-four-outline" variant="outlined" readonly
              density="compact">
              <v-dialog v-model="modal_time2" activator="parent" width="auto">
                <v-time-picker v-if="modal_time2" v-model="formData.end_time" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 15">
            <v-text-field v-model="formData.timein_adjust" :active="modal_time3" :focused="modal_time3"
              label="Pilih perubahan jam masuk" prepend-inner-icon="mdi-clock-time-four-outline" variant="outlined"
              readonly density="compact">
              <v-dialog v-model="modal_time3" activator="parent" width="auto">
                <v-time-picker v-if="modal_time3" v-model="formData.timein_adjust" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 15">
            <v-text-field v-model="formData.timeout_adjust" :active="modal_time4" :focused="modal_time4"
              label="Pilih perubahan jam pulang" prepend-inner-icon="mdi-clock-time-four-outline" variant="outlined"
              readonly density="compact">
              <v-dialog v-model="modal_time4" activator="parent" width="auto">
                <v-time-picker v-if="modal_time4" v-model="formData.timeout_adjust" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 16">
            <v-select v-model="formData.current_shift_id" :items="selectTimework" density="compact"
              label="Pilih shift berjalan sekarang" variant="outlined" item-title="name" item-value="id">
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  {{ item.raw.name }} | {{ item.raw.in }} - {{ item.raw.out }}
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 16">
            <v-select v-model="formData.adjust_shift_id" :items="selectTimework" density="compact"
              label="Pilih shift yang ingin diajukan" variant="outlined" item-value="id" item-title="name">
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  {{ item.raw.name }} | {{ item.raw.in }} - {{ item.raw.out }}
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col md="12" :cols="12">
            <v-textarea v-model="formData.notes" label="Keterangan" variant="outlined">
            </v-textarea>
          </v-col>
          <v-col md="12" :cols="12">
            <v-file-upload v-model="formData.file" density="compact"></v-file-upload>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel"> Tutup </v-btn>

        <v-btn color="primary" @click="handleConfirm">
          {{ isEditMode ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
