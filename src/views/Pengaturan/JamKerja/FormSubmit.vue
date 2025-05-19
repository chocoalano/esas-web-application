<script setup>
import useRules from '@/plugins/validator'
import { ref, watch, computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-map-marker',
  },
  selectItemCompany: {
    type: Array,
    default: () => [],
  },
  selectItemDepartement: {
    type: Array,
    default: () => [],
  },
  id: {
    type: Number,
    default: null,
  },
  data: {
    type: Object,
    default: () => ({
      company_id: null,
      departemen_id: null,
      name: null,
      in: null,
      out: null,
    }),
  },
  title: {
    type: String,
    default: 'Form default',
  },
  text: {
    type: String,
    default: 'Lengkapi data dengan benar.',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  confirmText: {
    type: String,
    default: 'Simpan',
  },
})

const emit = defineEmits(['cancel', 'confirm'])
const rules = useRules()

const formRef = ref(null)
const timeMenuIn = ref(false)
const timeMenuOut = ref(false)

const formData = ref({
  company_id: props.data.company_id,
  departemen_id: props.data.departemen_id,
  name: props.data.name,
  in: props.data.in,
  out: props.data.out,
})

const isEditMode = computed(() => !!props.id)

const handleCancel = () => {
  emit('cancel')
}

const formatTime = (time) => {
  if (!time) return null
  if (typeof time === 'string') return time.length === 5 ? `${time}:00` : time
  const date = new Date(time)
  return date.toTimeString().slice(0, 8)
}

const handleConfirm = async () => {
  if (!formRef.value) return
  const { valid, errors } = await formRef.value.validate()
  console.log('Valid?', valid, 'Errors:', errors)
  if (!valid) return
  if (formData.value.in >= formData.value.out) {
    alert('Jam masuk harus lebih awal dari jam pulang.')
    return
  }
  emit('confirm', { form: formData.value, id: props.id })
}

// Update formData dan waktu hanya saat props.data berubah (sekali), bukan terus menerus
watch(
  () => props.data,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { immediate: true },
)
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="4" cols="12">
            <v-autocomplete
              v-model="formData.company_id"
              :items="selectItemCompany"
              item-title="name"
              item-value="id"
              label="Nama Perusahaan"
              placeholder="Masukkan nama perusahaan"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>

          <v-col md="4" cols="12">
            <v-autocomplete
              v-model="formData.departemen_id"
              :items="selectItemDepartement"
              item-title="name"
              item-value="id"
              label="Nama Departemen"
              placeholder="Masukkan nama departemen"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              required
            />
          </v-col>

          <v-col md="4" cols="12">
            <v-text-field
              v-model="formData.name"
              label="Nama jam kerja"
              placeholder="Masukkan nama jam kerja"
              variant="outlined"
              density="compact"
              :rules="[rules.required, rules.minLength(3)]"
              required
            />
          </v-col>

          <v-col md="6" cols="12">
            <v-menu
              v-model="timeMenuIn"
              :close-on-content-click="false"
              transition="scale-transition"
              max-width="290px"
              offset-y
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-bind="menuProps"
                  v-model="formData.in"
                  @update:model-value="(val) => (formData.in = formatTime(val))"
                  label="Jam Masuk"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  readonly
                  :rules="[rules.required, rules.timeFormat]"
                />
              </template>
              <v-time-picker v-model="formData.in" format="24hr" full-width />
            </v-menu>
          </v-col>

          <v-col md="6" cols="12">
            <v-menu
              v-model="timeMenuOut"
              :close-on-content-click="false"
              transition="scale-transition"
              max-width="290px"
              offset-y
            >
              <template #activator="{ props: menuProps }">
                <v-text-field
                  v-bind="menuProps"
                  v-model="formData.out"
                  @update:model-value="(val) => (formData.out = formatTime(val))"
                  label="Jam Pulang"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  readonly
                  :rules="[rules.required, rules.timeFormat]"
                />
              </template>
              <v-time-picker v-model="formData.out" format="24hr" full-width />
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleCancel">
          {{ cancelText }}
        </v-btn>
        <v-btn color="primary" type="submit">
          {{ isEditMode ? 'Perbarui' : confirmText }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
