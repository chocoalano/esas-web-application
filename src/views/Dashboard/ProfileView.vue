<script setup>
import {
  useAppDebug,
  useAssetUrl,
  useAssetDirectory,
  useAssetDefaultImg,
} from '@/composables/useApp'
import useRules from '@/plugins/validator'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'

const store = useAuthStore()
const rules = useRules()

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

const formRef = ref()

const selectItemCompany = ref([])
const selectItemDepartement = ref([])
const selectItemPosition = ref([])
const selectItemLevel = ref([])
const selectItemLine = ref([])
const selectItemMngr = ref([])

const formData = ref({
  company_id: '',
  name: '',
  nip: '',
  email: '',
  password: '',
  email_verified_at: '',
  avatar: '',
  avatar_file: null,
  status: '',
  details: {
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
})

onMounted(async () => {
  const res = await store.getProfile()
  formData.value = res

  getKelengkapanForm()
})

const getKelengkapanForm = async () => {
  try {
    const [company, departement, position, level, user] = await Promise.all([
      store.apiGetCompany(),
      store.apiGetDepartement(formData.value.company_id),
      store.apiGetPosition(formData.value.company_id, formData.value.departement_id),
      store.apiGetLevel(formData.value.company_id, formData.value.departement_id),
      store.apiGetUser(formData.value.company_id, formData.value.departement_id),
    ])
    selectItemCompany.value = company.data
    selectItemDepartement.value = departement.data
    selectItemPosition.value = position.data
    selectItemLevel.value = level.data
    selectItemLine.value = user.data
    selectItemMngr.value = user.data
  } catch (error) {
    console.error('Gagal memuat data:', error)
  }
}

const handleSubmit = async () => {
  const res = await store.postProfile(formData.value)
  console.log(res)
}
</script>

<template>
  <v-card
    class="mx-auto border border-thin"
    prepend-icon="mdi-account"
    title="Form profil"
    text="Silahkan lengkapi form profil ini dengan baik dan benar!"
    elevation="0"
  >
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-card-text>
        <v-row dense>
          <v-col md="6" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="6" cols="12">
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
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.nip"
                    label="NIP"
                    placeholder="input NIP disini"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.name"
                    label="Nama"
                    placeholder="input nama disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.email"
                    label="Email"
                    placeholder="input email disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.password"
                    label="Password"
                    placeholder="input password disini"
                    type="password"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn-toggle
                    v-model="formData.status"
                    divided
                    color="primary"
                    variant="outlined"
                    density="compact"
                  >
                    <v-btn value="active">Aktif</v-btn>
                    <v-btn value="inactive">Tidak Aktif</v-btn>
                    <v-btn value="resign">Berhenti</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col md="6" cols="12">
                  <v-img
                    :width="120"
                    aspect-ratio="1"
                    cover
                    :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                    :src="`${assetUrl}/${formData.avatar}`"
                  ></v-img>
                </v-col>
                <v-col md="6" cols="12">
                  <v-file-upload density="compact" v-model="formData.avatar_file"></v-file-upload>
                </v-col>
              </v-row>
            </v-sheet>
            <v-sheet border rounded class="py-5 px-5 mt-3">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.salaries.basic_salary"
                    label="Total gaji"
                    placeholder="input total gaji disini"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn-toggle
                    v-model="formData.salaries.payment_type"
                    color="primary"
                    variant="outlined"
                    density="compact"
                  >
                    <v-btn value="Monthly">Bulanan</v-btn>
                    <v-btn value="Weekly">Mingguan</v-btn>
                    <v-btn value="Daily">Harian</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col md="6" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.details.phone"
                    label="HP/Telp"
                    placeholder="input HP/Telp disini"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field
                    v-model="formData.details.placebirth"
                    label="Tempat lahir"
                    placeholder="input tempat lahir disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-date-input
                    v-model="formData.details.datebirth"
                    label="Tempat lahir"
                    placeholder="input tanggal lahir disini"
                    variant="outlined"
                    density="compact"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    :rules="[rules.required]"
                  ></v-date-input>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.gender" inline>
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
                  <v-radio-group v-model="formData.details.blood" inline>
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
                  <v-radio-group v-model="formData.details.marital_status" inline>
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
                  <v-radio-group v-model="formData.details.religion" inline>
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
                  <v-btn-toggle
                    v-model="formData.address.identity_type"
                    color="primary"
                    variant="outlined"
                    density="compact"
                  >
                    <v-btn value="ktp">E-KTP</v-btn>
                    <v-btn value="passport">Passport</v-btn>
                    <v-btn value="sim">SIM</v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field
                    v-model="formData.address.identity_numbers"
                    label="Nomer Identitas"
                    placeholder="input nomor identitas disini"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field
                    v-model="formData.address.province"
                    label="Provinsi"
                    placeholder="input provinsi disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field
                    v-model="formData.address.city"
                    label="Kota"
                    placeholder="input kota disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <v-textarea
                    v-model="formData.address.citizen_address"
                    label="Alamat tinggal identitas"
                    row-height="20"
                    rows="2"
                    auto-grow
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-textarea>
                </v-col>
                <v-col md="6" cols="12">
                  <v-textarea
                    v-model="formData.address.residential_address"
                    label="Alamat tinggal saat ini"
                    row-height="20"
                    rows="2"
                    auto-grow
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col md="12" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="3" cols="12">
                  <v-autocomplete
                    v-model="formData.employee.departement_id"
                    :items="selectItemDepartement"
                    item-title="name"
                    item-value="id"
                    label="Nama departemen"
                    placeholder="Masukkan nama departemen"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete
                    v-model="formData.employee.job_position_id"
                    :items="selectItemPosition"
                    item-title="name"
                    item-value="id"
                    label="Nama posisi"
                    placeholder="Masukkan nama posisi"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete
                    v-model="formData.employee.job_level_id"
                    :items="selectItemLevel"
                    item-title="name"
                    item-value="id"
                    label="Nama level"
                    placeholder="Masukkan nama level"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete
                    v-model="formData.employee.approval_line_id"
                    :items="selectItemLine"
                    item-title="name"
                    item-value="id"
                    label="Approval atasan"
                    placeholder="Masukkan nama user"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete
                    v-model="formData.employee.approval_manager_id"
                    :items="selectItemMngr"
                    item-title="name"
                    item-value="id"
                    label="Approval manager"
                    placeholder="Masukkan nama user"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col md="3" cols="12">
                  <v-date-input
                    v-model="formData.employee.join_date"
                    label="Tgl. Bergabung"
                    placeholder="input tgl. bergabung disini"
                    variant="outlined"
                    density="compact"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    :rules="[rules.required]"
                  ></v-date-input>
                </v-col>
                <v-col md="3" cols="12">
                  <v-date-input
                    v-model="formData.employee.sign_date"
                    label="Tgl. Masuk"
                    placeholder="input tgl. masuk disini"
                    variant="outlined"
                    density="compact"
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    :rules="[rules.required]"
                  ></v-date-input>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field
                    v-model="formData.employee.bank_name"
                    label="Nama Bank"
                    placeholder="input nama bank disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field
                    v-model="formData.employee.bank_number"
                    label="Nomor Bank/Rekening"
                    placeholder="input nomor bank/rekening disini"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field
                    v-model="formData.employee.bank_holder"
                    label="Nama pemilik bank/rekening"
                    placeholder="input nama pemilik bank/rekening disini"
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit"> Perbarui </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
