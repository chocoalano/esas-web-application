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
      rounded="lg" show-select show-expand>
      <template #loading>
        <v-skeleton-loader type="table" />
      </template>

      <template v-slot:top>
        <v-toolbar flat class="bg-background">
          <v-toolbar-title class="d-flex align-center">
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
            Daftar Data Level Yang Telah Dihapus
          </v-toolbar-title>
          <v-divider vertical></v-divider>
          <span class="px-2">Total data yang ingin dihapus: {{ pagination.selected.length }}</span>
          <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0"
            @click="handleRemove(pagination.selected)" v-if="permissionCheck('forcedelete_companies')" />
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
              <v-list lines="two" density="comfortable">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-domain"></v-icon>
                  </template>
                  <v-list-item-title>Perusahaan</v-list-item-title>
                  <v-list-item-subtitle>{{ item.company.name }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-group value="timeWorks">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-clock-time-four-outline"
                      title="Waktu Kerja"></v-list-item>
                  </template>
                  <v-list-item v-for="timeWork in item.time_works" :key="timeWork.id" :title="timeWork.name"
                    :subtitle="`Masuk: ${new Date(timeWork.in).toLocaleTimeString()}, Keluar: ${new Date(timeWork.out).toLocaleTimeString()}`"></v-list-item>
                  <v-list-item v-if="item.time_works.length === 0" title="Tidak ada data waktu kerja."></v-list-item>
                </v-list-group>

                <v-list-group value="jobPositions">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-briefcase-account-outline"
                      title="Posisi Jabatan"></v-list-item>
                  </template>
                  <v-list-item v-for="jobPosition in item.job_positions" :key="jobPosition.id"
                    :title="jobPosition.name"></v-list-item>
                  <v-list-item v-if="item.job_positions.length === 0"
                    title="Tidak ada data posisi jabatan."></v-list-item>
                </v-list-group>

                <v-list-group value="jobLevels">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-account-group-outline"
                      title="Jenjang Jabatan"></v-list-item>
                  </template>
                  <v-list-item v-for="jobLevel in item.job_levels" :key="jobLevel.id"
                    :title="jobLevel.name"></v-list-item>
                  <v-list-item v-if="item.job_levels.length === 0"
                    title="Tidak ada data jenjang jabatan."></v-list-item>
                </v-list-group>

                <v-list-group value="employees">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-account-multiple-outline"
                      title="Karyawan Terkait"></v-list-item>
                  </template>
                  <v-list-item v-for="employee in item.employees" :key="employee.id"
                    :title="`Karyawan: ${employee.user.nip} | ${employee.user.name}`"
                    :subtitle="`Bergabung: ${new Date(employee.join_date).toLocaleDateString()}`"></v-list-item>
                  <v-list-item v-if="item.employees.length === 0" title="Tidak ada karyawan terkait."></v-list-item>
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
          <v-icon color="medium-emphasis" icon="mdi-restore" size="small" @click="HANDLE_RESTORE_ACTION(item.id)"
            v-if="permissionCheck('restore_job_levels')" />
          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="HANDLE_REMOVE_ACTION(item.id)"
            v-if="permissionCheck('forcedelete_job_levels')" />
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>
