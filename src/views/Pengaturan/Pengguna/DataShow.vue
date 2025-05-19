<script setup>
import { ref, watch } from 'vue'
import userShow from './types/userShow'
import {
  useAppDebug,
  useAssetUrl,
  useAssetDirectory,
  useAssetDefaultImg,
} from '@/composables/useApp'

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()
// Props
const props = defineProps({
  icon: { type: String, default: 'mdi-map-marker' },
  data: {
    type: Object,
    default: () => userShow(),
  },
  title: { type: String, default: 'Informasi data' },
  text: { type: String, default: 'Lengkapi data dengan benar.' },
  cancelText: { type: String, default: 'Batal' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['cancel'])

// Reactive formData dari props
const formData = ref({ ...props.data })

// Watch props.data jika berubah
watch(
  () => props.data,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { deep: true },
)

// Emit saat tombol cancel ditekan
const handleCancel = () => emit('cancel')
const baseUrlAssets = import.meta.env.VITE_BASE_URL_ASSETS
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-card-text>
      <v-skeleton-loader v-if="loading" type="card" class="mb-4">
        <template #default>
          <v-list-item v-for="n in 5" :key="n">
            <v-skeleton-loader type="text" class="mx-4" />
          </v-list-item>
        </template>
      </v-skeleton-loader>

      <template v-else>
        <v-row>
          <v-col md="6" col="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>Nama Perusahaan</v-list-item-title>
                    <v-list-item-subtitle>
                      <template v-if="formData.company && formData.company.name">
                        {{ formData.company.name }}
                      </template>
                      <template v-else> - </template>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Nama pengguna</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.name }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>NIP pengguna</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.nip }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Email pengguna</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.email }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Status pengguna</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        :color="formData.status === 'active' ? 'success' : 'error'"
                        label
                        class="ma-2"
                        variant="outlined"
                      >
                        {{ formData.status }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col col="12" md="6">
                  <v-img
                    :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                    :src="`${baseUrlAssets}/${formData.avatar}`"
                    aspect-ratio="1"
                    max-width="300"
                    class="bg-grey-lighten-2 py-5"
                  />
                </v-col>
              </v-row>
            </v-sheet>
            <v-sheet border rounded class="py-5 px-5 mt-5">
              <v-row>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>Total gaji</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.salaries.basic_salary
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>Jenis pembayaran</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.salaries.payment_type
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col md="6" col="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>No. Telp/HP</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.details.phone }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Tempat & Tanggal Lahir</v-list-item-title>
                    <v-list-item-subtitle
                      >{{ formData.details.placebirth }},
                      {{ formData.details.datebirth }}</v-list-item-subtitle
                    >
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Jenis kelamin</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.details.gender === 'm' ? 'Laki-laki' : 'Perempuan'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>Golongan darah</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formData.details.blood?.toUpperCase() || '-' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Status pernikahan</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.details.marital_status === 'single'
                        ? 'Lajang'
                        : formData.details.marital_status === 'married'
                          ? 'Menikah'
                          : formData.details.marital_status === 'widow'
                            ? 'Janja'
                            : 'Duda'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>No. Telp/HP</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.details.religion?.toUpperCase() || '-'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-sheet>
            <v-sheet border rounded class="py-5 px-5 mt-5">
              <v-row>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>Jenis identitas</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.address.identity_type?.toUpperCase() || '-'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>No. Identitas</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.address.identity_numbers
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Provinsi</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.address.province }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col col="12" md="6">
                  <v-list-item>
                    <v-list-item-title>Kota</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formData.address.city }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Alamat identitas</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formData.address.citizen_address }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Alamat tinggal sekarang</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formData.address.residential_address }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col col="12">
            <v-sheet border rounded class="py-5 px-5 mt-5">
              <v-row>
                <v-col col="12" md="4">
                  <v-list-item>
                    <v-list-item-title>Departemen</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.departement?.name || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Approve line</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.approval_line?.name || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Tgl. Masuk</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.sign_date || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>No. Rekening</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.bank_number || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col col="12" md="4">
                  <v-list-item>
                    <v-list-item-title>Posisi</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.job_position?.name || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Approve Manager</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.approval_manager?.name || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Tgl. Resign</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.resign_date || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>ATM Atas Nama Pemilik</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.bank_holder || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col col="12" md="4">
                  <v-list-item>
                    <v-list-item-title>Level</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.job_level?.name || 'unknown'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Tgl. Bergabung</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.employee.join_date }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Nama Bank</v-list-item-title>
                    <v-list-item-subtitle>{{ formData.employee.bank_name }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Saldo cuti tahunan</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formData.employee.saldo_cuti ? formData.employee.saldo_cuti : 0
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCancel">{{ cancelText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
