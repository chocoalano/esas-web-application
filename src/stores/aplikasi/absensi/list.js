import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useListStore = defineStore('absenList', () => {
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: false, key: "user.company.name" },
    { title: "Departement", align: "start", sortable: false, key: "user.employee.departement.name" },
    { title: "NIP", align: "start", sortable: true, key: "user.nip" },
    { title: "Nama", align: "start", sortable: true, key: "user.name" },
    { title: "Jam Masuk", align: "end", sortable: true, key: "time_in" },
    { title: "TD. Masuk", align: "end", sortable: false, key: "type_in" },
    { title: "Jam Pulang", align: "end", sortable: true, key: "time_out" },
    { title: "TD. Pulang", align: "end", sortable: false, key: "type_out" },
    { title: "Tgl Absensi", align: "end", sortable: true, key: "date_presence" },
    { title: "Waktu Dibuat", align: "end", sortable: true, key: "created_at" },
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
    return api.get('/hris-module/user-attendances', {
      params: { page, limit: itemsPerPage, sortBy, search },
    })
      .then(({ data }) => data)
      .catch((error) => {
        console.error('Gagal mengambil data user:', error)
        throw error
      })
      .finally(() => (isLoading.value.list = false))
  }

  const GET_FILTER_PAGINATE = (company_id, dept_id, user_id, status) => {
    isLoading.value.list = true
    return api.get('/hris-module/user-attendances/filter-paginate', {
      params: { company_id, dept_id, user_id, status },
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
      const { data } = await api.get(`/hris-module/user-attendances/print`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal generate data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data perusahaan
  async function EXPORT_ACTION(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/hris-module/user-attendances/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal generate data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  async function EXPORT_REPORT_ACTION(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/hris-module/user-attendances/report`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal generate data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  async function DELETE_ACTION(id) {
    isLoading.value.delete = true;
    try {
      const { status, data } = await api.delete(`/hris-module/user-attendances/${id}`)
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
    EXPORT_ACTION,
    EXPORT_REPORT_ACTION
  }
})
