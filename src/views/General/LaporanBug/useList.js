import { useListStore } from "@/stores/general/laporan_bug/list"
import dayjs from "dayjs"
import { debounce } from "lodash"
import { reactive, ref, watch } from "vue"

export function useList() {
  const store = useListStore()

  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  })

  const filters = reactive({
    company: '',
    title: '',
    status: false,
    start: null,
    end: null,
    createdAt: null,
    updatedAt: null,
  })

  const tableOptions = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })

  const resetFilters = () => {
    filters.company = '',
      filters.title = '',
      filters.status = false,
      filters.start = null,
      filters.end = null,
      filters.createdAt = null,
      filters.updatedAt = null,
      // Setelah reset, muat ulang item
      LOAD_ITEMS();
  };

  const HANDLE_TABLE_OPTIONS = (options) => {
    tableOptions.value = { ...options }
    LOAD_ITEMS()
  }

  const LOAD_ITEMS = async () => {
    try {
      store.isLoading.list = true
      const sortBy = tableOptions.value.sortBy.length
        ? tableOptions.value.sortBy
        : [{ key: 'created_at', order: 'desc' }]
      const search = Object.fromEntries(
        Object.entries({
          ...filters,
          createdAt: filters.createdAt ? dayjs(filters.createdAt).format('YYYY-MM-DD') : null,
          updatedAt: filters.updatedAt ? dayjs(filters.updatedAt).format('YYYY-MM-DD') : null,
        }).filter(([val]) => val !== null && val !== ''),
      )
      const response = await store.GET_LIST_PAGINATE({
        page: tableOptions.value.page,
        itemsPerPage: tableOptions.value.itemsPerPage,
        sortBy,
        search,
      })
      pagination.serverItems = response.data
      pagination.totalItems = response.total
    } catch (error) {
      console.log(error);

      alert('❌ Error loading data:', error)
    } finally {
      store.isLoading.list = false
    }
  }

  watch(
    () => [
      filters.company,
      filters.title,
      filters.status,
      filters.start,
      filters.end,
      filters.createdAt,
      filters.updatedAt,
    ],
    debounce(() => {
      LOAD_ITEMS()
    }, 500),
  )

  const HANDLE_REMOVE_ACTION = async (id) => {
    await store.DELETE_ACTION(id)
    LOAD_ITEMS()
  }

  const HANDLE_DATERANGE_CHANGE = (dateRange) => {
    filters.start = dateRange.startDate
    filters.end = dateRange.endDate
  }

  const EXPORT_ACTION = async () => {
    try {
      const response = await store.apiExport(filters)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'users.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload Excel:', error)
    }
  }

  const PRINT_ACTION = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'users.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload PDF:', error)
    }
  }

  return {
    store,
    filters,
    pagination,
    tableOptions,
    resetFilters,
    HANDLE_TABLE_OPTIONS,
    HANDLE_DATERANGE_CHANGE,
    LOAD_ITEMS,
    HANDLE_REMOVE_ACTION,
    EXPORT_ACTION,
    PRINT_ACTION,
  }
}
