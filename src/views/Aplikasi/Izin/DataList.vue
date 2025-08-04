<script setup>
import { usePermissionCheck } from '@/composables/useApp'
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { useList } from './useList' // Pastikan path ini benar
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue';
import ListExpandedRow from './ListExpandedRow.vue';

const router = useRouter();
const { permissionCheck } = usePermissionCheck();

const {
  store, // Berisi isLoading, headers, dll.
  filter_options,
  filters,
  pagination,
  tableOptions,
  resetFilters,
  HANDLE_TABLE_OPTIONS,
  LOAD_ITEMS,
  HANDLE_DATERANGE_CHANGE,
  HANDLE_REMOVE_ACTION, // Fungsi penghapusan utama dari useList
  EXPORT_ACTION,
  PRINT_ACTION,
} = useList();

// --- State untuk Dialog Konfirmasi Penghapusan ---
const dialogConfirmDelete = ref(false);
const itemToDelete = ref(null); // Bisa berupa ID tunggal atau array ID

// --- Navigasi ---
const edit = (id) => router.push({
  name: 'aplikasi.izin.edit',
  params: { id: id },
});

const moveTo = (name_route) => router.push({
  name: name_route
});

// --- Penanganan Aksi Tombol CrudLayout ---
const handleBtnChange = (btn) => {
  switch (btn.btn) {
    case 'filter':
    case 'refresh':
      LOAD_ITEMS(); // Memuat ulang item berdasarkan filter saat ini
      break;
    case 'add':
      router.push({ name: 'aplikasi.izin.create' });
      break;
    case 'export':
      EXPORT_ACTION();
      break;
    case 'print':
      PRINT_ACTION();
      break;
  }
};

// --- Penanganan Penghapusan (Single & Bulk) ---
const openDeleteConfirmation = (id = null) => {
  itemToDelete.value = id;
  dialogConfirmDelete.value = true;
};

const handleConfirmDeletion = async () => {
  dialogConfirmDelete.value = false;
  if (itemToDelete.value) {
    await HANDLE_REMOVE_ACTION(itemToDelete.value);
  } else {
    await HANDLE_REMOVE_ACTION([...pagination.selected]);
  }
  itemToDelete.value = null;
  pagination.selected = [];
  LOAD_ITEMS();
};

const cancelDelete = () => {
  itemToDelete.value = null
  pagination.selected = []
  dialogConfirmDelete.value = false;
}

// Helper approval status
const getApprovalClass = (approvals) => {
  if (!Array.isArray(approvals)) return '';
  if (approvals.some(a => a.user_approve === 'n')) return 'bg-error';
  if (approvals.every(a => a.user_approve === 'y')) return 'bg-success';
  return 'bg-warning';
};

const getApprovalIcon = (approvals) => {
  if (!Array.isArray(approvals)) return '';
  if (approvals.some(a => a.user_approve === 'n')) return 'mdi-window-close';
  if (approvals.every(a => a.user_approve === 'y')) return 'mdi-check-all';
  return 'mdi-information';
};
</script>

<template>
  <CrudLayout :permission="[
    'view_permits',
    'view_permits',
    'create_permits',
    'export_permits', // Tambahkan izin delete jika belum ada untuk CrudLayout
    'export_permits', // Tambahkan izin delete jika belum ada untuk CrudLayout
  ]" @date-range-changed="HANDLE_DATERANGE_CHANGE" @btn-changed="handleBtnChange">
    <v-card class="border border-thin" elevation="0">
      <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
        :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id"
        :search="pagination.search" :items-per-page-options="[10, 20, 30, 40, 50]"
        :items-per-page="tableOptions.itemsPerPage" :page="tableOptions.page" :sort-by="tableOptions.sortBy"
        @update:options="HANDLE_TABLE_OPTIONS" density="compact" show-select show-expand>

        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <template v-slot:top>
          <v-toolbar flat class="bg-background">
            <v-toolbar-title class="d-flex align-center">
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
              Daftar Data Permohonan Izin/Cuti/Dispensasi
            </v-toolbar-title>
            <v-divider vertical class="mx-3"></v-divider>
            <span class="px-2 text-medium-emphasis text-body-2">
              Total dipilih: {{ pagination.selected.length }}
            </span>
            <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0 || store.isLoading.list"
              @click="openDeleteConfirmation()" v-if="permissionCheck('delete_companies')" color="error" variant="text"
              size="small" />
            <v-btn icon="mdi-trash-can-outline" @click="moveTo('aplikasi.izin.tmp')"
              v-if="permissionCheck('forcedelete_companies') && permissionCheck('restore_companies')" variant="text"
              size="small" />
          </v-toolbar>
        </template>

        <template v-slot:thead>
          <tr>
            <td colspan="2">
              <v-select v-model="filters.permit_type" :items="filter_options.typePermitOptions" item-title="type"
                item-value="id" class="mt-6 ml-2" density="compact" variant="outlined" rounded="lg"></v-select>
            </td>
            <td colspan="2">
              <v-text-field v-model="filters.permit_numbers" class="ma-2" density="compact"
                placeholder="Cari dengan ID Numbers" hide-details variant="outlined" rounded="lg"></v-text-field>
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
          <ListExpandedRow :columns="columns" :item="item" />
        </template>

        <template #[`item.permit_numbers`]="{ item }">
          <v-chip :class="getApprovalClass(item.approvals)" :text="item.permit_numbers" border="thin opacity-25"
            :prepend-icon="getApprovalIcon(item.approvals)" label />
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"
              v-if="permissionCheck('update_permits')" />
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteConfirmation(item.id)"
              v-if="permissionCheck('delete_permits')" />
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <v-dialog v-model="dialogConfirmDelete" max-width="900" persistent>
      <CardDialogConfirmation @cancel="cancelDelete" @confirm="handleConfirmDeletion" icon="mdi-delete-forever"
        :title="`Konfirmasi Penghapusan ${pagination.selected.length > 1 ? pagination.selected.length : ''} Item KRITIS`"
        text="Anda akan menghapus data item ini secara permanen." cancel-text="Batalkan Penghapusan"
        confirm-text="Ya, Hapus Sekarang!" />
    </v-dialog>
  </CrudLayout>
</template>
