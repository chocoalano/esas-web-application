import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useListTmpStore = defineStore('posisiTmp', () => {
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: true, key: "company.name" },
    { title: "Nama Departemen", align: "start", sortable: true, key: "departement.name" },
    { title: "Nama Level", align: "start", sortable: true, key: "name" },
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

  const GET_LIST_PAGINATE = ({ page = 1, itemsPerPage = 10, sortBy, search }) => {
    isLoading.value.list = true
    return api.get('/hris-module/job-positions/deleted', {
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
    return api.get('/hris-module/job-positions/filter-paginate', {
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

    return api.post(`/hris-module/job-positions/${id}/restore`)
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

    return api.delete(`/hris-module/job-positions/${id}/force`)
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
