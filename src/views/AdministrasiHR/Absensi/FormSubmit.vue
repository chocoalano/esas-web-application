<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useRules from '@/plugins/validator'
import { useAbsensiStore } from '@/stores/administrasiHR/absensi'
import { stateAlert, stateForm } from './types'
import { formatDay, formatTime } from '@/composables/useApp'

const router = useRouter()
const route = useRoute()
const store = useAbsensiStore()
const formRef = ref(null)
const formData = ref(stateForm())
const formfilter = ref({
  company_id: null,
  departement_id: null,
})
const alertState = ref(stateAlert)

const handleAlert = (success, message, id = null) => {
  alertState.value = {
    show: true,
    title: success ? 'Berhasil' : 'Gagal',
    message: message,
    type: success ? 'success' : 'error',
  }
  setTimeout(() => {
    alertState.value.show = false
    if (id) {
      router.push({ name: 'admhr.absensi.show', params: { id: id } })
    }
  }, 3000)
}

const selectCompany = ref([])
const selectDepartement = ref([])
const selectUser = ref([])
const selectSchedule = ref([])
const timeIn = ref(false)
const timeOut = ref(false)
const rules = useRules()

const handleCancel = () => {
  router.push({ name: 'admhr.pengumuman.list' })
}

const handleConfirm = async () => {
  const response = route.params.id
    ? await store.apiPutUpdate(formData.value, route.params.id)
    : await store.apiPostAdd(formData.value)
  handleAlert(response.success, response.message, route.params.id)
}

const setCompany = async () => {
  const response = await store.apiGetCompany()
  selectCompany.value = response.data
}
const onCompanyChange = async (id) => {
  const { data } = await store.apiGetDepartement(id)
  selectDepartement.value = data
}
const onDeptChange = async (departement_id) => {
  const { data } = await store.apiGetPengguna(formfilter.value.company_id, departement_id)
  selectUser.value = data
}
const onUserChange = async (user_id) => {
  const { data } = await store.apiGetSchedule(
    formfilter.value.company_id,
    formfilter.value.departement_id,
    user_id,
  )
  console.log(data)

  selectSchedule.value = data
}
const setEdit = async () => {
  const response = await store.apiGetShow(route.params.id)
  formfilter.value = {
    company_id: response.data.user.company_id,
    departement_id: response.data.user.employee.departement_id,
  }
  onCompanyChange(response.data.user.company_id)
  onDeptChange(response.data.user.employee.departement_id)
  onUserChange(response.data.user_id)
  formData.value = {
    user_id: response.data.user_id,
    user_timework_schedule_id: response.data.user_timework_schedule_id,
    time_in: response.data.time_in,
    time_out: response.data.time_out,
    type_in: response.data.type_in,
    type_out: response.data.type_out,
    lat_in: response.data.lat_in,
    lat_out: response.data.lat_out,
    long_in: response.data.long_in,
    long_out: response.data.long_out,
    image_in: null,
    image_out: null,
    status_in: response.data.status_in,
    status_out: response.data.status_out,
  }
}

onMounted(() => {
  setCompany()
  if (route.params.id) {
    setEdit()
  }
})
</script>

<template>
  <v-card
    prepend-icon="mdi-information"
    title="Form data"
    text="Silahkan lengkapi form ini dengan benar!"
    class="border border-thin"
    elevation="0"
  >
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="3" :cols="12">
            <v-autocomplete
              v-model="formfilter.company_id"
              :items="selectCompany"
              item-title="name"
              item-value="id"
              label="Pilih Perusahaan"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              @update:modelValue="onCompanyChange"
              required
            />
          </v-col>
          <v-col md="3" :cols="12">
            <v-autocomplete
              v-model="formfilter.departement_id"
              :items="selectDepartement"
              item-title="name"
              item-value="id"
              label="Pilih Departement"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              @update:model-value="onDeptChange"
              required
            />
          </v-col>
          <v-col md="3" :cols="12">
            <v-autocomplete
              v-model="formData.user_id"
              :items="selectUser"
              item-title="name"
              item-value="id"
              label="Pilih User"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              @update:model-value="onUserChange"
              required
            />
          </v-col>
          <v-col md="3" :cols="12">
            <v-autocomplete
              v-model="formData.user_timework_schedule_id"
              :items="selectSchedule"
              item-title="work_day"
              item-value="id"
              label="Pilih Jadwal"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.time_work.name} | ${item.raw.time_work.in} - ${item.raw.time_work.out}`"
                  :subtitle="formatDay(item.raw.work_day)"
                />
              </template>
            </v-autocomplete>
          </v-col>
          <v-col md="3" :cols="12">
            <v-menu
              v-model="timeIn"
              :close-on-content-click="false"
              transition="scale-transition"
              max-width="290px"
              offset-y
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-bind="menuProps"
                  v-model="formData.time_in"
                  @update:model-value="(val) => (formData.time_in = formatTime(val))"
                  label="Jam Masuk"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  readonly
                  :rules="[rules.required, rules.timeFormat]"
                />
              </template>
              <v-time-picker
                v-model="formData.time_in"
                format="24hr"
                full-width
                @update:model-value="(val) => (formData.time_in = formatTime(val))"
              />
            </v-menu>
          </v-col>
          <v-col md="3" :cols="12">
            <v-menu
              v-model="timeOut"
              :close-on-content-click="false"
              transition="scale-transition"
              max-width="290px"
              offset-y
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-bind="menuProps"
                  v-model="formData.time_out"
                  @update:model-value="(val) => (formData.time_out = formatTime(val))"
                  label="Jam Pulang"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  readonly
                  :rules="[rules.required, rules.timeFormat]"
                />
              </template>
              <v-time-picker
                v-model="formData.time_out"
                format="24hr"
                full-width
                @update:model-value="(val) => (formData.time_out = formatTime(val))"
              />
            </v-menu>
          </v-col>
          <v-col md="3" :cols="12">
            <v-radio-group v-model="formData.status_in" inline>
              <template v-slot:label>
                <div>Pilih status <strong>jam masuk</strong></div>
              </template>
              <v-radio value="late" label="Terlambat"></v-radio>
              <v-radio value="unlate" label="Tidak Terlambat"></v-radio>
              <v-radio value="normal" label="Normal"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col md="3" :cols="12">
            <v-radio-group v-model="formData.status_out" inline>
              <template v-slot:label>
                <div>Pilih status <strong>jam pulang</strong></div>
              </template>
              <v-radio value="late" label="Terlambat"></v-radio>
              <v-radio value="unlate" label="Tidak Terlambat"></v-radio>
              <v-radio value="normal" label="Normal"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col md="6" :cols="12">
            <v-radio-group v-model="formData.type_in" inline>
              <template v-slot:label>
                <div>Pilih metode <strong>Absensi masuk</strong></div>
              </template>
              <v-radio value="qrcode" label="Kode QR"></v-radio>
              <v-radio value="face-device" label="Pendeteksi wajah"></v-radio>
              <v-radio value="face-geolocation" label="Kordinat lokasi"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col md="6" :cols="12">
            <v-radio-group v-model="formData.type_out" inline>
              <template v-slot:label>
                <div>Pilih metode <strong>Absensi pulang</strong></div>
              </template>
              <v-radio value="qrcode" label="Kode QR"></v-radio>
              <v-radio value="face-device" label="Pendeteksi wajah"></v-radio>
              <v-radio value="face-geolocation" label="Kordinat lokasi"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col md="3" :cols="12">
            <v-text-field
              v-model="formData.lat_in"
              label="Latitude jam masuk"
              placeholder="Masukkan kordinat latitude"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col md="3" :cols="12">
            <v-text-field
              v-model="formData.long_in"
              label="Longitude jam masuk"
              placeholder="Masukkan kordinat longitude"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col md="3" :cols="12">
            <v-text-field
              v-model="formData.lat_out"
              label="Latitude jam pulang"
              placeholder="Masukkan kordinat latitude"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col md="3" :cols="12">
            <v-text-field
              v-model="formData.long_out"
              label="Longitude jam pulang"
              placeholder="Masukkan kordinat longitude"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col md="6" :cols="12">
            <v-file-upload density="compact" v-model="formData.image_in"></v-file-upload>
          </v-col>
          <v-col md="6" :cols="12">
            <v-file-upload density="compact" v-model="formData.image_out"></v-file-upload>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-if="alertState.show">
        <v-alert
          v-model="alertState.show"
          :color="alertState.type"
          :title="alertState.title"
          density="compact"
          theme="dark"
          :icon="
            alertState.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-close-circle-multiple'
          "
          class="mb-5"
        >
          {{ alertState.message }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleCancel">Batalkan</v-btn>
        <v-btn color="primary" @click="handleConfirm">
          {{ route.params.id ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
