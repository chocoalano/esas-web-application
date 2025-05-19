import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useLaporanBugStore = defineStore('laporanBug', () => {
  // Headers bersifat statis, jadi bisa didefinisikan dengan computed untuk kemudahan akses
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: true, key: "company.name" },
    { title: "Nama Judul", align: "start", sortable: true, key: "title" },
    { title: "Status", align: "start", sortable: true, key: "status" },
    { title: "Waktu Dibuat", align: "end", sortable: true, key: "created_at" },
    { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "updated_at" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({
    list: false,
    show: false,
    add: false,
    update: false,
    delete: false
  });

  // Fungsi untuk mengambil data laporan bug dengan pagination
  async function apiListPaginate({ page = 1, itemsPerPage = 10, sortBy, search }) {
    isLoading.value.list = true;

    try {
      const { data } = await api.get('/web-api/laporan-bug', {
        params: { page, limit: itemsPerPage, sortBy, search }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data laporan bug:', error);
      throw error; // Melempar error agar bisa ditangani di luar
    } finally {
      isLoading.value.list = false;
    }
  }

  // Fungsi untuk mengambil detail perusahaan
  async function apiGetShow(id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/laporan-bug/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data laporan bug:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk menambah data laporan bug dengan form
  async function apiPostAdd(form) {
    isLoading.value.add = true;
    const t = toRaw(form)
    const formData = new FormData();
    formData.append('title', t.title);
    formData.append('status', t.status);
    formData.append('message', t.message);
    formData.append('platform', t.platform);
    formData.append('image', t.image);
    try {
      const { data } = await api.post('/web-api/laporan-bug', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menambah data laporan bug:', error);
      throw error;
    } finally {
      isLoading.value.add = false;
    }
  }

  // Fungsi untuk memperbaharui data laporan bug dengan form
  async function apiPutUpdate(form, id) {
    isLoading.value.update = true;
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', form.title);
    formData.append('status', form.status);
    formData.append('status', form.status);
    formData.append('message', form.message);
    formData.append('platform', form.platform);
    formData.append('image', form.image);
    if (typeof formData.image === 'string') {
      formData.delete('image') // jangan dikirim ke API
    }
    try {
      const { data } = await api.post(`/web-api/laporan-bug/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal memperbaharui data laporan bug:', error);
      throw error;
    } finally {
      isLoading.value.update = false;
    }
  }

  // Fungsi untuk menghapus data laporan bug
  async function apiDelete(id) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.delete(`/web-api/laporan-bug/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data laporan bug:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk print data laporan bug
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/laporan-bug/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data laporan bug:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data laporan bug
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/laporan-bug/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data laporan bug:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  return {
    headers,
    isLoading,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiDelete,
    apiDownloadPrint,
    apiExport
  }
})
