import { usePosisiStore } from '@/stores/pengaturan/posisi'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'
import debounce from 'lodash/debounce'

export function usePosisi() {
  const store = usePosisiStore()

  // Pagination & Sorting
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
    departemen: '',
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

  // Form state
  const formState = ref({
    isEdit: false,
    idData: null,
    selectItemCompany: [],
    selectItemDepartement: [],
    formData: {
      company_id: null,
      departement_id: null,
      name: '',
    },
    dialog: {
      show: false,
      variant: null,
      maxwidth: 400,
    },
  })

  const clearForm = () => {
    Object.assign(formState.value.formData, {
      company_id: null,
      departement_id: null,
      name: '',
    })
  }

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
      console.error('❌ Gagal memuat data:', error)
    } finally {
      store.isLoading.list = false
    }
  }

  const handleTableOptions = (options) => {
    tableOptions.value = { ...options }
    loadItems()
  }

  watch(
    () => Object.values(filters),
    debounce(() => loadItems(), 500)
  )

  const handleDateRangeChange = (range) => {
    filters.start = range.startDate
    filters.end = range.endDate
  }

  const handleBtnChange = (btn) => {
    switch (btn.btn) {
      case 'filter':
      case 'refresh':
        loadItems()
        break
      case 'add':
        prepareForm()
        openDialog('form')
        break
      case 'export':
        exportData()
        break
      case 'print':
        printData()
        break
      default:
        console.log('Unhandled button:', btn.btn)
    }
  }

  const prepareForm = async () => {
    const response = await store.apiGetShow(1)
    formState.value.selectItemCompany = response.data.select_company
    formState.value.selectItemDepartement = response.data.select_departement
  }

  const openDialog = (variant) => {
    formState.value.dialog.show = true
    formState.value.dialog.variant = variant
    formState.value.dialog.maxwidth = variant === 'form' || variant === 'show' ? 700 : 400
  }

  const loadFormData = async (id, variant) => {
    formState.value.idData = id
    openDialog(variant)
    const { data } = await store.apiGetShow(id)
    formState.value.isEdit = true
    formState.value.selectItemCompany = data.select_company
    formState.value.selectItemDepartement = data.select_departement
    formState.value.formData = {
      company_id: data.departemen.company_id,
      departement_id: data.departemen.departement_id,
      name: data.departemen.name,
    }
  }

  const handleCancelForm = () => {
    clearForm()
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const isFormValid = ({ company_id, departement_id, name }) => {
    return !!(company_id && departement_id && name)
  }

  const handleSubmitForm = async ({ id, form }) => {
    const formData = form._rawValue
    const idData = id._rawValue

    if (!isFormValid(formData)) {
      console.warn('Form tidak lengkap')
      return
    }

    try {
      const response = idData
        ? await store.apiPutUpdate(formData, idData)
        : await store.apiPostAdd(formData)

      if (response) {
        loadItems()
        formState.value.dialog.show = false
        handleAlert(response.success, response.message)
      }
    } catch (error) {
      console.error('❌ Gagal menyimpan data:', error)
    }
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
    formState.value.idData = null
    pagination.selected = []
    formState.value.dialog.show = false
  }

  const exportData = async () => {
    try {
      const res = await store.apiExport(filters)
      downloadFile(res, 'company-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    } catch (error) {
      console.error('❌ Gagal mengekspor Excel:', error)
    }
  }

  const printData = async () => {
    try {
      const res = await store.apiDownloadPrint(filters)
      downloadFile(res, 'company-report.pdf', 'application/pdf')
    } catch (error) {
      console.error('❌ Gagal mendownload PDF:', error)
    }
  }

  const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    store,
    pagination,
    filters,
    tableOptions,
    formState,
    alertState,
    loadItems,
    handleTableOptions,
    handleDateRangeChange,
    handleBtnChange,
    loadFormData,
    handleCancelForm,
    handleSubmitForm,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
  }
}
