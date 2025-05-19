import { useDokumentasiStore } from '@/stores/dokumentasi'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'
import debounce from 'lodash/debounce'
import { useRouter } from 'vue-router'


export function useDokumentasi() {
  const router = useRouter()
  const store = useDokumentasiStore()

  // PAGINATION dan FILTER
  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  })

  const filters = reactive({
    title: '',
    subtitle: '',
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

  const dialog = ref({
    show: false,
    variant: null,
    maxwidth: 400,
  })

  const idData = ref(null)

  const loadItems = async () => {
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
        }).filter(([_, val]) => val !== null && val !== '')
      )

      const response = await store.apiListPaginate({
        page: tableOptions.value.page,
        itemsPerPage: tableOptions.value.itemsPerPage,
        sortBy,
        search,
      })

      pagination.serverItems = response.data.data
      pagination.totalItems = response.data.total
    } catch (error) {
      console.error('❌ Error loading data:', error)
    } finally {
      store.isLoading.list = false
    }
  }

  const handleTableOptions = (options) => {
    tableOptions.value = { ...options }
    loadItems()
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
    debounce(() => loadItems(), 500)
  )

  const handleDateRangeChange = (dateRange) => {
    filters.start = dateRange.startDate
    filters.end = dateRange.endDate
  }

  const handleBtnChange = (btn) => {
    switch (btn.btn) {
      case 'filter':
        break
      case 'refresh':
        loadItems()
        break
      case 'add':
        router.push({ name: 'adm.dokumentasi.create' })
        break
      case 'export':
        alert('fitur export tidak tersedia untuk fungsi ini!')
        break
      case 'print':
        alert('fitur print tidak tersedia untuk fungsi ini!')
        break
      default:
        console.log(btn.btn)
        break
    }
  }

  const printFunction = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'jenis-izin-report.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload PDF:', error)
    }
  }

  const openDialog = (variant) => {
    dialog.value.show = true
    dialog.value.variant = variant
    dialog.value.maxwidth = ['form', 'show'].includes(variant) ? 1080 : 400
  }

  const handleEdit = async (id) => {
    router.push({ name: 'adm.dokumentasi.edit', params: { id: id } })
  }
  const handleShow = async (id) => {
    router.push({ name: 'adm.dokumentasi.show', params: { id: id } })
  }

  const handleRemove = (id) => {
    idData.value = id
    openDialog('confirmation')
  }

  const handleConfirmRemove = async () => {
    try {
      let responses = []

      if (idData.value) {
        const response = await store.apiDelete(idData.value)
        responses.push(response)
      } else if (pagination.selected.length > 0) {
        responses = await Promise.all(pagination.selected.map(id => store.apiDelete(id)))
      } else {
        console.warn('❗ Tidak ada data yang dipilih untuk dihapus.')
        return
      }

      await loadItems()
    } catch (error) {
      console.error('❌ Gagal menghapus data:', error)
    } finally {
      dialog.value.show = false
      pagination.selected = []
      idData.value = null
    }
  }

  const handleCancelRemove = () => {
    pagination.selected = []
    idData.value = null
    dialog.value.show = false
  }

  return {
    store,
    pagination,
    filters,
    tableOptions,
    dialog,
    handleTableOptions,
    handleBtnChange,
    handleDateRangeChange,
    handleEdit,
    handleShow,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
  }
}
