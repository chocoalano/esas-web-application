import { useJenisIzinStore } from '@/stores/pengaturan/jenis_izin'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'

export function useJenisIzin() {
  const store = useJenisIzinStore()

  // PAGINATION & FILTER
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

  // Form state & dialog
  const formState = ref({
    isEdit: false,
    idData: null,
    selectItemCompany: [],
    selectItemDepartement: [],
    formData: {
      type: '',
      is_payed: false,
      approve_line: true,
      approve_manager: true,
      approve_hr: true,
      with_file: true,
      show_mobile: true,
    },
    dialog: {
      show: false,
      variant: null,
      maxwidth: 400,
    },
  })

  const alertState = ref({
    show: false,
    title: '',
    message: '',
    type: 'error',
  })

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

  const loadItems = async () => {
    try {
      store.isLoading.list = true

      const sortBy = tableOptions.value.sortBy.length
        ? tableOptions.value.sortBy
        : [{ key: 'created_at', order: 'desc' }]

      // Clean filters
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

  // Watch filters with debounce
  watch(
    () => [filters.name, filters.start, filters.end, filters.createdAt, filters.updatedAt],
    debounce(() => loadItems(), 500)
  )

  const handleDateRangeChange = (dateRange) => {
    filters.start = dateRange.startDate
    filters.end = dateRange.endDate
  }

  const handleBtnChange = (btn) => {
    switch (btn.btn) {
      case 'filter':
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
    formState.value.selectItemCompany = response.data.select_company
    formState.value.selectItemDepartement = response.data.select_departement
  }

  const printFunction = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
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

  const exportFunction = async () => {
    try {
      const response = await store.apiExport(filters)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'company-report.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload Excel:', error)
    }
  }

  const openDialog = (variant) => {
    formState.value.dialog.show = true
    formState.value.dialog.variant = variant
    formState.value.dialog.maxwidth = variant === 'form' || variant === 'show' ? 700 : 400
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    const response = await store.apiGetShow(id)
    formState.value.formData = {
      type: response.data.type,
      is_payed: response.data.is_payed,
      approve_line: response.data.approve_line,
      approve_manager: response.data.approve_manager,
      approve_hr: response.data.approve_hr,
      with_file: response.data.with_file,
      show_mobile: response.data.show_mobile,
    }
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const handleSubmitForm = async (param) => {
    const { id: idData, form: formData } = param
    if (isFormValid(formData._rawValue)) {
      try {
        const response = idData._rawValue
          ? await store.apiPutUpdate(formData._rawValue, idData._rawValue)
          : await store.apiPostAdd(formData._rawValue)

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

  const isFormValid = (formData) => {
    if (typeof formData.type !== 'string' || formData.type.trim() === '') {
      return false
    }

    const booleanFields = [
      'is_payed',
      'approve_line',
      'approve_manager',
      'approve_hr',
      'with_file',
      'show_mobile',
    ]

    return booleanFields.every((field) => typeof formData[field] === 'boolean')
  }

  const handleRemove = (id) => {
    formState.value.idData = id
    openDialog('confirmation')
  }

  const handleConfirmRemove = async () => {
    try {
      let responses = []

      if (formState.value.idData) {
        const response = await store.apiDelete(formState.value.idData)
        responses.push(response)
      } else if (pagination.selected.length > 0) {
        responses = await Promise.all(pagination.selected.map(id => store.apiDelete(id)))
      } else {
        console.warn('❗ Tidak ada data yang dipilih untuk dihapus.')
        return
      }

      // Tangani alert per respons jika banyak, atau satu jika tunggal
      responses.forEach(res => handleAlert(res.success, res.message))

      await loadItems()
    } catch (error) {
      console.error('❌ Gagal menghapus data:', error)
    } finally {
      formState.value.dialog.show = false
      pagination.selected = []
      formState.value.idData = null
    }
  }

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
    formState,
    alertState,
    loadItems,
    handleTableOptions,
    handleDateRangeChange,
    handleBtnChange,
    handleCancelForm,
    handleSubmitForm,
    loadFormData,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
  }
}
