<script setup>
import CrudLayout from '@/components/Mains/CrudLayout.vue'
import { usePermissionCheck } from '@/composables/useApp'
import dayjs from 'dayjs'
import CardDialogConfirmation from '@/components/CardDialogConfirmation.vue'
import { useAbsensi } from './useAbsensi'

const { permissionCheck } = usePermissionCheck()
const {
  store,
  pagination,
  filters,
  dialog,
  selectCompany,
  selectDepartement,
  selectUser,
  handleTableOptions,
  handleBtnChange,
  handleDateRangeChange,
  handleEdit,
  handleShow,
  handleRemove,
  handleConfirmRemove,
  handleCancelRemove,
  onCompanyChange,
  onDepartemenChange,
} = useAbsensi()

function getColor(type) {
  if (type === 'face-device') return 'warning'
  else if (type === 'qrcode') return 'info'
  else if (type === 'face-geolocation') return 'primary'
  else return 'error'
}
</script>

<template>
  <CrudLayout
    :permission="[
      'view_any_user::attendance',
      'view_any_user::attendance',
      'create_user::attendance',
      'view_any_user::attendance',
      'export_user::attendance',
      'view_any_user::attendance',
    ]"
    @date-range-changed="handleDateRangeChange"
    @btn-changed="handleBtnChange"
  >
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
              <v-icon color="medium-emphasis" icon="mdi-fingerprint" size="x-small" start></v-icon>
              Daftar Data Absensi
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
                label="Pilih perusahaan"
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
                label="Pilih departement"
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
                label="Pilih user"
                v-model="filters.user_id"
                :items="selectUser"
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
                label="Pilih status masuk"
                v-model="filters.status_in"
                :items="['late', 'unlate', 'normal']"
                class="mt-6 ml-2"
                density="compact"
                variant="outlined"
              ></v-select>
            </td>
            <td colspan="2">
              <v-select
                label="Pilih status pulang"
                v-model="filters.status_out"
                :items="['late', 'unlate', 'normal']"
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
            <!-- <td>
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
            </td> -->
          </tr>
        </template>

        <template #[`item.type_in`]="{ item }">
          <v-chip
            v-if="item.type_in"
            :border="`${getColor(item.type_in)} thin opacity-25`"
            :color="getColor(item.type_in)"
            :text="item.type_in"
            size="x-small"
          ></v-chip>
          <div v-else>undefined</div>
        </template>
        <template #[`item.type_out`]="{ item }">
          <v-chip
            :border="`${getColor(item.type_out)} thin opacity-25`"
            :color="getColor(item.type_out)"
            :text="item.type_out ?? 'UNDEFINED'"
            size="x-small"
          ></v-chip>
        </template>

        <template #[`item.created_at`]="{ item }">
          {{ dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template>

        <!-- <template #[`item.updated_at`]="{ item }">
          {{ dayjs(item.updated_at).format('DD/MM/YYYY HH:mm:ss') }}
        </template> -->

        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="py-2">
              <v-sheet rounded="lg" border class="py-5 px-5">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-list lines="three">
                      <v-list-subheader>Detail User</v-list-subheader>
                      <v-divider></v-divider>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Nama perusahaan</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.user?.company?.name ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Nama departement</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.user?.employee?.departement?.name ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Posisi/Jabatan</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.user?.employee?.job_position?.name ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold">NIP</v-list-item-title>
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.user?.nip ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold">Nama</v-list-item-title>
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.user?.name ?? '-' }}
                      </v-list-item-subtitle>
                    </v-list>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-list lines="three">
                      <v-list-subheader>Detail Absensi</v-list-subheader>
                      <v-divider></v-divider>

                      <v-list-item-title class="mt-2 font-weight-bold">Jam Masuk</v-list-item-title>
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.time_in ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Jam Pulang</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.time_out ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Status masuk</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.status_in ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Status pulang</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.status_out ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Tech absen masuk</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.type_in ?? '-' }}
                      </v-list-item-subtitle>
                    </v-list>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-list lines="three">
                      <v-list-subheader>Detail Absensi</v-list-subheader>
                      <v-divider></v-divider>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Tech absen pulang</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.type_out ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Lat & Lng absen masuk</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.lat_in ?? '-' }} & {{ item?.long_in ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Lat & Lng absen pulang</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.lat_out ?? '-' }} & {{ item?.long_out ?? '-' }}
                      </v-list-item-subtitle>

                      <v-list-item-title class="mt-2 font-weight-bold"
                        >Jadwal kerja</v-list-item-title
                      >
                      <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                        {{ item?.schedule?.work_day ?? '-' }} |
                        {{ item?.schedule?.timework?.name ?? '-' }}
                      </v-list-item-subtitle>
                    </v-list>
                  </v-col>
                </v-row>
              </v-sheet>
            </td>
          </tr>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-icon
              color="medium-emphasis"
              icon="mdi-information"
              size="small"
              @click="handleShow(item.id)"
              v-if="permissionCheck('view_user::attendance')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-pencil"
              size="small"
              @click="handleEdit(item.id)"
              v-if="permissionCheck('update_user::attendance')"
            />
            <v-icon
              color="medium-emphasis"
              icon="mdi-delete"
              size="small"
              @click="handleRemove(item.id)"
              v-if="permissionCheck('delete_user::attendance')"
            />
          </div>
        </template>
      </v-data-table-server>
    </v-card>
    <!-- Dialogs for Confirmation, Form, and Show -->
    <div class="text-center pa-4">
      <v-dialog v-model="dialog.show" :max-width="dialog.maxwidth" persistent>
        <CardDialogConfirmation
          v-if="dialog.variant === 'confirmation'"
          icon="mdi-alert"
          title="Konfirmasi Penghapusan"
          text="Apakah Anda yakin ingin menghapus item ini, ketika data ini dihapus maka sistem akan menghapus data departemen, posisi, level, pengguna, dan beberapa data yang terkait dengan data ini, dan data yang telah terhapus tidak dapat dikembalikan! Apakah anda yakin?"
          cancelText="Batal"
          confirmText="Ya, Hapus"
          @cancel="handleCancelRemove"
          @confirm="handleConfirmRemove"
        />
      </v-dialog>
    </div>
  </CrudLayout>
</template>
