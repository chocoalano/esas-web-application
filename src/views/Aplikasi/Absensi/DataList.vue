<script setup>
import dayjs from 'dayjs'
import { usePermissionCheck } from '@/composables/useApp'
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { useList } from './useList' // Pastikan path ini benar
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue';
import ListExpandedRow from './ListExpandedRow.vue';
import GenerateReport from './GenerateReport.vue';

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
  GET_FILTER,
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
  name: 'aplikasi.absensi.edit',
  params: { id: id },
});

// --- Penanganan Aksi Tombol CrudLayout ---
const handleBtnChange = (btn) => {
  console.log(btn.btn);
  switch (btn.btn) {

    case 'filter':
    case 'refresh':
      LOAD_ITEMS(); // Memuat ulang item berdasarkan filter saat ini
      break;
    case 'add':
      router.push({ name: 'aplikasi.absensi.create' });
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

function onCompanyChange() {
  GET_FILTER()
}
function onDepartemenChange() {
  GET_FILTER()
}

onMounted(() => GET_FILTER())
</script>

<template>
  <CrudLayout :permission="[
    'view_any_user_attendances',
    'view_any_user_attendances',
    'create_user_attendances',
    'export_user_attendances',
    'view_user_attendances',
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
              Daftar Data Absensi
            </v-toolbar-title>
            <v-divider vertical class="mx-3"></v-divider>
            <span class="px-2 text-medium-emphasis text-body-2">
              Total dipilih: {{ pagination.selected.length }}
            </span>
            <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0 || store.isLoading.list"
              @click="openDeleteConfirmation()" v-if="permissionCheck('delete_companies')" color="error" variant="text"
              size="small" />
            <GenerateReport :comOptions="filter_options.companyOptions" :deptOptions="filter_options.deptOptions"
              :userOptions="filter_options.userOptions" :statusOptions="filter_options.statusOptions" />
          </v-toolbar>
        </template>

        <template v-slot:thead>
          <tr>
            <td colspan="2">
              <v-select label="Pilih perusahaan" v-model="filters.company_id" :items="filter_options.companyOptions"
                item-title="name" item-value="id" class="mt-6 ml-2" density="compact" variant="outlined" rounded="lg"
                @update:modelValue="onCompanyChange"></v-select>
            </td>
            <td>
              <v-select label="Pilih departement" v-model="filters.departement_id" :items="filter_options.deptOptions"
                item-title="name" item-value="id" class="mt-6 ml-2" density="compact" variant="outlined" rounded="lg"
                @update:modelValue="onDepartemenChange"></v-select>
            </td>
            <td colspan="2">
              <v-select label="Pilih user" v-model="filters.user_id" :items="filter_options.userOptions"
                item-title="name" item-value="id" class="mt-6 ml-2" density="compact" variant="outlined"
                rounded="lg"></v-select>
            </td>
            <td colspan="2">
              <v-select label="Pilih status masuk" v-model="filters.status_in" :items="filter_options.statusOptions"
                class="mt-6 ml-2" density="compact" variant="outlined" rounded="lg" item-title="name"
                item-value="value"></v-select>
            </td>
            <td colspan="2">
              <v-select label="Pilih status pulang" v-model="filters.status_out" :items="filter_options.statusOptions"
                class="mt-6 ml-2" density="compact" variant="outlined" rounded="lg" item-title="name"
                item-value="value"></v-select>
            </td>
            <td colspan="2">
              <v-date-input v-model="filters.createdAt" label="Cari dgn tgl dibuat" variant="outlined" rounded="lg"
                density="compact" class="mt-6 px-2" clearable prepend-icon="" prepend-inner-icon="mdi-calendar" />
            </td>
            <td colspan="2">
              <v-btn class="flex-grow-1" variant="tonal" @click="resetFilters" :loading="store.isLoading.list">
                Reset Filter
              </v-btn>
            </td>
          </tr>
        </template>

        <template #expanded-row="{ columns, item }">
          <ListExpandedRow :columns="columns" :item="item" />
        </template>

        <template #[`item.created_at`]="{ item }">
          {{ dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"
              v-if="permissionCheck('update_user_attendances')" />
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="openDeleteConfirmation(item.id)"
              v-if="permissionCheck('delete_user_attendances')" />
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
