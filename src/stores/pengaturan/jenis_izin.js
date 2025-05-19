import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useJenisIzinStore = defineStore('jenis_izin', () => {
  // Headers bersifat statis, jadi bisa didefinisikan dengan computed untuk kemudahan akses
  const headers = computed(() => [
    { title: "Jenis Izin", align: "start", sortable: true, key: "type" },
    { title: "Dibayar", align: "start", sortable: true, key: "is_payed" },
    { title: "Izin Atasan", align: "start", sortable: true, key: "approve_line" },
    { title: "Izin Menejer", align: "start", sortable: true, key: "approve_manager" },
    { title: "Izin HR", align: "start", sortable: true, key: "approve_hr" },
    { title: "Sertakan File", align: "start", sortable: true, key: "with_file" },
    { title: "Tampilkan di mobile", align: "start", sortable: true, key: "show_mobile" },
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

  // Fungsi untuk mengambil data jenis-izin dengan pagination
  async function apiListPaginate({ page = 1, itemsPerPage = 10, sortBy, search }) {
    isLoading.value.list = true;

    try {
      const { data } = await api.get('/web-api/jenis-izin', {
        params: { page, limit: itemsPerPage, sortBy, search }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data jenis-izin:', error);
      throw error; // Melempar error agar bisa ditangani di luar
    } finally {
      isLoading.value.list = false;
    }
  }

  // Fungsi untuk mengambil detail perusahaan
  async function apiGetShow(id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/jenis-izin/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data jenis-izin:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk menambah data jenis-izin dengan form
  async function apiPostAdd({ type, is_payed, approve_line, approve_manager, approve_hr, with_file, show_mobile }) {
    isLoading.value.add = true;
    try {
      const { data } = await api.post('/web-api/jenis-izin', {
        type,
        is_payed,
        approve_line,
        approve_manager,
        approve_hr,
        with_file,
        show_mobile
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menambah data jenis-izin:', error);
      throw error;
    } finally {
      isLoading.value.add = false;
    }
  }

  // Fungsi untuk memperbaharui data jenis-izin dengan form
  async function apiPutUpdate({ type, is_payed, approve_line, approve_manager, approve_hr, with_file, show_mobile }, id) {
    isLoading.value.update = true;
    try {
      const { data } = await api.put(`/web-api/jenis-izin/${id}`, {
        type,
        is_payed,
        approve_line,
        approve_manager,
        approve_hr,
        with_file,
        show_mobile
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal memperbaharui data jenis-izin:', error);
      throw error;
    } finally {
      isLoading.value.update = false;
    }
  }

  // Fungsi untuk menghapus data jenis-izin
  async function apiDelete(id) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.delete(`/web-api/jenis-izin/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data jenis-izin:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk print data jenis-izin
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/jenis-izin/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data jenis-izin:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data jenis-izin
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/jenis-izin/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data jenis-izin:', error);
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
