import { useListStore } from "@/stores/aplikasi/absensi/list"
import dayjs from "dayjs"
import { debounce } from "lodash"
import { reactive, ref, watch } from "vue"
import { useToast } from "vue-toast-notification"

export function useList() {
  const store = useListStore()
  const toast = useToast()
  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  })

  const filter_options = reactive({
    companyOptions: [],
    deptOptions: [],
    userOptions: [],
    statusOptions: [],
  })

  const filters = reactive({
    company_id: null,
    departement_id: null,
    user_id: null,
    status_in: null,
    status_out: null,
    start: null,
    end: null,
    createdAt: null,
  })

  const tableOptions = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })

  const resetFilters = () => {
    filters.company_id = null;
    filters.departement_id = null;
    filters.user_id = null;
    filters.status_in = null;
    filters.status_out = null;
    filters.start = null;
    filters.end = null;
    filters.createdAt = null;
    // Setelah reset, muat ulang item
    LOAD_ITEMS();
  };

  const HANDLE_TABLE_OPTIONS = (options) => {
    tableOptions.value = { ...options }
    LOAD_ITEMS()
  }

  const GET_FILTER = async () => {
    const response = await store.GET_FILTER_PAGINATE(
      filters.company_id,
      filters.departement_id,
      filters.user_id,
      filters.status_in ?? filters.status_out
    )
    filter_options.companyOptions = response.form.company
    filter_options.deptOptions = response.form.dept
    filter_options.userOptions = response.form.user
    filter_options.statusOptions = response.form.status
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
      toast.error('Error loading data:', error)
    } finally {
      store.isLoading.list = false
    }
  }

  watch(
    () => [
      filters.company_id,
      filters.departement_id,
      filters.user_id,
      filters.status_in,
      filters.status_out,
      filters.start,
      filters.end,
      filters.createdAt,
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
      const response = await store.EXPORT_ACTION(filters)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'absensi.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Gagal mendownload Excel:', error)
    }
  }

  const GENERATE_REPORT_ACTION = async (filter_reports) => {
    try {
      const response = await store.EXPORT_REPORT_ACTION(filter_reports)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'absensi-reports.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Gagal mendownload Excel:', error)
    }
  }

  const PRINT_ACTION = async () => {
    try {
      const response = await store.PRINT_ACTION(filters)
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'absensi.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Gagal mendownload PDF:', error)
    }
  }

  return {
    store,
    filters,
    pagination,
    filter_options,
    tableOptions,
    resetFilters,
    HANDLE_TABLE_OPTIONS,
    HANDLE_DATERANGE_CHANGE,
    GET_FILTER,
    LOAD_ITEMS,
    HANDLE_REMOVE_ACTION,
    EXPORT_ACTION,
    PRINT_ACTION,
    GENERATE_REPORT_ACTION,
  }
}
