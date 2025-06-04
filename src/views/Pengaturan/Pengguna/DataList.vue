<script setup>
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import {
  usePermissionCheck,
  useAppDebug,
  useAssetUrl,
  useAssetDirectory,
  useAssetDefaultImg,
} from '@/composables/useApp'
import dayjs from 'dayjs'
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue'
import FormSubmit from './FormSubmit.vue'
import DataShow from './DataShow.vue'
import { usePengguna } from './usePengguna'

const { permissionCheck } = usePermissionCheck()
const appDebug = useAppDebug()
const assetUrl = useAssetUrl()
const assetDirectory = useAssetDirectory()
const assetDefaultImg = useAssetDefaultImg()
const {
  store,
  filters,
  pagination,
  tableOptions,
  formState,
  alertState,
  formErrors,
  onDepartemenChange,
  onPositionChange,
  onCompanyChange,
  handleDateRangeChange,
  handleBtnChange,
  handleTableOptions,
  handleCancelForm,
  handleSubmitForm,
  loadFormData,
  handleRemove,
  handleConfirmRemove,
  handleCancelRemove,
  resetFilters,
  handleReset,
  handleCancelReset,
  handleConfirmReset,
  handleResetPass,
  handleCancelResetPass,
  handleConfirmResetPass,
} = usePengguna()
</script>

<template>
  <CrudLayout :permission="[
    'view_any_user',
    'view_any_user',
    'create_user',
    'view_any_user',
    'export_user',
    'view_any_user',
  ]" @date-range-changed="handleDateRangeChange" @btn-changed="handleBtnChange">
    <v-alert v-model="alertState.show" :color="alertState.type" :title="alertState.title" density="compact" theme="dark"
      :icon="alertState.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-close-circle-multiple'
        " class="mb-5">
      {{ alertState.message }}
    </v-alert>
    <v-card class="border border-thin" elevation="0">
      <v-data-table-server v-model="pagination.selected" :headers="store.headers" :items="pagination.serverItems"
        :items-length="pagination.totalItems" :loading="store.isLoading.list" item-value="id"
        :search="pagination.search" :items-per-page-options="[10, 20, 30, 40, 50]"
        :items-per-page="tableOptions.itemsPerPage" :page="tableOptions.page" :sort-by="tableOptions.sortBy"
        @update:options="handleTableOptions" density="compact" show-select>
        <template #loading>
          <v-skeleton-loader type="table" />
        </template>

        <template v-slot:top>
          <v-toolbar flat class="bg-background">
            <v-toolbar-title class="d-flex align-center">
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
              Daftar Data Pengguna
            </v-toolbar-title>
            <v-divider vertical></v-divider>
            <span class="px-2">Total data yang ingin dihapus: {{ pagination.selected.length }}</span>
            <v-btn icon="mdi-delete-sweep" :disabled="pagination.selected.length === 0"
              @click="handleRemove(pagination.selected)" />
          </v-toolbar>
        </template>

        <template v-slot:thead>
          <tr>
            <td colspan="3">
              <v-select v-model="filters.company" :items="formState.selectItemCompany" item-title="name" item-value="id"
                class="mt-6 ml-2" density="compact" variant="outlined" @update:modelValue="onCompanyChange"></v-select>
            </td>
            <td>
              <v-select v-model="filters.departemen" :items="formState.selectItemDepartement" item-title="name"
                item-value="id" class="mt-6 ml-2" density="compact" variant="outlined"
                @update:modelValue="onDepartemenChange(filters.company, filters.departemen)"></v-select>
            </td>
            <td>
              <v-select v-model="filters.position" :items="formState.selectItemPosition" item-title="name"
                item-value="id" class="mt-6 ml-2" density="compact" variant="outlined"
                @update:modelValue="onPositionChange(filters.company, filters.departemen)"></v-select>
            </td>
            <td>
              <v-select v-model="filters.level" :items="formState.selectItemLevel" item-title="name" item-value="id"
                class="mt-6 ml-2" density="compact" variant="outlined"></v-select>
            </td>
            <td>
              <v-text-field v-model="filters.nip" class="ma-2" density="compact" placeholder="Cari NIP" hide-details
                variant="outlined"></v-text-field>
            </td>
            <td>
              <v-text-field v-model="filters.name" class="ma-2" density="compact" placeholder="Cari nama" hide-details
                variant="outlined"></v-text-field>
            </td>
            <td>
              <v-text-field v-model="filters.email" class="ma-2" density="compact" placeholder="Cari email" hide-details
                variant="outlined"></v-text-field>
            </td>
            <td>
              <v-select v-model="filters.status" class="mt-6" density="compact"
                :items="['active', 'inactive', 'resign']" variant="outlined"></v-select>
            </td>
            <td>
              <v-btn icon="mdi-close-circle-multiple-outline" color="error" flat class="mx-5" @click="resetFilters" />
            </td>
          </tr>
        </template>

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

        <template #[`item.actions`]="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-icon color="medium-emphasis" icon="mdi-cellphone-information" size="small" @click="handleReset(item.id)"
              v-if="permissionCheck('view_user')" />
            <v-icon color="medium-emphasis" icon="mdi-shield-lock" size="small" @click="handleResetPass(item.id)"
              v-if="permissionCheck('view_user')" />
            <v-icon color="medium-emphasis" icon="mdi-information" size="small" @click="loadFormData(item.id, 'show')"
              v-if="permissionCheck('view_user')" />
            <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="loadFormData(item.id, 'form')"
              v-if="permissionCheck('update_user')" />
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="handleRemove(item.id)"
              v-if="permissionCheck('delete_company')" />
          </div>
        </template>
      </v-data-table-server>
    </v-card>
    <!-- Dialogs for Confirmation, Form, and Show -->
    <div class="text-center pa-4">
      <v-dialog v-model="formState.dialog.show" :max-width="formState.dialog.maxwidth" persistent>
        <CardDialogConfirmation v-if="formState.dialog.variant === 'confirmation'" icon="mdi-alert"
          title="Konfirmasi Penghapusan"
          text="Apakah Anda yakin ingin menghapus item ini, ketika data ini dihapus maka sistem akan menghapus data departemen, posisi, level, pengguna, dan beberapa data yang terkait dengan data ini, dan data yang telah terhapus tidak dapat dikembalikan! Apakah anda yakin?"
          cancelText="Batal" confirmText="Ya, Hapus" @cancel="handleCancelRemove" @confirm="handleConfirmRemove" />

        <CardDialogConfirmation v-if="formState.dialog.variant === 'confirmation-reset'" icon="mdi-alert"
          title="Konfirmasi Reset PhoneID"
          text="Apakah Anda yakin ingin Reset PhoneID item ini, ketika data ini direset maka sistem akan mereset data PhoneID tersebut, dan data yang telah ter-reset tidak dapat dikembalikan! Apakah anda yakin?"
          cancelText="Batal" confirmText="Ya, Reset" @cancel="handleCancelReset" @confirm="handleConfirmReset" />

        <CardDialogConfirmation v-if="formState.dialog.variant === 'confirmation-reset-password'" icon="mdi-alert"
          title="Konfirmasi Reset Password"
          text="Apakah Anda yakin ingin Reset Password item ini, ketika data ini direset maka sistem akan mereset data Password tersebut dengan merubah password menjadi NIP item ini sebagai password default, dan data yang telah ter-reset tidak dapat dikembalikan! Apakah anda yakin?"
          cancelText="Batal" confirmText="Ya, Reset" @cancel="handleCancelResetPass"
          @confirm="handleConfirmResetPass" />

        <FormSubmit v-if="formState.dialog.variant === 'form'" :key="formState.idData" :data="formState.formData"
          :title="formState.isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'" :cancelText="'Batal'"
          :confirmText="formState.isEdit ? 'Perbarui' : 'Simpan'" :selectItemCompany="formState.selectItemCompany"
          :selectItemDepartement="formState.selectItemDepartement" :selectItemPosition="formState.selectItemPosition"
          :selectItemLevel="formState.selectItemLevel" :selectItemLine="formState.selectItemLine"
          :selectItemMngr="formState.selectItemMngr" @cancel="handleCancelForm" @confirm="handleSubmitForm"
          :id="formState.idData" :error="formErrors" />

        <DataShow v-if="formState.dialog.variant === 'show'" icon="mdi-information" :data="formState.formData"
          title="Informasi data pengguna" text="Berikut adalah detail data pengguna yang anda pilih." cancelText="Tutup"
          @cancel="handleCancelForm" :loading="store.isLoading.show" />
      </v-dialog>
    </div>
  </CrudLayout>
</template>
