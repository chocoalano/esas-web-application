<script setup>
import {
  usePermissionCheck,
  useAppDebug,
  useAssetUrl,
  useAssetDirectory,
  useAssetDefaultImg,
} from '@/composables/useApp';
import dayjs from 'dayjs';
import { useTmpList } from './useTmpList';

// --- Composables ---
const { permissionCheck } = usePermissionCheck();
const appDebug = useAppDebug();
const assetUrl = useAssetUrl();
const assetDirectory = useAssetDirectory();
const assetDefaultImg = useAssetDefaultImg();

// Destructure from your usePengguna composable.
// Ensure `usePengguna` exposes all these properties and methods.
const {
  store,
  filters,
  pagination,
  tableOptions,
  filters_options,
  HANDLE_TABLE_OPTIONS,
  ON_COMPANY_CHANGE,
  ON_DEPT_CHANGE,
  ON_POST_CHANGE,
  RESET_FILTER_ACTION,
  HANDLE_RESTORE,
  HANDLE_FORCE_DELETE
  // setAlert, // setAlert is typically used internally by the composable for its own alerts
} = useTmpList();

// Helper for item properties in v-select
const itemProps = (item) => {
  if (!item) return { title: '', subtitle: '' };
  return {
    title: item.name,
    subtitle: item.nip,
  };
};
const restored = (id) => {
  HANDLE_RESTORE(id)
};
const forceremove = (id) => {
  HANDLE_FORCE_DELETE(id)
};
const handleRemoveSelected = (selected) => {
  selected.forEach(id => {
    HANDLE_FORCE_DELETE(id)
  });
};
const handleRestoreSelected = (selected) => {
  selected.forEach(id => {
    HANDLE_RESTORE(id)
  });
};
</script>

<template>
  <v-container>
    <!-- Main Data Table Card -->
    <v-card class="border border-thin" elevation="0" rounded="xl">
      <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
        :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id"
        :search="pagination.search" :items-per-page-options="[10, 20, 30, 40, 50]"
        :items-per-page="tableOptions.itemsPerPage" :page="tableOptions.page" :sort-by="tableOptions.sortBy"
        @update:options="HANDLE_TABLE_OPTIONS" density="compact" rounded="lg" show-select>
        <!-- Loading Skeleton -->
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <!-- Table Toolbar -->
        <template v-slot:top>
          <v-toolbar flat class="bg-background">
            <v-toolbar-title class="d-flex align-center">
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
              Daftar Data Pengguna Yang Telah Dihapus
            </v-toolbar-title>
            <v-divider vertical></v-divider>
            <span class="px-2">Total data yang ingin dihapus: {{ pagination.selected.length }}</span>
            <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0"
              @click="handleRemoveSelected(pagination.selected)" v-if="permissionCheck('forcedelete_users')" />
            <v-btn icon="mdi-restore" :disabled="pagination.selected.length === 0"
              @click="handleRestoreSelected(pagination.selected)" v-if="permissionCheck('restore_users')" />
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
              <v-btn class="flex-grow-1 ml-2 mr-2" rounded="lg" variant="tonal" @click="RESET_FILTER_ACTION"
                :loading="store.isLoading.list">
                Reset Filter
              </v-btn>
            </td>
          </tr>
        </template>

        <!-- Custom Item Templates -->
        <template #[`item.avatar`]="{ item }">
          <v-avatar>
            <v-img :alt="item.name" :src="`${assetUrl}/${item.avatar}`"
              :lazy-src="`${assetUrl}/${assetDirectory}/${appDebug ? 'deployment' : 'production'}/${assetDefaultImg}`"></v-img>
          </v-avatar>
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template>
        <template #[`item.updated_at`]="{ item }">
          {{ dayjs(item.updated_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template>

        <!-- Actions Menu -->
        <template #[`item.actions`]="{ item }">
          <v-icon color="medium-emphasis" icon="mdi-restore" size="small" @click="restored(item.id)"></v-icon>

          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="forceremove(item.id)"></v-icon>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>
