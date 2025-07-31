import { useListStore } from "@/stores/aplikasi/izin/list"
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
    typePermitOptions: [],
  })

  const filters = reactive({
    permit_type: '',
    permit_numbers: '',
    workday: '',
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

  const form_approval_loading = ref(false)
  const form_approval = ref({
    user_approve: '',
    notes: '',
  })

  const resetFilters = () => {
    filters.name = '';
    filters.radius = null; // Reset ke null
    filters.start = null;
    filters.end = null;
    filters.createdAt = null;
    filters.updatedAt = null;
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
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan yang tidak diketahui.'
      toast.error(`Gagal memuat data, pesan kesalahan : ${message}`)
    } finally {
      store.isLoading.list = false
    }
  }

  watch(
    () => [
      filters.name,
      filters.radius,
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

  const APPROVAL_ACTION = async (id, act) => {
    form_approval_loading.value = true

    try {
      form_approval.value.user_approve = act

      const response = await store.APPROVAL(id, form_approval.value)
      const message = response?.data || 'Keputusan berhasil diproses.'

      toast.success(`Approval berhasil: ${message}`)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan yang tidak diketahui.'

      toast.error(
        `Gagal melakukan approval. Kemungkinan Anda tidak memiliki izin. Pesan: ${message}`
      )
    } finally {
      form_approval_loading.value = false
    }
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
      link.download = 'izin.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan yang tidak diketahui.'
      toast.error(`Gagal mendownload Excel, pesan kesalahan : ${message}`)
    }
  }

  const PRINT_ACTION = async () => {
    try {
      const response = await store.PRINT_ACTION(filters)
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'izin.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan yang tidak diketahui.'
      toast.error(`Gagal mendownload PDF, pesan kesalahan : ${message}`)
    }
  }

  return {
    store,
    filter_options,
    filters,
    pagination,
    tableOptions,
    form_approval_loading,
    form_approval,
    resetFilters,
    HANDLE_TABLE_OPTIONS,
    HANDLE_DATERANGE_CHANGE,
    LOAD_ITEMS,
    HANDLE_REMOVE_ACTION,
    EXPORT_ACTION,
    PRINT_ACTION,
    APPROVAL_ACTION,
  }
}
