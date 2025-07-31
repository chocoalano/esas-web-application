import { useListTmpStore } from "@/stores/pengaturan/peran/tmp"
import dayjs from "dayjs"
import { debounce } from "lodash"
import { reactive, ref, watch } from "vue"
import { useToast } from "vue-toast-notification"

export function useTmp() {
  const store = useListTmpStore()
  const toast = useToast()
  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  })

  const filters = reactive({
    name: '',
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
      toast.error('❌ Error loading data:', error)
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

  const HANDLE_RESTORE_ACTION = async (id) => {
    await store.POST_RESTORE(id)
    LOAD_ITEMS()
  }
  const HANDLE_REMOVE_ACTION = async (id) => {
    await store.FORCE_DELETE(id)
    LOAD_ITEMS()
  }

  const HANDLE_DATERANGE_CHANGE = (dateRange) => {
    filters.start = dateRange.startDate
    filters.end = dateRange.endDate
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
    HANDLE_RESTORE_ACTION,
    HANDLE_REMOVE_ACTION,
  }
}
