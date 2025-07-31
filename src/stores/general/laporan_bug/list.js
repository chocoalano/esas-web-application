import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useListStore = defineStore('laporanBugList', () => {
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: true, key: "company.name" },
    { title: "Nama Judul", align: "start", sortable: true, key: "title" },
    { title: "Status", align: "start", sortable: true, key: "status" },
    { title: "Waktu Dibuat", align: "end", sortable: true, key: "created_at" },
    { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "updated_at" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({ list: false, show: false, add: false, update: false, delete: false })

  const GET_LIST_PAGINATE = ({ page = 1, itemsPerPage = 10, sortBy, search }) => {
    isLoading.value.list = true
    return api.get('/general-module/bug-reports', {
      params: { page, limit: itemsPerPage, sortBy, search },
    })
      .then(({ data }) => data)
      .catch((error) => {
        console.error('Gagal mengambil data user:', error)
        throw error
      })
      .finally(() => (isLoading.value.list = false))
  }

  const GET_FILTER_PAGINATE = (company_id, dept_id, post_id, lvl_id) => {
    isLoading.value.list = true
    return api.get('/general-module/bug-reports/filter-paginate', {
      params: { company_id, dept_id, post_id, lvl_id },
    })
      .then(({ data }) => data)
      .catch((error) => {
        console.error('Gagal mengambil data filter:', error)
        throw error
      })
      .finally(() => (isLoading.value.list = false))
  }

  // Fungsi untuk print data perusahaan
  async function PRINT_ACTION(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/general-module/bug-reports/print`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data perusahaan
  async function EXPORT_ACTION(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/general-module/bug-reports/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  async function DELETE_ACTION(id) {
    isLoading.value.delete = true;
    try {
      const { status, data } = await api.delete(`/general-module/bug-reports/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data pengguna:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  return {
    headers,
    isLoading,
    GET_LIST_PAGINATE,
    GET_FILTER_PAGINATE,
    DELETE_ACTION,
    PRINT_ACTION,
    EXPORT_ACTION
  }
})
