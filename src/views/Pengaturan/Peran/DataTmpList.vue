<script setup>
import dayjs from 'dayjs'
import { usePermissionCheck } from '@/composables/useApp'
import { useTmp } from './useTmpList';

const { permissionCheck } = usePermissionCheck()
const {
  store,
  filters,
  pagination,
  tableOptions,
  resetFilters,
  HANDLE_TABLE_OPTIONS,
  HANDLE_RESTORE_ACTION,
  HANDLE_REMOVE_ACTION,
} = useTmp()

function handleRemove(arr) {
  arr.forEach(id => {
    HANDLE_REMOVE_ACTION(id)
  });
}
</script>

<template>
  <v-card class="border border-thin" elevation="0" rounded="xl">
    <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
      :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id" :search="pagination.search"
      :items-per-page-options="[10, 20, 30, 40, 50]" :items-per-page="tableOptions.itemsPerPage"
      :page="tableOptions.page" :sort-by="tableOptions.sortBy" @update:options="HANDLE_TABLE_OPTIONS" density="compact"
      rounded="lg" show-select>
      <template #loading>
        <v-skeleton-loader type="table" />
      </template>

      <template v-slot:top>
        <v-toolbar flat class="bg-background">
          <v-toolbar-title class="d-flex align-center">
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
            Daftar Data Posisi/Jabatan Yang Telah Dihapus
          </v-toolbar-title>
          <v-divider vertical></v-divider>
          <span class="px-2">Total data yang ingin dihapus: {{ pagination.selected.length }}</span>
          <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0"
            @click="handleRemove(pagination.selected)" v-if="permissionCheck('forcedelete_roles')" />
        </v-toolbar>
      </template>

      <template v-slot:thead>
        <tr>
          <td colspan="2">
            <v-text-field v-model="filters.name" class="ma-2" density="compact" rounded="lg"
              placeholder="Cari nama peran" hide-details variant="outlined"></v-text-field>
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
            <v-btn class="flex-grow-1 mr-2" rounded="lg" variant="tonal" @click="resetFilters"
              :loading="store.isLoading.list">
              Reset Filter
            </v-btn>
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
          <v-icon color="medium-emphasis" icon="mdi-restore" size="small" @click="HANDLE_RESTORE_ACTION(item.id)"
            v-if="permissionCheck('restore_roles')" />
          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="HANDLE_REMOVE_ACTION(item.id)"
            v-if="permissionCheck('forcedelete_roles')" />
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>
