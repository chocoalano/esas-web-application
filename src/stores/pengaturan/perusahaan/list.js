import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const usePerusahaanListStore = defineStore('perusahaan', () => {
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: true, key: "name" },
    { title: "Kordinat (Lat)", align: "end", sortable: true, key: "latitude" },
    { title: "Kordinat (Lng)", align: "end", sortable: true, key: "longitude" },
    { title: "Radius Absensi", align: "end", sortable: true, key: "radius" },
    { title: "Waktu Dibuat", align: "end", sortable: true, key: "created_at" },
    { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "updated_at" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const snackbarState = ref({
    show: false,
    status: false,
    msg: '',
  });

  const isLoading = ref({ list: false, show: false, add: false, update: false, delete: false })

  const openSnackbar = (status, msg) => {
    snackbarState.value.show = true;
    snackbarState.value.status = status;
    snackbarState.value.msg = msg;
  };
  const closeSnackbar = () => {
    snackbarState.value.show = false;
    snackbarState.value.status = null;
    snackbarState.value.msg = '';
  };

  const GET_LIST_PAGINATE = ({ page = 1, itemsPerPage = 10, sortBy, search }) => {
    isLoading.value.list = true
    return api.get('/general-module/companies', {
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
    return api.get('/general-module/companies/filter-paginate', {
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
      const { data } = await api.get(`/general-module/companies/print`, { params: filter, responseType: 'blob' })
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
      const { data } = await api.get(`/general-module/companies/export`, { params: filter, responseType: 'blob' })
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
      const { status, data } = await api.delete(`/general-module/companies/${id}`)
      openSnackbar(status === 200 ? true : false, status === 200 ? 'Data berhasil dihapus' : 'Data gagal dihapus')
      setTimeout(() => closeSnackbar(), 5000);
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      openSnackbar(false, `Gagal menghapus data pengguna: ${error}`)
      setTimeout(() => closeSnackbar(), 5000);
      console.error('Gagal menghapus data pengguna:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  return {
    headers,
    isLoading,
    snackbarState,
    GET_LIST_PAGINATE,
    GET_FILTER_PAGINATE,
    DELETE_ACTION,
    PRINT_ACTION,
    EXPORT_ACTION
  }
})
