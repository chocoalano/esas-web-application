import { usePenggunaListTmpStore } from "@/stores/pengaturan/pengguna/tmp"
import dayjs from "dayjs"
import { debounce } from "lodash"
import { onMounted, reactive, ref, watch } from "vue"
import { useToast } from "vue-toast-notification"

export function useTmpList() {
  const store = usePenggunaListTmpStore()
  const toast = useToast()
  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  })

  const filters_options = ref({
    selectItemCompany: [],
    selectItemDepartement: [],
    selectItemPosition: [],
    selectItemLevel: [],
    selectItemUser: [],
  })

  const filters = reactive({
    company: '',
    departemen: '',
    position: '',
    level: '',
    nip: '',
    name: '',
    email: '',
    status: '',
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
      filters.company,
      filters.departemen,
      filters.position,
      filters.level,
      filters.nip,
      filters.name,
      filters.email,
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

  const GET_FILTER = async () => {
    const response = await store.GET_FILTER_PAGINATE(
      filters.company,
      filters.departemen,
      filters.position,
      filters.level
    )
    filters_options.value.selectItemCompany = response.companies
    filters_options.value.selectItemDepartement = response.departements
    filters_options.value.selectItemPosition = response.positions
    filters_options.value.selectItemLevel = response.levels
    filters_options.value.selectItemUser = response.users
  }

  const ON_COMPANY_CHANGE = async () => {
    GET_FILTER()
  }
  const ON_DEPT_CHANGE = async () => {
    GET_FILTER()
  }
  const ON_POST_CHANGE = async () => {
    GET_FILTER()
  }

  const HANDLE_RESTORE = async (id) => {
    await store.POST_RESTORE(id)
    LOAD_ITEMS()
  }
  const HANDLE_FORCE_DELETE = async (id) => {
    await store.FORCE_DELETE(id)
    LOAD_ITEMS()
  }

  const RESET_FILTER_ACTION = () => {
    Object.keys(filters).forEach((key) => {
      filters[key] = typeof filters[key] === 'string' ? '' : null
    })
  }

  onMounted(async () => {
    GET_FILTER()
  })

  return {
    store,
    filters,
    pagination,
    tableOptions,
    filters_options,
    HANDLE_TABLE_OPTIONS,
    LOAD_ITEMS,
    ON_COMPANY_CHANGE,
    ON_DEPT_CHANGE,
    ON_POST_CHANGE,
    RESET_FILTER_ACTION,
    HANDLE_RESTORE,
    HANDLE_FORCE_DELETE
  }
}
