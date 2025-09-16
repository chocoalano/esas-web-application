<script setup>
import { useUserFormStore } from '@/stores/pengaturan/pengguna/form'; // Pastikan path ini benar
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

const route = useRoute();
const router = useRouter();
const userFormStore = useUserFormStore();
const toast = useToast();

// Referensi ke v-form untuk validasi
const formRef = ref(null);

// State untuk mode edit
const isEditMode = ref(false);

// Teks tombol
const confirmText = ref('Simpan');
const cancelText = ref('Batal');

// Default rules for validation
const rules = {
  required: value => (value !== null && value !== undefined && value !== '') || 'Bidang ini wajib diisi.', // Perbaikan untuk null/undefined
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Email tidak valid.'
  },
  // Tambahkan rules lain jika diperlukan
};

// Data Form dari Pinia Store
// Gunakan `storeToRefs` untuk mempertahankan reaktivitas saat destructuring
import { storeToRefs } from 'pinia';
import { formatDateToYMD, useAppDebug, useAssetDefaultImg, useAssetDirectory, useAssetUrl } from '@/composables/useApp';
import { useToast } from 'vue-toast-notification';
const {
  formData,
  error,
  isLoading,
  selectItemCompany,
  selectItemDepartement,
  selectItemPosition, // Pastikan ini juga di-destructure
  selectItemLevel,    // Pastikan ini juga di-destructure
  selectItemLine,     // Pastikan ini juga di-destructure
  selectItemMngr      // Pastikan ini juga di-destructure
} = storeToRefs(userFormStore);


// Watcher untuk route.params.id
// Ini akan mendeteksi perubahan ID di URL dan memuat data yang sesuai
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEditMode.value = true;
    userFormStore.resetForm(); // Bersihkan form saat ID berubah
    userFormStore.fetchUserData(newId);
  } else {
    isEditMode.value = false;
    userFormStore.fetchUserDataCreate();
    userFormStore.resetForm(); // Bersihkan form jika tidak ada ID (mode tambah)
  }
}, { immediate: true });

// --- Handlers ---
const handleConfirm = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    const result = await userFormStore.submitForm(isEditMode.value, route.params.id);

    if (result.success) {
      toast.success('Data berhasil tersimpan')
      userFormStore.resetForm();
      router.push({ name: 'pengaturan.users.list' });
    } else {
      toast.error('Data gagal tersimpan')
    }
  } else {
    toast.error('Validasi gagal: Mohon lengkapi semua bidang yang wajib diisi.')
  }
};

const handleCancel = () => {
  userFormStore.resetForm(); // Reset form saat batal
  router.push({ name: 'pengaturan.users' }); // Kembali ke halaman sebelumnya atau daftar user
};

// Fungsi yang dipanggil saat date input berubah
// Vuetify 3's v-date-input (dari vuetify-date-picker) biasanya mengembalikan Date object atau string sesuai format
function onDateChangeDetail(value) {
  formData.value.details.datebirth = formatDateToYMD(value)
}
function onDateChangeEmpJoindate(value) {
  formData.value.employee.join_date = formatDateToYMD(value)
}
function onDateChangeEmpSigndate(value) {
  formData.value.employee.sign_date = formatDateToYMD(value)
}


// Fungsi untuk Autocomplete bersyarat
const onDepartemenChange = () => {
  userFormStore.onDepartemenChange(formData.value.company_id, formData.value.employee.departement_id);
};
const onPositionChange = () => {
  userFormStore.onPositionChange(formData.value.company_id, formData.value.employee.departement_id, formData.value.employee.job_position_id);
};
</script>

<template>
  <v-card prepend-icon="mdi-pencil" :title="route.params.id ? 'Pembaharuan Data' : 'Membuat Data Baru'"
    text="Lengkapi form ini dengan baik dan benar!" rounded="xl" class="border border-thin" elevation="0">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-row dense>
          <v-col md="6" cols="12">
            <v-sheet border rounded class="py-5 px-5">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-autocomplete v-model="formData.company_id" :items="selectItemCompany" item-title="name"
                    item-value="id" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan" variant="outlined"
                    density="compact" rounded="lg" :rules="[rules.required]" :error-messages="error.company_id"
                    :readonly="isEditMode" required />
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.nip" label="NIP" placeholder="input NIP disini" type="number"
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error.nip" :readonly="isEditMode" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.name" label="Nama" placeholder="input nama disini" type="text"
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error.name" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.email" label="Email" placeholder="input email disini" type="text"
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required, rules.email]"
                    :error-messages="error.email" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.password" label="Password" placeholder="input password disini"
                    type="password" variant="outlined" density="compact" rounded="lg"
                    :rules="isEditMode ? [] : [rules.required]" :error-messages="error.password" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn-toggle v-model="formData.status" divided color="primary" variant="outlined" density="compact"
                    rounded="lg" :rules="[rules.required]">
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
                    :src="formData.avatar ? `${assetUrl}/${formData.avatar}` : `${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"></v-img>
                </v-col>
                <v-col md="6" cols="12">
                  <v-file-input density="compact" rounded="lg" v-model="formData.avatar_file" label="Upload Avatar"
                    variant="outlined" :error-messages="error.avatar_file" accept="image/*" show-size counter />
                </v-col>
              </v-row>
            </v-sheet>
            <v-sheet border rounded class="py-5 px-5 mt-3">
              <v-row dense>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.salaries.basic_salary" label="Total gaji"
                    placeholder="input total gaji disini" type="number" variant="outlined" density="compact"
                    rounded="lg" :rules="[rules.required]" :error-messages="error['salaries.basic_salary']" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-btn-toggle v-model="formData.salaries.payment_type" color="primary" variant="outlined"
                    density="compact" rounded="lg" :rules="[rules.required]">
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
                    type="number" variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['details.phone']" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-text-field v-model="formData.details.placebirth" label="Tempat lahir"
                    placeholder="input tempat lahir disini" type="text" variant="outlined" density="compact"
                    rounded="lg" :rules="[rules.required]" :error-messages="error['details.placebirth']" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-date-input v-model="formData.details.datebirth" label="Tempat lahir"
                    placeholder="input tanggal lahir disini" variant="outlined" density="compact" rounded="lg"
                    prepend-icon="" prepend-inner-icon="$calendar" @update:model-value="onDateChangeDetail"
                    :rules="[rules.required]" :error-messages="error['details.datebirth']"></v-date-input>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.gender" inline :error-messages="error['details.gender']"
                    :rules="[rules.required]">
                    <template v-slot:label>
                      <div>Pilih <strong>jenis kelamin</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="m" label="Pria" />
                    <v-radio value="w" label="Wanita" />
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.blood" inline :error-messages="error['details.blood']"
                    :rules="[rules.required]">
                    <template v-slot:label>
                      <div>Pilih <strong>jenis golongan darah</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="a" label="Gol A" />
                    <v-radio value="b" label="Gol B" />
                    <v-radio value="o" label="Gol O" />
                    <v-radio value="ab" label="Gol AB" />
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.marital_status" inline
                    :error-messages="error['details.marital_status']" :rules="[rules.required]">
                    <template v-slot:label>
                      <div>Pilih <strong>status pernikahan</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="single" label="Lajang" />
                    <v-radio value="married" label="Sudah menikah" />
                    <v-radio value="widow" label="Janda" />
                    <v-radio value="widower" label="Duda" />
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-radio-group v-model="formData.details.religion" inline :error-messages="error['details.religion']"
                    :rules="[rules.required]">
                    <template v-slot:label>
                      <div>Pilih <strong>agama</strong> anda dibawah ini:</div>
                    </template>
                    <v-radio value="islam" label="Islam" />
                    <v-radio value="protestan" label="Protestan" />
                    <v-radio value="khatolik" label="Katolik" />
                    <v-radio value="hindu" label="Hindu" />
                    <v-radio value="buddha" label="Buddha" />
                    <v-radio value="khonghucu" label="Khonghucu" />
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
                    density="compact" rounded="lg" :error-messages="error['address.identity_type']"
                    :rules="[rules.required]">
                    <v-btn value="ktp">E-KTP</v-btn>
                    <v-btn value="passport">Passport</v-btn>
                    <v-btn value="sim">SIM</v-btn>
                  </v-btn-toggle>
                  <div v-if="error['address.identity_type']" class="text-error text-body-small mt-1">
                    {{ error['address.identity_type'] }}
                  </div>
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.address.identity_numbers" label="Nomor Identitas"
                    placeholder="input nomor identitas disini" type="number" variant="outlined" density="compact"
                    rounded="lg" :rules="[rules.required]" :error-messages="error['address.identity_numbers']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.address.province" label="Provinsi" placeholder="input provinsi disini"
                    type="text" variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['address.province']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.address.city" label="Kota" placeholder="input kota disini" type="text"
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['address.city']" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-textarea v-model="formData.address.citizen_address" label="Alamat tinggal identitas"
                    row-height="20" rows="2" auto-grow variant="outlined" :rules="[rules.required]"
                    :error-messages="error['address.citizen_address']" />
                </v-col>
                <v-col md="6" cols="12">
                  <v-textarea v-model="formData.address.residential_address" label="Alamat tinggal saat ini"
                    row-height="20" rows="2" auto-grow variant="outlined" :rules="[rules.required]"
                    :error-messages="error['address.residential_address']" />
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
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['employee.departement_id']" required
                    @update:model-value="onDepartemenChange" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.job_position_id" :items="selectItemPosition"
                    item-title="name" item-value="id" label="Nama posisi" placeholder="Masukkan nama posisi"
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['employee.job_position_id']" required
                    @update:model-value="onPositionChange" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.job_level_id" :items="selectItemLevel" item-title="name"
                    item-value="id" label="Pilih level" placeholder="Masukkan nama level" variant="outlined"
                    density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['employee.job_level_id']" required />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.approval_line_id" :items="selectItemLine" item-title="name"
                    item-value="id" label="Pilih user atasan" placeholder="Pilih user atasan" variant="outlined"
                    density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['employee.approval_line_id']" required />
                </v-col>
                <v-col md="3" cols="12">
                  <v-autocomplete v-model="formData.employee.approval_manager_id" :items="selectItemMngr"
                    item-title="name" item-value="id" label="Pilih user manager" placeholder="Pilih user manager"
                    variant="outlined" density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['employee.approval_manager_id']" required />
                </v-col>
                <v-col md="3" cols="12">
                  <v-date-input v-model="formData.employee.join_date" v-on:update:model-value="onDateChangeEmpJoindate"
                    label="Tgl. Bergabung" placeholder="input tgl. bergabung disini" variant="outlined"
                    density="compact" rounded="lg" prepend-inner-icon="mdi-calendar"
                    @focus="showDatePickerJoinDate = true" :rules="[rules.required]"
                    :error-messages="error['employee.join_date']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-date-input v-model="formData.employee.sign_date" v-on:update:model-value="onDateChangeEmpSigndate"
                    label="Tgl. Masuk" placeholder="input tgl. masuk disini" variant="outlined" density="compact"
                    rounded="lg" prepend-inner-icon="mdi-calendar" @focus="showDatePickerSignDate = true"
                    :rules="[rules.required]" :error-messages="error['employee.sign_date']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.employee.bank_name" label="Nama Bank"
                    placeholder="input nama bank disini" type="text" variant="outlined" density="compact" rounded="lg"
                    :rules="[rules.required]" :error-messages="error['employee.bank_name']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.employee.bank_number" label="Nomor Bank/Rekening"
                    placeholder="input nomor bank/rekening disini" type="number" variant="outlined" density="compact"
                    rounded="lg" :rules="[rules.required]" :error-messages="error['employee.bank_number']" />
                </v-col>
                <v-col md="3" cols="12">
                  <v-text-field v-model="formData.employee.bank_holder" label="Nama pemilik bank/rekening"
                    placeholder="input nama pemilik bank/rekening disini" type="text" variant="outlined"
                    density="compact" rounded="lg" :rules="[rules.required]"
                    :error-messages="error['employee.bank_holder']" />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleCancel" :disabled="isLoading">
          {{ cancelText }}
        </v-btn>
        <v-btn color="primary" type="submit" :loading="isLoading">
          {{ isEditMode ? 'Perbarui' : confirmText }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
