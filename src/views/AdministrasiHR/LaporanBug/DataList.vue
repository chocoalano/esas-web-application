<script setup>
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { usePermissionCheck } from '@/composables/useApp'
import dayjs from 'dayjs'
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue'
import FormSubmit from './FormSubmit.vue'
import DataShow from './DataShow.vue'
import { useLaporanBug } from './useLaporanBug'

const { permissionCheck } = usePermissionCheck()
const {
  store,
  pagination,
  filters,
  formState,
  tableOptions,
  alertState,
  handleTableOptions,
  handleBtnChange,
  handleDateRangeChange,
  handleCancelForm,
  handleSubmitForm,
  loadFormData,
  handleRemove,
  handleConfirmRemove,
  handleCancelRemove,
} = useLaporanBug()
</script>

<template>
  <CrudLayout
    :permission="[
      'view_any_bug::report',
      'view_any_bug::report',
      'create_bug::report',
      'view_any_bug::report',
      'export_bug::report',
      'view_any_bug::report',
    ]"
    @date-range-changed="handleDateRangeChange"
    @btn-changed="handleBtnChange"
  >
    <v-alert
      v-model="alertState.show"
      :color="alertState.type"
      :title="alertState.title"
      density="compact"
      theme="dark"
      :icon="
        alertState.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-close-circle-multiple'
      "
      class="mb-5"
    >
      {{ alertState.message }}
    </v-alert>
    <v-card class="border border-thin" elevation="0">
      <v-data-table-server
        v-model="pagination.selected"
        :headers="store.headers"
        :items="pagination.serverItems"
        :items-length="pagination.totalItems"
        :loading="store.isLoading.list"
        item-value="id"
        :search="pagination.search"
        :items-per-page-options="[10, 20, 30, 40, 50]"
        :items-per-page="tableOptions.itemsPerPage"
        :page="tableOptions.page"
        :sort-by="tableOptions.sortBy"
        @update:options="handleTableOptions"
        density="compact"
        show-select
      >
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <template v-slot:top>
          <v-toolbar flat class="bg-background">
            <v-toolbar-title class="d-flex align-center">
              <v-icon
                color="medium-emphasis"
                icon="mdi-book-multiple"
                size="x-small"
                start
              ></v-icon>
              Daftar Data Laporan Bug
            </v-toolbar-title>
            <v-divider vertical></v-divider>
            <span class="px-2"
              >Total data yang ingin dihapus: {{ pagination.selected.length }}</span
            >
            <v-btn
              icon="mdi-delete-sweep"
              :disabled="pagination.selected.length === 0"
              @click="handleRemove(pagination.selected)"
            />
          </v-toolbar>
        </template>

        <template v-slot:thead>
          <tr>
            <td colspan="2">
              <v-text-field
                v-model="filters.company"
                class="ma-2"
                density="compact"
                placeholder="Cari nama perusahaan"
                hide-details
                variant="outlined"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="filters.title"
                class="ma-2"
                density="compact"
                placeholder="Cari nama departemen"
                hide-details
                variant="outlined"
              ></v-text-field>
            </td>
            <td>
              <v-switch
                v-model="filters.status"
                :label="`Status: ${filters.status.toString()}`"
                hide-details
                inset
                color="primary"
              ></v-switch>
            </td>
            <td>
              <v-date-input
                v-model="filters.createdAt"
                label="Cari dgn tgl dibuat"
                variant="outlined"
                density="compact"
                class="mt-6 px-2"
                clearable
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
              />
            </td>
            <td>
              <v-date-input
                v-model="filters.updatedAt"
                label="Cari dgn tgl diperbaharui"
                variant="outlined"
                density="compact"
                class="mt-6 px-2"
                clearable
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
              />
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
            <v-icon
              color="medium-emphasis"
              icon="mdi-information"
              size="small"
              @click="loadFormData(item.id, 'show')"
              v-if="permissionCheck('view_bug::report')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-pencil"
              size="small"
              @click="loadFormData(item.id, 'form')"
              v-if="permissionCheck('update_bug::report')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-delete"
              size="small"
              @click="handleRemove(item.id)"
              v-if="permissionCheck('delete_bug::report')"
            />
          </div>
        </template>
      </v-data-table-server>
    </v-card>
    <!-- Dialogs for Confirmation, Form, and Show -->
    <div class="text-center pa-4">
      <v-dialog v-model="formState.dialog.show" :max-width="formState.dialog.maxwidth" persistent>
        <CardDialogConfirmation
          v-if="formState.dialog.variant === 'confirmation'"
          icon="mdi-alert"
          title="Konfirmasi Penghapusan"
          text="Apakah Anda yakin ingin menghapus item ini, ketika data ini dihapus maka sistem akan menghapus data departemen, posisi, level, pengguna, dan beberapa data yang terkait dengan data ini, dan data yang telah terhapus tidak dapat dikembalikan! Apakah anda yakin?"
          cancelText="Batal"
          confirmText="Ya, Hapus"
          @cancel="handleCancelRemove"
          @confirm="handleConfirmRemove"
        />

        <FormSubmit
          v-if="formState.dialog.variant === 'form'"
          :data="formState.formData"
          :title="formState.isEdit ? 'Edit Level' : 'Tambah Level'"
          :cancelText="'Batal'"
          :confirmText="formState.isEdit ? 'Perbarui' : 'Simpan'"
          :selectItemCompany="formState.selectItemCompany"
          :selectItemDepartement="formState.selectItemDepartement"
          @cancel="handleCancelForm"
          @confirm="handleSubmitForm"
          :id="formState.idData"
        />

        <DataShow
          v-if="formState.dialog.variant === 'show'"
          icon="mdi-information"
          :data="formState.formData"
          cancelText="Tutup"
          @cancel="handleCancelForm"
          :loading="store.isLoading.show"
        />
      </v-dialog>
    </div>
  </CrudLayout>
</template>
