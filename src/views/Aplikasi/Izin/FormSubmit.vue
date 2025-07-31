<script setup>
import { ref } from 'vue'
import { useForm } from './useForm'
import dayjs from 'dayjs'
import { useAppDebug, useAssetDefaultImg, useAssetDirectory, useAssetUrl } from '@/composables/useApp'

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

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
} = useForm()

// Modal time pickers
const modal_time1 = ref(false)
const modal_time2 = ref(false)
const modal_time3 = ref(false)
const modal_time4 = ref(false)

// Change Handlers (opsional bisa ditambahkan logika lebih lanjut)
function onCompanyChange() {
  store.CREATE_DATA_ACTION()
}
function onDepartementChange() {
  store.CREATE_DATA_ACTION()
}
function onUserChange() {
  store.CREATE_DATA_ACTION()
}
function onPermitChange() {
  store.CREATE_DATA_ACTION()
}
function onDateChangeStart(value) {
  formData.start_date = value
}
function onDateChangeEnd(value) {
  formData.end_date = value
}
const selectScheduleProps = (item) => {
  return {
    title: dayjs(item?.work_day).format('DD/MM/YYYY'),
    subtitle: `${item?.timework?.name}|${item?.timework?.in}-${item?.timework?.out}`,
  }
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
              :rules="[rules.required]" @update:modelValue="onCompanyChange" required
              :error-messages="store.company_id"></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.departement_id" :items="store.departemenOptions" item-title="name"
              item-value="id" label="Pilih Departement" variant="outlined" density="compact" rounded="lg"
              :rules="[rules.required]" @update:modelValue="onDepartementChange" required
              :error-messages="store.departement_id"></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.user_id" :items="store.userOptions" item-title="name" item-value="id"
              label="Pilih User" variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
              @update:modelValue="onUserChange" required :error-messages="store.user_id"></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.permit_type_id" :items="store.permitOptions" item-title="type"
              item-value="id" label="Pilih Jenis Izin" variant="outlined" density="compact" rounded="lg"
              @update:modelValue="onPermitChange" :rules="[rules.required]" required
              :error-messages="store.permit_type_id"></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-autocomplete v-model="formData.user_timework_schedule_id" :items="store.scheduleOptions"
              :item-props="selectScheduleProps" item-title="name" item-value="id" label="Pilih Jadwal"
              variant="outlined" density="compact" rounded="lg" :rules="[rules.required]" required
              :error-messages="store.user_timework_schedule_id"></v-autocomplete>
          </v-col>
          <v-col md="4" :cols="12">
            <v-text-field v-model="formData.permit_numbers" label="Izin Numbers" placeholder="Nomor izin otomatis"
              variant="outlined" density="compact" rounded="lg" :rules="[rules.required]" required disabled />
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-date-input v-model="formData.start_date" v-on:update:model-value="onDateChangeStart"
              label="Pilih tanggal mulai" clearable variant="outlined" prepend-icon="" prepend-inner-icon="mdi-calendar"
              density="compact" rounded="lg" :error-messages="store.start_date" />
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-date-input v-model="formData.end_date" v-on:update:model-value="onDateChangeEnd"
              label="Pilih tanggal selesai" clearable variant="outlined" prepend-icon=""
              prepend-inner-icon="mdi-calendar" density="compact" rounded="lg" :error-messages="store.end_date" />
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-text-field v-model="formData.start_time" :active="modal_time1" :focused="modal_time1"
              label="Pilih jam mulai" variant="outlined" prepend-inner-icon="mdi-clock-time-four-outline" readonly
              density="compact" rounded="lg" :error-messages="store.start_time">
              <v-dialog v-model="modal_time1" activator="parent" width="auto">
                <v-time-picker v-if="modal_time1" v-model="formData.start_time" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id !== 15">
            <v-text-field v-model="formData.end_time" :active="modal_time2" :focused="modal_time2"
              label="Pilih jam selesai" prepend-inner-icon="mdi-clock-time-four-outline" variant="outlined" readonly
              density="compact" rounded="lg" :error-messages="store.end_time">
              <v-dialog v-model="modal_time2" activator="parent" width="auto">
                <v-time-picker v-if="modal_time2" v-model="formData.end_time" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 15">
            <v-text-field v-model="formData.timein_adjust" :active="modal_time3" :focused="modal_time3"
              label="Pilih perubahan jam masuk" prepend-inner-icon="mdi-clock-time-four-outline" variant="outlined"
              readonly density="compact" rounded="lg" :error-messages="store.timein_adjust">
              <v-dialog v-model="modal_time3" activator="parent" width="auto">
                <v-time-picker v-if="modal_time3" v-model="formData.timein_adjust" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 15">
            <v-text-field v-model="formData.timeout_adjust" :active="modal_time4" :focused="modal_time4"
              label="Pilih perubahan jam pulang" prepend-inner-icon="mdi-clock-time-four-outline" variant="outlined"
              readonly density="compact" rounded="lg" :error-messages="store.timeout_adjust">
              <v-dialog v-model="modal_time4" activator="parent" width="auto">
                <v-time-picker v-if="modal_time4" v-model="formData.timeout_adjust" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 16">
            <v-select v-model="formData.current_shift_id" :items="selectTimework" density="compact" rounded="lg"
              label="Pilih shift berjalan sekarang" variant="outlined" item-title="name" item-value="id"
              :error-messages="store.current_shift_id">
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  {{ item.raw.name }} | {{ item.raw.in }} - {{ item.raw.out }}
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col md="4" :cols="12" v-if="formData.permittype_id === 16">
            <v-select v-model="formData.adjust_shift_id" :items="selectTimework" density="compact" rounded="lg"
              label="Pilih shift yang ingin diajukan" variant="outlined" item-value="id" item-title="name"
              :error-messages="store.adjust_shift_id">
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  {{ item.raw.name }} | {{ item.raw.in }} - {{ item.raw.out }}
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col md="12" :cols="12">
            <v-textarea v-model="formData.notes" label="Keterangan" variant="outlined" :error-messages="store.notes">
            </v-textarea>
          </v-col>
          <v-col md="12" :cols="12">
            <v-file-upload v-model="formData.file" density="compact" rounded="lg"
              :error-messages="store.file"></v-file-upload>
          </v-col>
          <v-col md="6">
            <v-img :width="120" aspect-ratio="1" cover
              :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
              :src="formData.filename ? `${assetUrl}/${formData.filename}` : `${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"></v-img>
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
