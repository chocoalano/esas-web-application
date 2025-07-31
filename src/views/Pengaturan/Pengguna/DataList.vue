<script setup>
import { useRouter } from 'vue-router';
import CrudLayout from '@/components/Mains/CrudLayout.vue';
import {
  usePermissionCheck
} from '@/composables/useApp';
import dayjs from 'dayjs';
import { usePengguna } from './useList'; // Your composable for user list logic
import { mergeProps, ref, computed, reactive } from 'vue';
import ListExpandedRow from './ListExpandedRow.vue';
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue';

// --- Composables ---
const { permissionCheck } = usePermissionCheck();

const router = useRouter();

// Destructure from your usePengguna composable.
// Ensure `usePengguna` exposes all these properties and methods.
const {
  store,
  filters,
  pagination,
  tableOptions,
  filters_options,
  HANDLE_TABLE_OPTIONS,
  HANDLE_DATERANGE_CHANGE,
  LOAD_ITEMS,
  ON_COMPANY_CHANGE,
  ON_DEPT_CHANGE,
  ON_POST_CHANGE,
  RESET_FILTER_ACTION,
  HANDLE_REMOVE_ACTION,
  HANDLE_RESET_PASSWORD_ACTION,
  HANDLE_RESET_DEVICEID_ACTION, // Assumed to be exposed by usePengguna
  EXPORT_ACTION,
  PRINT_ACTION,
  // setAlert, // setAlert is typically used internally by the composable for its own alerts
} = usePengguna();

/**
 * @typedef {'delete' | 'reset-password' | 'reset-device-id'} DialogType
 */
const dialogState = reactive({
  type: null,
  id: null,
  show: false,
});
const openDialog = (type, id) => {
  dialogState.type = type;
  dialogState.id = id;
  dialogState.show = true;
};
const closeDialog = () => {
  dialogState.show = false;
  dialogState.type = null;
  dialogState.id = null;
};

// Helper for item properties in v-select
const itemProps = (item) => {
  if (!item) return { title: '', subtitle: '' };
  return {
    title: item.name,
    subtitle: item.nip,
  };
};

// Define the available actions for a user in the context menu
const userActions = ref([
  { act: 'Riwayat Log', permission: 'forcedelete_any_users', icon: 'mdi-clipboard-text-clock-outline' },
  { act: 'Reset Device ID', permission: 'view_users', icon: 'mdi-cellphone-remove' },
  { act: 'Reset Password', permission: 'view_users', icon: 'mdi-passport-remove' },
  { act: 'Perbaharui Data', permission: 'update_users', icon: 'mdi-pencil' },
  { act: 'Hapus Data', permission: 'delete_users', icon: 'mdi-delete' },
]);

// Filter user actions based on current user permissions
const filteredUserActions = computed(() => {
  return userActions.value.filter(action => permissionCheck(action.permission));
});

/**
 * Handles the selected action for a user item.
 * @param {string} actionType - The type of action to perform.
 * @param {object} userItem - The user object on which the action is performed.
 */
const handleUserAction = (actionType, userItem) => {
  switch (actionType) {
    case 'Reset Device ID':
      openDialog('reset-device-id', userItem.id);
      break;
    case 'Reset Password':
      openDialog('reset-password', userItem.id);
      break;
    case 'Perbaharui Data':
      router.push({
        name: 'pengaturan.users.edit',
        params: { id: userItem.id },
      });
      break;
    case 'Riwayat Log':
      router.push({
        name: 'pengaturan.users.log',
        params: { id: userItem.id },
      });
      break;
    case 'Hapus Data':
      openDialog('delete', userItem.id);
      break;
    default:
      console.warn(`Unknown action type: ${actionType}`);
  }
};

const moveTo = (name_route) => router.push({
  name: name_route
})

/**
 * Confirms the deletion of a single item.
 */
const confirmDeleteSingle = () => {
  if (dialogState.id) {
    HANDLE_REMOVE_ACTION([dialogState.id]); // Assuming HANDLE_REMOVE_ACTION can take an array of IDs
  }
  closeDialog();
};

/**
 * Handles the removal of multiple selected items.
 * @param {Array<string>} selectedIds - An array of IDs of items to be removed.
 */
const handleRemoveSelected = (selectedIds) => {
  if (selectedIds && selectedIds.length > 0) {
    // You might want a separate confirmation for multiple deletions or handle it directly
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih?`)) { // Using native confirm for multi-delete for simplicity, consider custom modal if preferred
      HANDLE_REMOVE_ACTION(selectedIds);
      pagination.selected = []; // Clear selection after action
    }
  }
};


/**
 * Confirms the reset password action.
 */
const confirmResetPassword = () => {
  if (dialogState.id) {
    HANDLE_RESET_PASSWORD_ACTION(dialogState.id);
  }
  closeDialog();
};

/**
 * Confirms the reset device ID action.
 */
const confirmResetDeviceId = () => {
  if (dialogState.id) {
    HANDLE_RESET_DEVICEID_ACTION(dialogState.id); // Call the specific action from usePengguna
  }
  closeDialog();
};

/**
 * Handles changes triggered by buttons in the CrudLayout (filter, refresh, add, export, print).
 * @param {object} btn - The button object containing its type.
 */
const handleBtnChange = (btn) => {
  console.log('Button changed:', btn);
  switch (btn.btn) {
    case 'filter':
    case 'refresh':
      LOAD_ITEMS();
      break;
    case 'add':
      router.push({ name: 'pengaturan.users.create' });
      break;
    case 'export':
      EXPORT_ACTION();
      break;
    case 'print':
      PRINT_ACTION();
      break;
  }
};
</script>

<template>
  <CrudLayout :permission="[
    'view_any_users',
    'create_users',
    'export_users',
    'export_users',
    'export_users',
  ]" @date-range-changed="HANDLE_DATERANGE_CHANGE" @btn-changed="handleBtnChange">
    <!-- Main Data Table Card -->
    <v-card class="border border-thin" elevation="0" rounded="xl">
      <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
        :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id"
        :search="pagination.search" :items-per-page-options="[10, 20, 30, 40, 50]"
        :items-per-page="tableOptions.itemsPerPage" :page="tableOptions.page" :sort-by="tableOptions.sortBy"
        @update:options="HANDLE_TABLE_OPTIONS" density="compact" rounded="lg" show-select show-expand>
        <!-- Loading Skeleton -->
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <!-- Table Toolbar -->
        <template v-slot:top>
          <v-toolbar flat class="bg-background">
            <v-toolbar-title class="d-flex align-center">
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
              Daftar Data Pengguna
            </v-toolbar-title>
            <v-divider vertical></v-divider>
            <span class="px-2">Total data yang ingin dihapus: {{ pagination.selected.length }}</span>
            <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0"
              @click="handleRemoveSelected(pagination.selected)" v-if="permissionCheck('delete_users')" />
            <v-btn icon="mdi-trash-can-outline" @click="moveTo('pengaturan.users.tmp')" v-if="permissionCheck('forcedelete_users') &&
              permissionCheck('restore_users')" />
          </v-toolbar>
        </template>

        <!-- Table Header Filters -->
        <template v-slot:thead>
          <tr>
            <td colspan="2">
              <v-select v-model="filters.company" :items="filters_options.selectItemCompany" item-title="name"
                item-value="id" label="Filter Perusahaan" clearable density="compact" rounded="lg" variant="outlined"
                class="mt-6 ml-2" @update:modelValue="ON_COMPANY_CHANGE"></v-select>
            </td>
            <td>
              <v-select v-model="filters.departemen" :items="filters_options.selectItemDepartement" item-title="name"
                item-value="id" label="Filter Departemen" clearable density="compact" rounded="lg" variant="outlined"
                class="mt-6 ml-2" @update:modelValue="ON_DEPT_CHANGE"></v-select>
            </td>
            <td>
              <v-select v-model="filters.position" :items="filters_options.selectItemPosition" item-title="name"
                item-value="id" label="Filter Posisi" clearable density="compact" rounded="lg" variant="outlined"
                class="mt-6 ml-2" @update:modelValue="ON_POST_CHANGE"></v-select>
            </td>
            <td>
              <v-select v-model="filters.level" :items="filters_options.selectItemLevel" item-title="name"
                item-value="id" label="Filter Level" clearable density="compact" rounded="lg" variant="outlined"
                class="mt-6 ml-2"></v-select>
            </td>
            <td colspan="2">
              <v-select v-model="filters.nip" :items="filters_options.selectItemUser" :item-props="itemProps"
                item-value="nip" label="Filter NIP" clearable density="compact" rounded="lg" variant="outlined"
                class="mt-6 ml-2"></v-select>
            </td>
            <td>
              <v-select v-model="filters.name" :items="filters_options.selectItemUser" :item-props="itemProps"
                item-value="name" label="Filter Nama" clearable density="compact" rounded="lg" variant="outlined"
                class="mt-6 ml-2"></v-select>
            </td>
            <td>
              <v-select v-model="filters.status" class="mt-6 ml-2" density="compact" rounded="lg"
                :items="['active', 'inactive', 'resign']" label="Filter Status" clearable variant="outlined"></v-select>
            </td>
            <td>
              <v-btn class="flex-grow-1 ml-2 mr-2" variant="tonal" @click="RESET_FILTER_ACTION"
                :loading="store.isLoading.list">
                Reset Filter
              </v-btn>
            </td>
          </tr>
        </template>

        <template #expanded-row="{ columns, item }">
          <ListExpandedRow :columns="columns" :item="item" />
        </template>
        <!-- Custom Item Templates -->
        <template #[`item.created_at`]="{ item }">
          {{ dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template>
        <template #[`item.updated_at`]="{ item }">
          {{ dayjs(item.updated_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template>

        <!-- Actions Menu -->
        <template #[`item.actions`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props: menuProps }">
              <v-tooltip location="top">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-btn icon="mdi-dots-horizontal" variant="text" v-bind="mergeProps(menuProps, tooltipProps)"></v-btn>
                </template>
                <span>Berikan aksi untuk pengguna {{ item.nip }}</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item v-for="action in filteredUserActions" :key="action.act" :value="action.act"
                @click="handleUserAction(action.act, item)">
                <template v-slot:prepend>
                  <v-icon>{{ action.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ action.act }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Dynamic Confirmation Dialogs -->
    <v-dialog v-model="dialogState.show" width="auto">
      <CardDialogConfirmation v-if="dialogState.type === 'delete'" @cancel="closeDialog" @confirm="confirmDeleteSingle"
        icon="mdi-delete-forever"
        :title="`Konfirmasi Penghapusan ${pagination.selected.length > 1 ? pagination.selected.length : ''} Item KRITIS`"
        text="Anda akan menghapus data item ini secara permanen." cancel-text="Batalkan Penghapusan"
        confirm-text="Ya, Hapus Sekarang!" max-width="900" />
      <v-card max-width="600">
        <template v-if="dialogState.type === 'reset-password'">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-key-change" class="mr-3" color="warning"></v-icon>
            <div>
              <div class="text-h6">Konfirmasi Reset Password</div>
              Kata sandi pengguna akan diatur ulang menjadi NIP mereka. Lanjutkan?
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" @click="confirmResetPassword">Lanjutkan</v-btn>
            <v-btn @click="closeDialog">Batal</v-btn>
          </v-card-actions>
        </template>

        <template v-else-if="dialogState.type === 'reset-device-id'">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-tablet-reset" class="mr-3" color="info"></v-icon>
            <div>
              <div class="text-h6">Konfirmasi Reset Device ID</div>
              ID perangkat pengguna akan dihapus. Pengguna harus login kembali. Lanjutkan?
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" @click="confirmResetDeviceId">Lanjutkan</v-btn>
            <v-btn @click="closeDialog">Batal</v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </CrudLayout>
</template>
