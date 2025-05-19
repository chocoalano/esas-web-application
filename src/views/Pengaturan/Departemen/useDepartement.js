import { useDepartemenStore } from '@/stores/pengaturan/departemen'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'
import debounce from 'lodash/debounce'


export function useDepartemen() {
  const store = useDepartemenStore()

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
    name: '',
    company: '',
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

  const datashow = ref({
    company_id: '',
    name: '',
    company: {
      name: '',
    },
    job_positions: [],
    job_levels: [],
    employees: [],
  })
  const alertState = ref({
    show: false,
    title: '',
    message: '',
    type: 'error',
  })

  // State for form and dialog management
  const formState = ref({
    isEdit: false,
    idData: null,
    selectItem: [],
    formData: {
      company_id: null,
      name: '',
    },
    dialog: {
      show: false,
      variant: null,
      maxwidth: 400,
    },
  })

  const loadItems = async () => {
    try {
      store.isLoading.list = true

      const sortBy = tableOptions.value.sortBy.length
        ? tableOptions.value.sortBy
        : [{ key: 'created_at', order: 'desc' }]
      // Bersihkan filter yang nilainya kosong atau null
      const search = Object.fromEntries(
        Object.entries({
          ...filters,
          createdAt: filters.createdAt ? dayjs(filters.createdAt).format('YYYY-MM-DD') : null,
          updatedAt: filters.updatedAt ? dayjs(filters.updatedAt).format('YYYY-MM-DD') : null,
        }).filter(([val]) => val !== null && val !== ''),
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

  // HANDLE update dari table
  const handleTableOptions = (options) => {
    tableOptions.value = { ...options }
    loadItems()
  }

  // WATCH FILTERS (pakai debounce)
  watch(
    () => [
      filters.name,
      filters.company,
      filters.start,
      filters.end,
      filters.createdAt,
      filters.updatedAt,
    ],
    debounce(() => {
      loadItems()
    }, 500),
  )

  // Handle date range change
  const handleDateRangeChange = (dateRange) => {
    filters.start = dateRange.startDate
    filters.end = dateRange.endDate
  }

  // Handle button actions (filter, refresh, add, etc.)
  const handleBtnChange = (btn) => {
    switch (btn.btn) {
      case 'filter':
        loadItems()
        break
      case 'refresh':
        loadItems()
        break
      case 'add':
        add()
        openDialog('form')
        break
      case 'export':
        exportFunction()
        break
      case 'print':
        printFunction()
        break
      default:
        console.log(btn.btn)
        break
    }
  }
  const add = async () => {
    const response = await store.apiGetShow(1)
    formState.value.selectItem = response.data.select_company
  }

  // function download for data company with filter
  const printFunction = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
      // Pastikan response berupa Blob
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'company-report.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload PDF:', error)
    }
  }

  // function download for data company with filter
  const exportFunction = async () => {
    try {
      const response = await store.apiExport(filters)

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'company-report.xlsx' // <- Ganti nama file sesuai kebutuhan
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload Excel:', error)
    }
  }

  // Open dialog for form or confirmation
  const openDialog = (variant) => {
    formState.value.dialog.show = true
    formState.value.dialog.variant = variant
    formState.value.dialog.maxwidth = variant === 'form' || variant === 'show' ? 700 : 400
  }

  // Load and set form data for show/edit
  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    const response = await store.apiGetShow(id)
    datashow.value = response.data.departemen
    formState.value.selectItem = response.data.select_company
    formState.value.formData = {
      company_id: response.data.departemen.company_id,
      name: response.data.departemen.name,
    }
  }

  // Handle form cancel action
  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const handleAlert = (success, message) => {
    alertState.value = {
      show: true,
      title: success ? 'Berhasil' : 'Gagal',
      message: message,
      type: success ? 'success' : 'error',
    }

    // Menghilangkan alert setelah 3 detik
    setTimeout(() => {
      alertState.value.show = false
    }, 3000) // 3000 ms = 3 detik
  }

  // Handle form submit action
  const handleSubmitForm = async ({ id, form }) => {
    console.log(isFormValid(form._rawValue));

    if (isFormValid(form._rawValue)) {
      try {
        const response = id
          ? await store.apiPutUpdate(form._rawValue, id._rawValue)
          : await store.apiPostAdd(form._rawValue)
        if (response) {
          loadItems()
          formState.value.dialog.show = false
          handleAlert(response.success, response.message)
        }
      } catch (error) {
        console.error('Error submitting data:', error)
        formState.value.dialog.show = false
      }
    } else {
      console.log('Incomplete form data.')
    }
  }

  // Validate form data
  const isFormValid = (formData) =>
    !!formData.company_id && !!formData.name

  // Handle remove action (show confirmation dialog)
  const handleRemove = (id) => {
    formState.value.idData = id
    openDialog('confirmation')
  }

  // Confirm remove action
  const handleConfirmRemove = async () => {
    try {
      if (formState.value.idData) {
        await store.apiDelete(formState.value.idData)
      } else if (pagination.selected.length > 0) {
        await Promise.all(pagination.selected.map((item) => store.apiDelete(item)))
      } else {
        console.warn('Tidak ada data yang dipilih untuk dihapus.')
      }
      await loadItems()
    } catch (error) {
      console.error('❌ Error removing data:', error)
    } finally {
      formState.value.dialog.show = false
    }
  }

  // Cancel remove action
  const handleCancelRemove = () => {
    pagination.selected = []
    formState.value.idData = null
    formState.value.dialog.show = false
  }
  return {
    store,
    filters,
    pagination,
    tableOptions,
    datashow,
    formState,
    alertState,
    handleDateRangeChange,
    handleBtnChange,
    handleTableOptions,
    handleCancelForm,
    handleSubmitForm,
    loadFormData,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove
  }
}
