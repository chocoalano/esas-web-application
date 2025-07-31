<script setup>
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAppDebug, useAssetDefaultImg, useAssetDirectory, useAssetUrl } from '@/composables/useApp';
const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

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

// destructure supaya lebih clean
const { columns, item } = props;

// Helper function to determine status chip color
const getStatusColor = (status) => {
  if (!status) return 'grey'; // For null or undefined status
  switch (status.toLowerCase()) {
    case 'normal':
      return 'green';
    case 'late':
      return 'orange';
    case 'early':
      return 'blue';
    case 'absent':
      return 'red';
    case 'pending':
      return 'yellow-darken-2';
    default:
      return 'grey';
  }
};

// Helper function for location link (Google Maps)
const createGoogleMapsLink = (lat, lng) => {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return '#'; // Fallback for no coordinates
};
</script>

<template>
  <tr>
    <td :colspan="columns.length" class="py-2 px-4">
      <v-sheet rounded="lg" class="pa-4 bg-blue-grey-lighten-5">
        <h4 class="text-h6 mb-4 font-weight-black text-blue-grey-darken-3">
          Detail Absensi
          <span class="font-weight-regular text-body-1">
            ({{ dayjs(item.created_at).format('DD/MM/YYYY') }})
          </span>
        </h4>
        <v-row>
          <v-col md="4">
            <v-card class="mb-4" elevation="0" rounded="md">
              <v-card-title class="bg-blue-grey-darken-2 text-white text-subtitle-1 py-2">
                Informasi Karyawan
              </v-card-title>
              <v-card-text class="py-3">
                <v-list density="compact" class="py-0">
                  <v-list-item>
                    <v-list-item-title class="font-weight-medium">Nama:</v-list-item-title>
                    <v-list-item-subtitle>{{ item.user?.name || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="font-weight-medium">NIP:</v-list-item-title>
                    <v-list-item-subtitle>{{ item.user?.nip || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="font-weight-medium">Departemen:</v-list-item-title>
                    <v-list-item-subtitle>{{ item.user?.employee?.departement?.name || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="font-weight-medium">Perusahaan:</v-list-item-title>
                    <v-list-item-subtitle>{{ item.user?.company?.name || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="4">
            <v-card class="mb-4" elevation="0" rounded="md">
              <v-card-title class="bg-blue-grey-darken-2 text-white text-subtitle-1 py-2">
                Detail Absensi Masuk
              </v-card-title>
              <v-card-text class="py-3">
                <v-row no-gutters>
                  <v-col cols="12" md="6">
                    <v-list density="compact" class="py-0">
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Waktu Masuk:</v-list-item-title>
                        <v-list-item-subtitle>{{ item.time_in || 'N/A' }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Tipe Masuk:</v-list-item-title>
                        <v-list-item-subtitle>{{ item.type_in || 'N/A' }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Status Masuk:</v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip :color="getStatusColor(item.status_in)" label size="small">
                            {{ item.status_in || 'N/A' }}
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Lokasi Masuk:</v-list-item-title>
                        <v-list-item-subtitle>
                          <a :href="createGoogleMapsLink(item.lat_in, item.long_in)" target="_blank"
                            class="text-decoration-underline text-blue-darken-2">
                            ({{ item.lat_in || 'N/A' }}, {{ item.long_in || 'N/A' }})
                            <v-icon size="small" class="ml-1">mdi-map-marker</v-icon>
                          </a>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex justify-center align-center">
                    <v-img v-if="item.image_in"
                      :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                      :src="`${assetUrl}/${item.image_out}`" alt="Foto Masuk" max-height="200" max-width="200"
                      class="rounded-lg"></v-img>
                    <div v-else class="text-grey-lighten-1">Tidak ada foto masuk</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="4">
            <v-card elevation="0" rounded="md">
              <v-card-title class="bg-blue-grey-darken-2 text-white text-subtitle-1 py-2">
                Detail Absensi Keluar
              </v-card-title>
              <v-card-text class="py-3">
                <v-row no-gutters>
                  <v-col cols="12" md="6">
                    <v-list density="compact" class="py-0">
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Waktu Keluar:</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.time_out || 'N/A' }}
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Tipe Keluar:</v-list-item-title>
                        <v-list-item-subtitle>{{ item.type_out || 'N/A' }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Status Keluar:</v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip :color="getStatusColor(item.status_out)" label size="small">
                            {{ item.status_out || 'N/A' }}
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title class="font-weight-medium">Lokasi Keluar:</v-list-item-title>
                        <v-list-item-subtitle>
                          <a :href="createGoogleMapsLink(item.lat_out, item.long_out)" target="_blank"
                            class="text-decoration-underline text-blue-darken-2">
                            ({{ item.lat_out || 'N/A' }}, {{ item.long_out || 'N/A' }})
                            <v-icon size="small" class="ml-1">mdi-map-marker</v-icon>
                          </a>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex justify-center align-center">
                    <v-img v-if="item.image_out"
                      :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"
                      :src="`${assetUrl}/${item.image_out}`" alt="Foto Keluar" max-height="200" max-width="200"
                      class="rounded-lg"></v-img>
                    <div v-else class="text-grey-lighten-1">Belum ada foto keluar</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </td>
  </tr>
</template>

<style scoped>
/* Opsional: gaya khusus jika diperlukan */
</style>
