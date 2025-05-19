<script setup>
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { usePermissionCheck } from '@/composables/useApp'
import dayjs from 'dayjs'
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue'
import FormSubmit from './FormSubmit.vue'
import DataShow from './DataShow.vue'
import { useIzin } from './useIzin'
import CardDialogApprove from '@/components/CardDialogApprove.vue'

const { permissionCheck } = usePermissionCheck()
const {
  store,
  pagination,
  filters,
  formState,
  alertState,
  selectType,
  dialogApprove,
  attApprove,
  handleTableOptions,
  handleBtnChange,
  handleDateRangeChange,
  handleCancelForm,
  handleSubmitForm,
  show,
  edit,
  handleRemove,
  handleConfirmRemove,
  handleCancelRemove,
  approveLine,
  approveMngr,
  approveHr,
  handleCancelApproval,
  handleConfirmApproval,
  validate,
} = useIzin()
</script>

<template>
  <CrudLayout
    :permission="[
      'view_any_permit',
      'view_any_permit',
      'create_permit',
      'view_any_permit',
      'export_permit',
      'view_any_permit',
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
        @update:options="handleTableOptions"
        density="compact"
        show-select
        show-expand
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
              Daftar Data Izin
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
                v-model="filters.permit_type"
                :items="selectType"
                item-title="type"
                item-value="id"
                class="mt-6 ml-2"
                density="compact"
                variant="outlined"
              ></v-select>
            </td>
            <td colspan="4">
              <v-text-field
                v-model="filters.permit_numbers"
                class="ma-2"
                density="compact"
                placeholder="Cari dengan ID Numbers"
                hide-details
                variant="outlined"
              ></v-text-field>
            </td>
            <td colspan="2">
              <v-date-input
                v-model="filters.workday"
                label="Cari dgn tgl diajukan"
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
              icon="mdi-draw-pen"
              size="small"
              @click="approveLine(item.id, item.permit_type.type)"
              v-if="validate(item.approvals, 'line')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-draw-pen"
              size="small"
              @click="approveMngr(item.id, item.permit_type.type)"
              v-if="validate(item.approvals, 'manager')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-draw-pen"
              size="small"
              @click="approveHr(item.id, item.permit_type.type)"
              v-if="validate(item.approvals, 'hrga')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-information"
              size="small"
              @click="show(item.id, 'show')"
              v-if="permissionCheck('view_permit')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-pencil"
              size="small"
              @click="edit(item.id, 'form')"
              v-if="permissionCheck('update_permit')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-delete"
              size="small"
              @click="handleRemove(item.id)"
              v-if="permissionCheck('delete_permit')"
            />
          </div>
        </template>

        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="py-2">
              <v-sheet rounded="lg" border class="py-5 px-5">
                {{ item.notes }}
              </v-sheet>
            </td>
          </tr>
        </template>
      </v-data-table-server>
    </v-card>
    <!-- Dialogs for Confirmation, Form, and Show -->
    <div class="text-center pa-4">
      <v-dialog v-model="dialogApprove" max-width="800" persistent>
        <CardDialogApprove
          icon="mdi-alert"
          :title="`Konfirmasi Approval ${attApprove.type}`"
          :text="`Berikan hasil keputusan ${attApprove.step} untuk permintaan ini.`"
          :id="attApprove.id"
          :type="attApprove.type"
          :approve_type="attApprove.step"
          @cancel="handleCancelApproval"
          @confirm="handleConfirmApproval"
        />
      </v-dialog>
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
          title="Informasi data izin"
          text="Berikut adalah detail data izin yang anda pilih."
          cancelText="Tutup"
          @cancel="handleCancelForm"
          :loading="store.isLoading.show"
        />
      </v-dialog>
    </div>
  </CrudLayout>
</template>
