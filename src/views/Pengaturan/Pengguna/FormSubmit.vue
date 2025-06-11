<script setup>
import {
  useAppDebug,
  useAssetUrl,
  useAssetDirectory,
  useAssetDefaultImg,
  formatDateToYMD,
} from '@/composables/useApp'
import { useForm } from './useForm'
import { usePengguna } from './usePengguna'

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

const {
  formState,
  onDepartemenChange,
  onPositionChange,
} = usePengguna()

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
  selectItemLine: {
    type: Array,
    default: () => [],
  },

  selectItemMngr: {
    type: Array,
    default: () => [],
  },
  id: {
    type: Number,
    default: null,
  },
  error: {
    type: Object,
    default: () => { },
  },
  data: {
    type: Object,
    default: () => ({
      company_id: '',
      name: '',
      nip: '',
      email: '',
      email_verified_at: '',
      avatar: '',
      status: '',
      detail: {
        phone: '',
        placebirth: '',
        datebirth: '',
        gender: '',
        blood: '',
        marital_status: '',
        religion: '',
      },
      address: {
        identity_type: '',
        identity_numbers: '',
        province: '',
        city: '',
        citizen_address: '',
        residential_address: '',
      },
      employee: {
        departement_id: '',
        job_position_id: '',
        job_level_id: '',
        approval_line_id: '',
        approval_manager_id: '',
        join_date: '',
        sign_date: '',
        bank_name: '',
        bank_number: '',
        bank_holder: '',
      },
      salaries: {
        basic_salary: null,
        payment_type: null,
      },
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

function onDateChangeDetail(value) {
  formData.value.details.datebirth = formatDateToYMD(value)
}
function onDateChangeEmpJoindate(value) {
  formData.value.employee.join_date = formatDateToYMD(value)
}
function onDateChangeEmpSigndate(value) {
  formData.value.employee.sign_date = formatDateToYMD(value)
}


const emit = defineEmits(['cancel', 'confirm'])
const { formRef, formData, isEditMode, handleCancel, handleConfirm, rules } = useForm(props, emit)
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <!-- {{ error.status }} -->
      <v-card-text>
        <v-row dense>
          <v-col md="6" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-autocomplete v-model="formData.company_id" :items="selectItemCompany" item-title="name"
                    item-value="id" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan" variant="outlined"
                    density="compact" :rules="[rules.required]" required :error-messages="error.company_id"
                    :readonly="props.id ? true : false" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.nip" label="NIP" placeholder="input NIP disini" type="number"
                    variant="outlined" density="compact" :rules="[rules.required]" :error-messages="error.nip"
                    :readonly="props.id ? true : false"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.name" label="Nama" placeholder="input nama disini" type="text"
                    variant="outlined" density="compact" :rules="[rules.required]" :error-messages="error.name"
                    :readonly="props.id ? true : false"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.email" label="Email" placeholder="input email disini" type="text"
                    variant="outlined" density="compact" :rules="[rules.required]" :error-messages="error.email"
                    :readonly="props.id ? true : false"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.password" label="Password" placeholder="input password disini"
                    type="password" variant="outlined" density="compact" :rules="[rules.required]"
                    :error-messages="error.password" :readonly="props.id ? true : false"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn-toggle v-model="formData.status" divided color="primary" variant="outlined" density="compact">
                    <v-btn value="active">Aktif</v-btn>
                    <v-btn value="inactive">Tidak Aktif</v-btn>
                    <v-btn value="resign">Berhenti</v-btn>
                  </v-btn-toggle>
                  <div v-if="error.status" class="text-error text-body-small mt-1">
                    {{ error.status }}
                  </div>
                </v-col>
                <v-col md="6" cols="12">
                  <v-img :width="120" aspect-ratio="1" cover
                    :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                    :src="`${assetUrl}/${formData.avatar}`"></v-img>
                </v-col>
                <v-col md="6" cols="12">
                  <v-file-upload density="compact" v-model="formData.avatar_file"></v-file-upload>
                </v-col>
              </v-row>
            </v-sheet>
            <v-sheet border rounded class="py-5 px-5 mt-3">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.salaries.basic_salary" label="Total gaji"
                    placeholder="input total gaji disini" type="number" variant="outlined" density="compact"
                    :rules="[rules.required]" :error-messages="error['salaries.basic_salary']"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn-toggle v-model="formData.salaries.payment_type" color="primary" variant="outlined"
                    density="compact">
                    <v-btn value="Monthly">Bulanan</v-btn>
                    <v-btn value="Weekly">Mingguan</v-btn>
                    <v-btn value="Daily">Harian</v-btn>
                  </v-btn-toggle>
                  <div v-if="error['salaries.payment_type']" class="text-error text-body-small mt-1">
                    {{ error['salaries.payment_type'] }}
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col md="6" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.details.phone" label="HP/Telp" placeholder="input HP/Telp disini"
                    type="number" variant="outlined" density="compact" :rules="[rules.required]"
                    :error-messages="error['details.phone']"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.details.placebirth" label="Tempat lahir"
                    placeholder="input tempat lahir disini" type="text" variant="outlined" density="compact"
                    :rules="[rules.required]" :error-messages="error['details.placebirth']"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-date-input v-model="formData.details.datebirth" label="Tempat lahir"
                    placeholder="input tanggal lahir disini" variant="outlined" density="compact" prepend-icon=""
                    prepend-inner-icon="$calendar" @update:model-value="onDateChangeDetail" :rules="[rules.required]"
                    :error-messages="error['details.datebirth']"></v-date-input>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.gender" inline :error-messages="error['details.gender']">
                    <template v-slot:label>
                      <div>Pilih <strong>jenis kelamin</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="m">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">Pria</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="w">
                      <template v-slot:label>
                        <div>Saya <strong class="text-primary">Wanita</strong></div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.blood" inline :error-messages="error['details.blood']">
                    <template v-slot:label>
                      <div>Pilih <strong>jenis golongan darah</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="a">
                      <template v-slot:label>
                        <div>Gol <strong class="text-success">A</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="b">
                      <template v-slot:label>
                        <div>Gol <strong class="text-primary">B</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="o">
                      <template v-slot:label>
                        <div>Gol <strong class="text-info">O</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="ab">
                      <template v-slot:label>
                        <div>Gol <strong class="text-error">AB</strong></div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.marital_status" inline
                    :error-messages="error['details.marital_status']">
                    <template v-slot:label>
                      <div>Pilih <strong>status pernikahan</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="single">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">lajang</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="married">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">sudah menikah</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="widow">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">janda</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="widower">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">duda</strong></div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.religion" inline :error-messages="error['details.religion']">
                    <template v-slot:label>
                      <div>Pilih <strong>agama</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="islam">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">islam</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="protestan">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">protestan</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="khatolik">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">khatolik</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="hindu">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">hindu</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="buddha">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">buddha</strong></div>
                      </template>
                    </v-radio>
                    <v-radio value="khonghucu">
                      <template v-slot:label>
                        <div>Saya <strong class="text-success">khonghucu</strong></div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col md="12" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="3" cols="12">
                  <v-btn-toggle v-model="formData.address.identity_type" color="primary" variant="outlined"
                    density="compact" :error-messages="error['address.identity_type']">
                    <v-btn value="ktp">E-KTP</v-btn>
                    <v-btn value="passport">Passport</v-btn>
                    <v-btn value="sim">SIM</v-btn>
                  </v-btn-toggle>
                  <div v-if="error['address.identity_type']" class="text-error text-body-small mt-1">
                    {{ error['address.identity_type'] }}
                  </div>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.address.identity_numbers" label="Nomer Identitas"
                    placeholder="input nomor identitas disini" type="number" variant="outlined" density="compact"
                    :rules="[rules.required]" :error-messages="error['address.identity_numbers']"></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.address.province" label="Provinsi" placeholder="input provinsi disini"
                    type="text" variant="outlined" density="compact" :rules="[rules.required]"
                    :error-messages="error['address.province']"></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.address.city" label="Kota" placeholder="input kota disini" type="text"
                    variant="outlined" density="compact" :rules="[rules.required]"
                    :error-messages="error['address.city']"></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-textarea v-model="formData.address.citizen_address" label="Alamat tinggal identitas"
                    row-height="20" rows="2" auto-grow variant="outlined" :rules="[rules.required]"
                    :error-messages="error['address.citizen_address']"></v-textarea>
                </v-col>
                <v-col md="6" cols="12">
                  <v-textarea v-model="formData.address.residential_address" label="Alamat tinggal saat ini"
                    row-height="20" rows="2" auto-grow variant="outlined" :rules="[rules.required]"
                    :error-messages="error['address.residential_address']"></v-textarea>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col md="12" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.departement_id" :items="selectItemDepartement"
                    item-title="name" item-value="id" label="Nama departemen" placeholder="Masukkan nama departemen"
                    variant="outlined" density="compact" :rules="[rules.required]" required
                    @update:model-value="onDepartemenChange(formData.company_id, formData.employee.departement_id)"
                    :error-messages="error['employee.departement_id']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.job_position_id" :items="formState.selectItemPosition"
                    item-title="name" item-value="id" label="Nama posisi" placeholder="Masukkan nama posisi"
                    variant="outlined" density="compact" :rules="[rules.required]" required
                    @update:model-value="onPositionChange(formData.company_id, formData.employee.departement_id)"
                    :error-messages="error['employee.job_position_id']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.job_level_id" :items="formState.selectItemLevel"
                    item-title="name" item-value="id" label="Pilih level" placeholder="Masukkan nama level"
                    variant="outlined" density="compact" :rules="[rules.required]" required
                    :error-messages="error['employee.job_level_id']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.approval_line_id" :items="selectItemLine" item-title="name"
                    item-value="id" label="Pilih user atasan" placeholder="PIlih user atasan" variant="outlined"
                    density="compact" :rules="[rules.required]" required
                    :error-messages="error['employee.approval_line_id']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.approval_manager_id" :items="selectItemMngr"
                    item-title="name" item-value="id" label="Pilih user manager" placeholder="Pilih user manager"
                    variant="outlined" density="compact" :rules="[rules.required]" required
                    :error-messages="error['employee.approval_manager_id']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-date-input v-model="formData.employee.join_date" label="Tgl. Bergabung"
                    placeholder="input tgl. bergabung disini" variant="outlined" density="compact" prepend-icon=""
                    prepend-inner-icon="$calendar" @update:model-value="onDateChangeEmpJoindate"
                    :rules="[rules.required]" :error-messages="error['employee.join_date']"></v-date-input>
                </v-col>
                <v-col md="3" cols="12">
                  <v-date-input v-model="formData.employee.sign_date" label="Tgl. Masuk"
                    placeholder="input tgl. masuk disini" variant="outlined" density="compact" prepend-icon=""
                    prepend-inner-icon="$calendar" @update:model-value="onDateChangeEmpSigndate"
                    :rules="[rules.required]" :error-messages="error['employee.sign_date']"></v-date-input>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.employee.bank_name" label="Nama Bank"
                    placeholder="input nama bank disini" type="text" variant="outlined" density="compact"
                    :rules="[rules.required]" :error-messages="error['employee.bank_name']"></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.employee.bank_number" label="Nomor Bank/Rekening"
                    placeholder="input nomor bank/rekening disini" type="number" variant="outlined" density="compact"
                    :rules="[rules.required]" :error-messages="error['employee.bank_number']"></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.employee.bank_holder" label="Nama pemilik bank/rekening"
                    placeholder="input nama pemilik bank/rekening disini" type="text" variant="outlined"
                    density="compact" :rules="[rules.required]"
                    :error-messages="error['employee.bank_holder']"></v-text-field>
                </v-col>
              </v-row>
            </v-sheet>
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
