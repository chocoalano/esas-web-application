<script setup>
import dayjs from 'dayjs'
import { usePermissionCheck } from '@/composables/useApp'
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { useList } from './useList' // Pastikan path ini benar
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue';

const router = useRouter();
const { permissionCheck } = usePermissionCheck();

const {
  store, // Berisi isLoading, headers, dll.
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
  name: 'general.laporan-bug.edit',
  params: { id: id },
});

// --- Penanganan Aksi Tombol CrudLayout ---
const handleBtnChange = (btn) => {
  switch (btn.btn) {
    case 'filter':
    case 'refresh':
      LOAD_ITEMS(); // Memuat ulang item berdasarkan filter saat ini
      break;
    case 'add':
      router.push({ name: 'general.laporan-bug.create' });
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
</script>

<template>
  <CrudLayout :permission="[
    'view_any_announcements',
    'create_announcements',
    'export_announcements',
    // 'view_announcements',
    // 'view_announcements',
  ]" @date-range-changed="HANDLE_DATERANGE_CHANGE" @btn-changed="handleBtnChange">
    <v-card class="border border-thin" elevation="0" rounded="xl">
      <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
        :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id"
        :search="pagination.search" :items-per-page-options="[10, 20, 30, 40, 50]"
        :items-per-page="tableOptions.itemsPerPage" :page="tableOptions.page" :sort-by="tableOptions.sortBy"
        @update:options="HANDLE_TABLE_OPTIONS" density="compact" rounded="lg" show-select show-expand>

        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <template v-slot:top>
          <v-toolbar flat class="bg-background">
            <v-toolbar-title class="d-flex align-center">
              <v-icon color="medium-emphasis" icon="mdi-bug-check-outline" size="x-small" start></v-icon>
              Daftar Data Laporan Bug
            </v-toolbar-title>
            <v-divider vertical class="mx-3"></v-divider>
            <span class="px-2 text-medium-emphasis text-body-2">
              Total dipilih: {{ pagination.selected.length }}
            </span>
            <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0 || store.isLoading.list"
              @click="openDeleteConfirmation()" v-if="permissionCheck('delete_companies')" color="error" variant="text"
              size="small" />
          </v-toolbar>
        </template>

        <template v-slot:thead>
          <tr>
            <td colspan="2">
              <v-text-field v-model="filters.company" class="ma-2" density="compact" rounded="lg"
                placeholder="Cari nama perusahaan" hide-details variant="outlined"></v-text-field>
            </td>
            <td colspan="2">
              <v-text-field v-model="filters.name" class="ma-2" density="compact" rounded="lg"
                placeholder="Cari nama departemen" hide-details variant="outlined"></v-text-field>
            </td>
            <td>
              <v-date-input v-model="filters.createdAt" label="Cari dgn tgl dibuat" variant="outlined" density="compact"
                rounded="lg" class="mt-6 px-2" clearable prepend-icon="" prepend-inner-icon="mdi-calendar" />
            </td>
            <td>
              <v-date-input v-model="filters.updatedAt" label="Cari dgn tgl diperbaharui" variant="outlined"
                density="compact" rounded="lg" class="mt-6 px-2" clearable prepend-icon=""
                prepend-inner-icon="mdi-calendar" />
            </td>
            <td colspan="2">
              <v-btn class="flex-grow-1" rounded="lg" variant="tonal" @click="resetFilters"
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
                <div v-html="item.message"></div>
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
            <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"
              v-if="permissionCheck('update_announcements')" />
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteConfirmation(item.id)"
              v-if="permissionCheck('delete_announcements')" />
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
