<script setup>
import dayjs from 'dayjs';
import { usePermissionCheck } from '@/composables/useApp';
import { useTmp } from './useTmpList';

// Assuming you'll add a confirmation dialog for bulk delete
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue';
import { reactive } from 'vue'; // Import reactive for dialogState

const { permissionCheck } = usePermissionCheck();

// Destructure from your useTmp composable.
const {
  store,
  filters,
  pagination,
  tableOptions,
  filterOptions, // ⭐ Get filterOptions from composable ⭐
  resetFilters,
  HANDLE_TABLE_OPTIONS,
  HANDLE_RESTORE_ACTION,
  HANDLE_REMOVE_ACTION,
} = useTmp(); // Correct composable call

/**
 * @typedef {'delete-single' | 'delete-multiple' | 'restore-single' | 'restore-multiple'} DialogType
 */
const dialogState = reactive({
  type: null,
  id: null, // For single item actions
  ids: [],  // For multiple item actions
  show: false,
  title: '',
  text: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  icon: '',
});

// Function to open the dynamic confirmation dialog
const openDialog = (type, itemOrIds) => {
  dialogState.type = type;
  dialogState.show = true;

  // Reset IDs/ID
  dialogState.id = null;
  dialogState.ids = [];

  switch (type) {
    case 'delete-single':
      dialogState.id = itemOrIds.id;
      dialogState.title = `Konfirmasi Penghapusan Permanen Izin ${itemOrIds.permit_numbers}`;
      dialogState.text = `Anda akan menghapus data izin ini secara permanen. Tindakan ini tidak dapat dibatalkan.`;
      dialogState.confirmText = 'Ya, Hapus Permanen!';
      dialogState.cancelText = 'Batalkan Penghapusan';
      dialogState.confirmColor = 'error';
      dialogState.icon = 'mdi-delete-forever';
      break;
    case 'delete-multiple':
      dialogState.ids = itemOrIds; // itemOrIds is an array of IDs here
      dialogState.title = `Konfirmasi Penghapusan Permanen ${dialogState.ids.length} Data Izin`;
      dialogState.text = `Anda akan menghapus ${dialogState.ids.length} data izin terpilih secara permanen. Tindakan ini tidak dapat dibatalkan.`;
      dialogState.confirmText = 'Ya, Hapus Permanen!';
      dialogState.cancelText = 'Batalkan Penghapusan';
      dialogState.confirmColor = 'error';
      dialogState.icon = 'mdi-delete-sweep';
      break;
    case 'restore-single':
      dialogState.id = itemOrIds.id;
      dialogState.title = `Konfirmasi Pemulihan Izin ${itemOrIds.permit_numbers}`;
      dialogState.text = `Anda akan memulihkan data izin ini. Ini akan mengembalikannya ke daftar aktif. Lanjutkan?`;
      dialogState.confirmText = 'Ya, Pulihkan!';
      dialogState.cancelText = 'Batal';
      dialogState.confirmColor = 'success';
      dialogState.icon = 'mdi-restore';
      break;
    case 'restore-multiple': // If you want to add bulk restore later
      dialogState.ids = itemOrIds;
      dialogState.title = `Konfirmasi Pemulihan ${dialogState.ids.length} Data Izin`;
      dialogState.text = `Anda akan memulihkan ${dialogState.ids.length} data izin terpilih. Lanjutkan?`;
      dialogState.confirmText = 'Ya, Pulihkan Semua!';
      dialogState.cancelText = 'Batal';
      dialogState.confirmColor = 'success';
      dialogState.icon = 'mdi-restore-all';
      break;
  }
};

const closeDialog = () => {
  dialogState.show = false;
  // Reset all state after closing
  dialogState.type = null;
  dialogState.id = null;
  dialogState.ids = [];
  dialogState.title = '';
  dialogState.text = '';
  dialogState.confirmText = '';
  dialogState.cancelText = '';
  dialogState.confirmColor = '';
  dialogState.icon = '';
};

const confirmAction = async () => {
  if (dialogState.type === 'delete-single') {
    await HANDLE_REMOVE_ACTION(dialogState.id); // Pass single ID
  } else if (dialogState.type === 'delete-multiple') {
    await HANDLE_REMOVE_ACTION(dialogState.ids); // Pass array of IDs
  } else if (dialogState.type === 'restore-single') {
    await HANDLE_RESTORE_ACTION(dialogState.id); // Pass single ID
  } else if (dialogState.type === 'restore-multiple') {
    // Implement bulk restore if needed in useTmp
    // await HANDLE_RESTORE_ACTION(dialogState.ids);
    console.warn("Bulk restore not yet implemented in composable.");
  }
  closeDialog();
};

function handleRemoveSelected(selectedIds) {
  if (selectedIds && selectedIds.length > 0) {
    openDialog('delete-multiple', selectedIds);
  }
}

</script>

<template>
  <v-card class="border border-thin" elevation="0">
    <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
      :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id" :search="pagination.search"
      :items-per-page-options="[10, 20, 30, 40, 50]" :items-per-page="tableOptions.itemsPerPage"
      :page="tableOptions.page" :sort-by="tableOptions.sortBy" @update:options="HANDLE_TABLE_OPTIONS" density="compact"
      show-select show-expand>
      <template #loading>
        <v-skeleton-loader type="table" />
      </template>

      <template v-slot:top>
        <v-toolbar flat class="bg-background">
          <v-toolbar-title class="d-flex align-center">
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
            Daftar Data Izin/Cuti/Dispensasi Yang Telah Dihapus
          </v-toolbar-title>
          <v-divider vertical class="mx-3"></v-divider>
          <span class="px-2 text-subtitle-2 text-medium-emphasis">
            Total terpilih: {{ pagination.selected.length }}
          </span>
          <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0"
            @click="handleRemoveSelected(pagination.selected)" v-if="permissionCheck('forcedelete_permits')"
            color="error" variant="tonal">
            <v-tooltip activator="parent" location="top">Hapus permanen data terpilih</v-tooltip>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:thead>
        <tr>
          <td colspan="2">
            <v-select v-model="filters.permit_type" :items="filterOptions.typePermitOptions" item-title="type"
              item-value="id" label="Tipe Izin" clearable density="compact" variant="outlined" rounded="lg"
              class="mt-6 ml-2"></v-select>
          </td>
          <td colspan="2">
            <v-text-field v-model="filters.permit_numbers" class="ma-2" density="compact"
              placeholder="Cari dengan ID Numbers" hide-details variant="outlined" rounded="lg"
              clearable></v-text-field>
          </td>
          <td colspan="2">
            <v-date-input v-model="filters.workday" label="Tgl diajukan" variant="outlined" rounded="lg"
              density="compact" class="mt-6 px-2" clearable prepend-icon="" prepend-inner-icon="mdi-calendar" />
          </td>
          <td colspan="2">
            <v-date-input v-model="filters.createdAt" label="Tgl dibuat" variant="outlined" rounded="lg"
              density="compact" class="mt-6 px-2" clearable prepend-icon="" prepend-inner-icon="mdi-calendar" />
          </td>
          <td colspan="2">
            <v-date-input v-model="filters.updatedAt" label="Tgl diperbaharui" variant="outlined" rounded="lg"
              density="compact" class="mt-6 px-2" clearable prepend-icon="" prepend-inner-icon="mdi-calendar" />
          </td>
          <td colspan="2">
            <v-btn class="flex-grow-1" variant="tonal" @click="resetFilters" rounded="lg"
              :loading="store.isLoading.list">
              Reset Filter
            </v-btn>
          </td>
        </tr>
      </template>

      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="py-2">
            <v-sheet rounded="lg" border class="py-5 px-5 text-medium-emphasis">
              <v-list lines="two" density="comfortable">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-domain"></v-icon>
                  </template>
                  <v-list-item-title>Perusahaan</v-list-item-title>
                  <v-list-item-subtitle>{{ item.company?.name || 'N/A' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-group value="timeWorks">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-clock-time-four-outline"
                      title="Waktu Kerja"></v-list-item>
                  </template>
                  <v-list-item v-for="timeWork in item.time_works || []" :key="timeWork.id" :title="timeWork.name"
                    :subtitle="`Masuk: ${dayjs(timeWork.in).format('HH:mm')}, Keluar: ${dayjs(timeWork.out).format('HH:mm')}`"></v-list-item>
                  <v-list-item v-if="!item.time_works || item.time_works.length === 0"
                    title="Tidak ada data waktu kerja."></v-list-item>
                </v-list-group>

                <v-list-group value="jobPositions">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-briefcase-account-outline"
                      title="Posisi Jabatan"></v-list-item>
                  </template>
                  <v-list-item v-for="jobPosition in item.job_positions || []" :key="jobPosition.id"
                    :title="jobPosition.name"></v-list-item>
                  <v-list-item v-if="!item.job_positions || item.job_positions.length === 0"
                    title="Tidak ada data posisi jabatan."></v-list-item>
                </v-list-group>

                <v-list-group value="jobLevels">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-account-group-outline"
                      title="Jenjang Jabatan"></v-list-item>
                  </template>
                  <v-list-item v-for="jobLevel in item.job_levels || []" :key="jobLevel.id"
                    :title="jobLevel.name"></v-list-item>
                  <v-list-item v-if="!item.job_levels || item.job_levels.length === 0"
                    title="Tidak ada data jenjang jabatan."></v-list-item>
                </v-list-group>

                <v-list-group value="employees">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-account-multiple-outline"
                      title="Karyawan Terkait"></v-list-item>
                  </template>
                  <v-list-item v-for="employee in item.employees || []" :key="employee.id"
                    :title="`Karyawan: ${employee.user?.nip || 'N/A'} | ${employee.user?.name || 'N/A'}`"
                    :subtitle="`Bergabung: ${dayjs(employee.join_date).format('DD/MM/YYYY')}`"></v-list-item>
                  <v-list-item v-if="!item.employees || item.employees.length === 0"
                    title="Tidak ada karyawan terkait."></v-list-item>
                </v-list-group>
              </v-list>
            </v-sheet>
          </td>
        </tr>
      </template>

      <template #[`item.created_at`]="{ item }">
        {{ dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}
      </template>

      <template #[`item.updated_at`]="{ item }">
        {{ dayjs(item.updated_at).format('DD/MM/YYYY HH:mm:ss') }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-restore" size="small" @click="openDialog('restore-single', item)"
            v-if="permissionCheck('restore_permits')">
            <v-tooltip activator="parent" location="top">Pulihkan data</v-tooltip>
          </v-icon>
          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="openDialog('delete-single', item)"
            v-if="permissionCheck('forcedelete_permits')">
            <v-tooltip activator="parent" location="top">Hapus permanen</v-tooltip>
          </v-icon>
        </div>
      </template>
    </v-data-table-server>
  </v-card>

  <v-dialog v-model="dialogState.show" max-width="600" persistent>
    <CardDialogConfirmation @cancel="closeDialog" @confirm="confirmAction" :icon="dialogState.icon"
      :title="dialogState.title" :text="dialogState.text" :cancel-text="dialogState.cancelText"
      :confirm-text="dialogState.confirmText" :confirm-color="dialogState.confirmColor" />
  </v-dialog>
</template>
