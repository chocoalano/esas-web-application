<script setup>
import { useForm } from './useForm'; // Pastikan path ini benar

const {
  store,
  formRef,
  formData,
  handleConfirm,
  handleCancel,
  isEditMode,
  cancelText,
  icon,
  title,
  text,
  rules,
  addUserAll,
  minUserAll
} = useForm();
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text" class="border border-thin" elevation="0" rounded="xl">
    <v-form ref="formRef" @submit.prevent="handleConfirm">
      <v-card-text>
        <v-text-field v-model="formData.name" label="Nama Peran" placeholder="Masukkan nama peran" variant="outlined"
          density="compact" :rules="[rules.required]" required></v-text-field>
        <v-autocomplete v-model="formData.user_id" :items="store.userOptions" item-title="name" item-value="id"
          label="Pilih Pengguna" chips closable-chips multiple variant="outlined" density="compact" rounded="lg"
          append-icon="mdi-account-plus" prepend-icon="mdi-account-minus" @click:append="addUserAll"
          @click:prepend="minUserAll" clearable></v-autocomplete>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Lihat</th>
              <th class="text-left">Lihat Semua</th>
              <th class="text-left">Tambah</th>
              <th class="text-left">Perbaharui</th>
              <th class="text-left">Hapus</th>
              <th class="text-left">Hapus Semua</th>
              <th class="text-left">Paksa Hapus</th>
              <th class="text-left">Paksa Hapus Semua</th>
              <th class="text-left">Pulihkan</th>
              <th class="text-left">Expor</th>
              <th class="text-left">Impor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.permissionOptions" :key="item.name">
              <td>{{ item.name }}</td>
              <td v-for="i in item.action" :key="i.id">
                <v-switch v-model="formData.permission" hide-details inset color="primary" :value="i.id" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-text>
        <v-alert v-if="isEditMode" border="start" close-label="Tutup Peringatan" color="warning"
          title="Peringatan Penting: Data Berelasi!" variant="tonal">
          Data ini memiliki **keterkaitan erat dengan informasi lain dalam sistem**. Setiap
          perubahan, termasuk penggantian nama posisi, dapat **secara langsung memengaruhi
          data pengguna atau entitas lain yang terhubung**. Harap tinjau ulang konsekuensi
          sebelum melanjutkan pembaharuan.
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="handleCancel">
          {{ cancelText }}
        </v-btn>

        <v-btn color="primary" type="submit"> {{ isEditMode ? 'Perbarui' : 'Simpan' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
