<script setup>
import { computed } from 'vue';
import { useList } from './useList';
import { useAssetUrl } from '@/composables/useApp';
const assetUrl = useAssetUrl()
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

// Helper to check if a value is defined and not null/empty string
const isDefined = (value) => value !== null && value !== undefined && value !== '';

// Computed property to determine if there's any adjustment time to display
const hasTimeAdjustment = computed(() => {
  return isDefined(props.item.timein_adjust) || isDefined(props.item.timeout_adjust);
});

// Helper to get approval status text and icon/color
const getApprovalStatus = (user_approve) => {
  switch (user_approve) {
    case 'y':
      return { text: 'Disetujui', color: 'green-darken-4', icon: 'mdi-check-circle' };
    case 'n':
      return { text: 'Ditolak', color: 'red-darken-4', icon: 'mdi-close-circle' };
    default:
      return { text: 'Menunggu', color: 'yellow-darken-4', icon: 'mdi-help-circle' };
  }
};

const {
  form_approval_loading,
  form_approval,
  APPROVAL_ACTION,
} = useList()

const handleBtnApprove = (id, act) => {
  APPROVAL_ACTION(id, act)
}
</script>

<template>
  <!-- The outer table row and cell for expansion -->
  <tr>
    <td :colspan="props.columns.length" class="py-2 px-4">
      <!-- Main container for the expanded details -->
      <v-sheet rounded="lg" class="pa-1">
        <div>
          <v-textarea clear-icon="mdi-close-circle" label="Alasan" v-model="form_approval.notes" clearable></v-textarea>
          <v-row>
            <v-col>
              <v-btn :disabled="form_approval_loading" :loading="form_approval_loading" color="success" variant="flat"
                block @click="handleBtnApprove(item.id, 'y')">
                Setujui permohonan
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :disabled="form_approval_loading" :loading="form_approval_loading" color="error" variant="flat"
                block @click="handleBtnApprove(item.id, 'n')">
                Tolak permohonan
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="mb-5 mt-5"></v-divider>
        </div>
        <h4 class="text-h6 mb-4 font-weight-black">Detail Izin: {{ item.permit_numbers }}</h4>
        <v-row dense>
          <!-- User Details Card -->
          <v-col cols="12" md="4">
            <v-card rounded="lg" elevation="0" class="h-100 border border-thin bg-background">
              <v-card-title class="py-3">
                <v-icon start icon="mdi-account-circle"></v-icon>
                Detail Pengguna
              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="bg-background">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar :image="item.user?.avatar"
                        :color="item.user?.avatar ? undefined : 'blue-grey-lighten-4'">
                        <v-icon v-if="!item.user?.avatar" icon="mdi-account"></v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium text-wrap">{{ item.user?.name || 'N/A'
                    }}</v-list-item-title>
                    <v-list-item-subtitle>Nama Karyawan</v-list-item-subtitle>
                  </v-list-item>

                  <v-divider inset></v-divider>

                  <v-list-item>
                    <v-icon start icon="mdi-badge-account-outline"></v-icon>
                    <v-list-item-title>NIP: {{ item.user?.nip || 'N/A' }}</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <v-icon start icon="mdi-email"></v-icon>
                    <v-list-item-title>Email: {{ item.user?.email || 'N/A' }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Permit Information Card -->
          <v-col cols="12" md="4">
            <v-card rounded="lg" elevation="0" class="h-100 border border-thin bg-background">
              <v-card-title class="py-3">
                <v-icon start icon="mdi-information-outline"></v-icon>
                Informasi Izin
              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="bg-background">
                  <v-list-item>
                    <v-icon start icon="mdi-tag-text-outline"></v-icon>
                    <v-list-item-title>Jenis Izin: <span class="font-weight-medium">{{ item.permit_type?.type || 'N/A'
                    }}</span></v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <v-icon start icon="mdi-calendar-range"></v-icon>
                    <v-list-item-title>Mulai Tanggal: <span class="font-weight-medium">{{ item.start_date || 'N/A'
                    }}</span></v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <v-icon start icon="mdi-calendar-range"></v-icon>
                    <v-list-item-title>Sampai Tanggal: <span class="font-weight-medium">{{ item.end_date || 'N/A'
                    }}</span></v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <v-icon start icon="mdi-clock-outline"></v-icon>
                    <v-list-item-title>Mulai Jam: <span class="font-weight-medium">{{ item.start_time || 'N/A'
                    }}</span></v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <v-icon start icon="mdi-clock-end"></v-icon>
                    <v-list-item-title>Selesai Jam: <span class="font-weight-medium">{{ item.end_time || 'N/A'
                    }}</span></v-list-item-title>
                  </v-list-item>

                  <template v-if="hasTimeAdjustment">
                    <v-divider inset></v-divider>
                    <v-list-item>
                      <v-icon start icon="mdi-clock-edit-outline"></v-icon>
                      <v-list-item-title>Penyesuaian Waktu Masuk: <span class="font-weight-medium">{{ item.timein_adjust
                        || 'Tidak ada' }}</span></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-icon start icon="mdi-clock-edit-outline"></v-icon>
                      <v-list-item-title>Penyesuaian Waktu Keluar: <span class="font-weight-medium">{{
                        item.timeout_adjust || 'Tidak ada' }}</span></v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Notes, File, and Approvals Card -->
          <v-col cols="12" md="4">
            <v-card rounded="lg" elevation="0" class="h-100 border border-thin bg-background">
              <v-card-title class="py-3">
                <v-icon start icon="mdi-note-text-outline"></v-icon>
                Catatan & Persetujuan
              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="bg-background">
                  <v-list-item>
                    <v-icon start icon="mdi-pencil-outline"></v-icon>
                    <v-list-item-title>Catatan:</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap mt-1">{{ item.notes || 'Tidak ada catatan.'
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="item.file">
                    <v-icon start icon="mdi-attachment"></v-icon>
                    <v-list-item-title>Lampiran:</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-btn small variant="tonal" color="info" :href="`${assetUrl}/${item.file}`" target="_blank"
                        rel="noopener noreferrer" class="mt-1">
                        <v-icon start icon="mdi-download"></v-icon>
                        Lihat Lampiran
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-else>
                    <v-icon start icon="mdi-attachment-off"></v-icon>
                    <v-list-item-title>Lampiran: Tidak ada</v-list-item-title>
                  </v-list-item>

                  <v-divider class="my-3"></v-divider>

                  <v-list-item>
                    <v-list-item-title class="text-h6 mb-2">Status Persetujuan:</v-list-item-title>
                  </v-list-item>
                  <div v-if="item.approvals && item.approvals.length > 0">
                    <v-list-item v-for="approval in item.approvals" :key="approval.id">
                      <v-list-item-title class="text-capitalize">{{ approval.user_type }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip :color="getApprovalStatus(approval.user_approve).color" label small outlined>
                          <v-icon start :icon="getApprovalStatus(approval.user_approve).icon"></v-icon>
                          {{ getApprovalStatus(approval.user_approve).text }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </div>
                  <v-list-item v-else>
                    <v-list-item-title class="text-medium-emphasis">Tidak ada riwayat persetujuan.</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </td>
  </tr>
</template>

<style scoped>
/* Ensure the detail cards take full height within their column */
.h-100 {
  height: 100%;
}

/* Make list item titles and subtitles wrap naturally */
.v-list-item-title,
.v-list-item-subtitle {
  white-space: normal;
  line-height: 1.4;
}

/* Small adjustments for list item padding */
.v-list-item {
  padding-left: 0;
  padding-right: 0;
}

/* Adjust card content padding */
.v-card-text {
  padding-top: 8px;
  /* Reduce top padding for tighter list integration */
  padding-bottom: 8px;
}

/* Reduce some default list padding */
.v-list {
  padding: 0;
}
</style>
