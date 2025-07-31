import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const usePenggunaListTmpStore = defineStore('penggunaTmp', () => {
  const headers = computed(() => [
    { title: 'Perusahaan', align: 'start', sortable: true, key: 'company.name' },
    { title: 'Departemen', align: 'start', sortable: true, key: 'employee.departement.name' },
    { title: 'Posisi', align: 'start', sortable: true, key: 'employee.job_position.name' },
    { title: 'Level', align: 'start', sortable: true, key: 'employee.job_level.name' },
    { title: 'NIP', align: 'start', sortable: true, key: 'nip' },
    { title: 'Nama', align: 'start', sortable: true, key: 'name' },
    { title: 'Mail', align: 'start', sortable: true, key: 'email' },
    { title: 'Status', align: 'start', sortable: false, key: 'status' },
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
    return api.get('/general-module/users/deleted', {
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
    return api.get('/general-module/users/filter-paginate', {
      params: { company_id, dept_id, post_id, lvl_id },
    })
      .then(({ data }) => data)
      .catch((error) => {
        console.error('Gagal mengambil data filter:', error)
        throw error
      })
      .finally(() => (isLoading.value.list = false))
  }

  const POST_RESTORE = (id) => {
    isLoading.value.list = true

    return api.post(`/general-module/users/${id}/restore`)
      .then(({ status, data }) => {
        const success = status === 200
        openSnackbar(success, success
          ? 'Data berhasil direstore.'
          : 'Gagal merestore data.')
        return data
      })
      .catch((error) => {
        openSnackbar(false, `Gagal merestore data: ${error.message || error}`)
        console.error('Gagal melakukan restore data:', error)
        throw error
      })
      .finally(() => {
        isLoading.value.list = false
      })
  }

  const FORCE_DELETE = (id) => {
    isLoading.value.list = true

    return api.delete(`/general-module/users/${id}/force`)
      .then(({ status, data }) => {
        const success = status === 200
        openSnackbar(success, success
          ? 'Data berhasil melakukan force delete.'
          : 'Gagal force delete data.')
        return data
      })
      .catch((error) => {
        openSnackbar(false, `Gagal force delete data: ${error.message || error}`)
        console.error('Gagal melakukan force delete data:', error)
        throw error
      })
      .finally(() => {
        isLoading.value.list = false
      })
  }

  return {
    headers,
    isLoading,
    snackbarState,
    GET_LIST_PAGINATE,
    GET_FILTER_PAGINATE,
    POST_RESTORE,
    FORCE_DELETE,
  }
})
