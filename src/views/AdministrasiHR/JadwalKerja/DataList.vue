<script setup>
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { usePermissionCheck } from '@/composables/useApp'
import dayjs from 'dayjs'
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue'
import FormSubmit from './FormSubmit.vue'
import DataShow from './DataShow.vue'
import { useJadwalKerja } from './useJadwalKerja'

const { permissionCheck } = usePermissionCheck()
const {
  store,
  pagination,
  filters,
  selectCompany,
  selectDepartement,
  selectTimework,
  selectUser,
  formState,
  alertState,
  onCompanyChange,
  onDepartemenChange,
  handlePagination,
  handleBtnChange,
  handleDateRangeChange,
  handleCancelForm,
  handleSubmitForm,
  loadFormData,
  handleRemove,
  handleConfirmRemove,
  handleCancelRemove,
} = useJadwalKerja()
</script>

<template>
  <CrudLayout
    :permission="[
      'view_any_user::timework::schedule',
      'view_any_user::timework::schedule',
      'create_user::timework::schedule',
      'view_any_user::timework::schedule',
      'export_user::timework::schedule',
      'view_any_user::timework::schedule',
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
        :items-per-page="pagination.itemsPerPage"
        :page="pagination.page"
        :sort-by="pagination.sortBy"
        @update:options="handlePagination"
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
              Daftar Data Jadwal Kerja
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
              <v-select
                v-model="filters.company_id"
                :items="selectCompany"
                item-title="name"
                item-value="id"
                class="mt-6 ml-2"
                density="compact"
                variant="outlined"
                @update:modelValue="onCompanyChange"
              ></v-select>
            </td>
            <td>
              <v-select
                v-model="filters.departement_id"
                :items="selectDepartement"
                item-title="name"
                item-value="id"
                class="mt-6 ml-2"
                density="compact"
                variant="outlined"
                @update:modelValue="onDepartemenChange(filters.company_id, filters.departement_id)"
              ></v-select>
            </td>
            <td colspan="2">
              <v-select
                v-model="filters.timework_id"
                :items="selectTimework"
                item-title="name"
                item-value="id"
                class="mt-6 ml-2"
                density="compact"
                variant="outlined"
              ></v-select>
            </td>
            <td colspan="2">
              <v-date-input
                v-model="filters.workday"
                label="Cari dgn tgl"
                variant="outlined"
                density="compact"
                class="mt-6 px-2"
                clearable
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
              ></v-date-input>
            </td>
            <td colspan="2">
              <v-select
                v-model="filters.user_id"
                :items="selectUser"
                item-title="name"
                item-value="id"
                class="mt-6 ml-2"
                density="compact"
                variant="outlined"
              ></v-select>
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
              v-if="permissionCheck('view_user::timework::schedule')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-delete"
              size="small"
              @click="handleRemove(item.id)"
              v-if="permissionCheck('delete_user::timework::schedule')"
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
