import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const usePeranStore = defineStore('peran', () => {
  // Headers bersifat statis, jadi bisa didefinisikan dengan computed untuk kemudahan akses
  const headers = computed(() => [
    { title: "Nama Level", align: "start", sortable: true, key: "name" },
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

  async function fetchData(endpoint, params = {}, type = 'show') {
    isLoading.value[type] = true
    try {
      const { data } = await api.get(endpoint, { params })
      return data
    } catch (error) {
      console.error(`Gagal mengambil data dari ${endpoint}:`, error)
      throw error
    } finally {
      isLoading.value[type] = false
    }
  }

  const apiGetPeran = () => fetchData('/web-api/kelengkapan-form/all-roles')
  const apiGetUser = () => fetchData('/web-api/kelengkapan-form/all-user')

  // Fungsi untuk mengambil data peran dengan pagination
  async function apiListPaginate({ page = 1, itemsPerPage = 10, sortBy, search }) {
    isLoading.value.list = true;

    try {
      const { data } = await api.get('/web-api/peran', {
        params: { page, limit: itemsPerPage, sortBy, search }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data peran:', error);
      throw error; // Melempar error agar bisa ditangani di luar
    } finally {
      isLoading.value.list = false;
    }
  }

  // Fungsi untuk mengambil detail perusahaan
  async function apiGetShow(id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/peran/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data peran:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk menambah data peran dengan form
  async function apiPostAdd({ name, permission }) {
    isLoading.value.add = true;
    try {
      const { data } = await api.post('/web-api/peran', {
        name: name,
        permission: permission,
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menambah data peran:', error);
      throw error;
    } finally {
      isLoading.value.add = false;
    }
  }

  // Fungsi untuk memperbaharui data peran dengan form
  async function apiPutUpdate({ name, permission, user_ids }, id) {
    isLoading.value.update = true;
    try {
      const { data } = await api.put(`/web-api/peran/${id}`, {
        name: name,
        permission: permission,
        user_ids: user_ids,
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal memperbaharui data peran:', error);
      throw error;
    } finally {
      isLoading.value.update = false;
    }
  }

  // Fungsi untuk menghapus data peran
  async function apiDelete(id) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.delete(`/web-api/peran/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data peran:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk print data peran
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/peran/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data peran:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data peran
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/peran/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data peran:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  return {
    headers,
    isLoading,
    apiGetPeran,
    apiGetUser,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiDelete,
    apiDownloadPrint,
    apiExport
  }
})
