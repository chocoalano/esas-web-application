import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const usePengumumanStore = defineStore('pengumuman', () => {
  // Headers bersifat statis, jadi bisa didefinisikan dengan computed untuk kemudahan akses
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: true, key: "company.name" },
    { title: "Judul", align: "start", sortable: true, key: "title" },
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

  async function apiGetCompany() {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/kelengkapan-form/all-company`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data comapny:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk mengambil data pengumuman dengan pagination
  async function apiListPaginate({ page = 1, itemsPerPage = 10, sortBy, search }) {
    isLoading.value.list = true;

    try {
      const { data } = await api.get('/web-api/pengumuman', {
        params: { page, limit: itemsPerPage, sortBy, search }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data pengumuman:', error);
      throw error; // Melempar error agar bisa ditangani di luar
    } finally {
      isLoading.value.list = false;
    }
  }

  // Fungsi untuk mengambil detail perusahaan
  async function apiGetShow(id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/pengumuman/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data pengumuman:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk menambah data pengumuman dengan form
  async function apiPostAdd(form) {
    isLoading.value.add = true;
    try {
      const { data } = await api.post('/web-api/pengumuman', form)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menambah data pengumuman:', error);
      throw error;
    } finally {
      isLoading.value.add = false;
    }
  }

  // Fungsi untuk memperbaharui data pengumuman dengan form
  async function apiPutUpdate(form, id) {
    isLoading.value.update = true;
    try {
      const { data } = await api.put(`/web-api/pengumuman/${id}`, form)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal memperbaharui data pengumuman:', error);
      throw error;
    } finally {
      isLoading.value.update = false;
    }
  }

  // Fungsi untuk menghapus data pengumuman
  async function apiDelete(id) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.delete(`/web-api/pengumuman/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data pengumuman:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk print data pengumuman
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/pengumuman/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data pengumuman:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data pengumuman
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/pengumuman/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data pengumuman:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  return {
    headers,
    isLoading,
    apiGetCompany,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiDelete,
    apiDownloadPrint,
    apiExport
  }
})
