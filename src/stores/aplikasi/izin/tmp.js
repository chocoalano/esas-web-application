import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useListTmpStore = defineStore('izinTmp', () => {
  const headers = computed(() => [
    { title: "Jenis Izin", align: "start", sortable: true, key: "permit_type.type" },
    { title: "ID Numbers", align: "start", sortable: true, key: "permit_numbers" },
    { title: "Nip", align: "start", sortable: true, key: "user.nip" },
    { title: "Nama", align: "start", sortable: true, key: "user.name" },
    { title: "Waktu kerja", align: "start", sortable: true, key: "user_timework_schedule.work_day" },
    { title: "Dari Tgl", align: "start", sortable: true, key: "start_date" },
    { title: "Sampai Tgl", align: "end", sortable: true, key: "end_date" },
    { title: "Dari Jam", align: "end", sortable: true, key: "start_time" },
    { title: "Sampai Jam", align: "end", sortable: true, key: "end_time" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({ list: false, show: false, add: false, update: false, delete: false })

  const GET_LIST_PAGINATE = ({ page = 1, itemsPerPage = 10, sortBy, search }) => {
    isLoading.value.list = true
    return api.get('/hris-module/permits/deleted', {
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
    return api.get('/hris-module/permits/filter-paginate', {
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

    return api.post(`/hris-module/permits/${id}/restore`)
      .then(({ status, data }) => {
        return data
      })
      .catch((error) => {
        throw error
      })
      .finally(() => {
        isLoading.value.list = false
      })
  }

  const FORCE_DELETE = (id) => {
    isLoading.value.list = true

    return api.delete(`/hris-module/permits/${id}/force`)
      .then(({ status }) => {
        return status
      })
      .catch((error) => {
        throw error
      })
      .finally(() => {
        isLoading.value.list = false
      })
  }

  return {
    headers,
    isLoading,
    GET_LIST_PAGINATE,
    GET_FILTER_PAGINATE,
    POST_RESTORE,
    FORCE_DELETE,
  }
})
