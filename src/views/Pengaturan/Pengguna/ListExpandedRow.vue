<script setup>
import { computed } from 'vue';
import { useAppDebug, useAssetDefaultImg, useAssetDirectory, useAssetUrl } from '@/composables/useApp';
import moment from 'moment';

// --- Props ---
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
});

// --- Composables ---
const appDebug = useAppDebug();
const assetUrl = useAssetUrl();
const assetDirectory = useAssetDirectory();
const assetDefaultImg = useAssetDefaultImg();

// --- Computed Properties ---
// Menangani tampilan jenis kelamin
const displayGender = computed(() => {
  return props.item.details?.gender === 'm' ? 'Laki-laki' : (props.item.details?.gender === 'f' ? 'Perempuan' : '-');
});

// Menangani URL gambar profil
const photoProfileSrc = computed(() => {
  const photoPath = props.item.details?.photo_profile;
  if (photoPath) {
    return `${assetUrl}/${photoPath}`;
  }
  return `${assetUrl}/${assetDirectory}/${appDebug.value ? 'deployment' : 'production'}/${assetDefaultImg.value}`;
});

// Menangani URL lazy-load gambar profil
const photoProfileLazySrc = computed(() => {
  return `${assetUrl}/${assetDirectory}/${appDebug.value ? 'deployment' : 'production'}/${assetDefaultImg.value}`;
});
</script>

<template>
  <tr>
    <td :colspan="props.columns.length" class="py-2 px-4">
      <v-sheet rounded="lg" class="border border-thin pa-4"> <v-row dense>
          <v-col cols="12" md="4">
            <h3 class="text-subtitle-1 mb-2">Data Pengguna</h3>
            <v-list density="compact" class="bg-transparent">
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Nama:</span> {{ props.item.name || '-'
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">NIP:</span> {{ props.item.nip || '-'
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Email:</span> {{ props.item.email || '-'
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Status:</span> {{ props.item.status || '-'
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Device ID:</span> {{ props.item.device_id || '-'
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">No. Telepon/HP:</span> {{ props.item.details?.phone ||
                  '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Tempat, Tanggal Lahir:</span> {{
                  props.item.details?.placebirth }}, {{
                    moment(props.item.details?.datebirth).format('LL')
                  }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Jenis Kelamin:</span> {{ displayGender
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Golongan Darah:</span> {{ props.item.details?.blood ||
                  '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Agama:</span> {{ props.item.details?.religion || '-'
                  }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Tanggal Dibuat:</span> {{
                  moment(props.item.created_at).format('MMMM Do YYYY, h:mm:ss') }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Tanggal Diperbarui:</span> {{
                  moment(props.item.updated_at).format('MMMM Do YYYY, h:mm:ss') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="4">
            <h3 class="text-subtitle-1 mb-2">Data Karyawan</h3>
            <v-list density="compact" class="bg-transparent">
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Perusahaan:</span> {{ props.item.company?.name || '-'
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Departemen:</span> {{
                  props.item.employee?.departement?.name || '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Posisi:</span> {{
                  props.item.employee?.job_position?.name || '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Level:</span> {{ props.item.employee?.job_level?.name
                  || '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Tanggal Bergabung:</span> {{
                  props.item.employee?.join_date || '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Tanggal Masuk:</span> {{
                  props.item.employee?.sign_date || '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">Nama Bank:</span> {{ props.item.employee?.bank_name ||
                  '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">No. Rek. Bank:</span> {{
                  props.item.employee?.bank_number || '-' }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><span class="font-weight-bold">An. Bank:</span> {{ props.item.employee?.bank_holder
                  || '-' }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="4" class="text-center align-self-start">
            <h3 class="text-subtitle-1 mb-2">Foto Profil</h3>
            <v-avatar size="200" rounded="lg"> <v-img :src="photoProfileSrc" :lazy-src="photoProfileLazySrc"
                alt="Foto Profil Pengguna" cover></v-img>
            </v-avatar>
          </v-col>
        </v-row>
      </v-sheet>
    </td>
  </tr>
</template>

<style scoped>
.v-list-item-title {
  white-space: normal;
  /* Memastikan teks membungkus */
  line-height: 1.4;
  /* Sedikit spasi baris untuk keterbacaan */
}

/* Optional: Jika Anda ingin daftar detail terlihat seperti tabel klasik */
.v-list-item .v-list-item-title {
  display: flex;
  justify-content: space-between;
  /* Menjaga label dan nilai terpisah */
}

.v-list-item .v-list-item-title strong {
  flex-shrink: 0;
  /* Pastikan label tidak menciut */
  margin-right: 8px;
  /* Sedikit spasi setelah label */
}
</style>
