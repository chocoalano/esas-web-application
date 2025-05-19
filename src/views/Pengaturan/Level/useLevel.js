import { useLevelStore } from '@/stores/pengaturan/level'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'
import debounce from 'lodash/debounce'

export function useLevel() {
  const store = useLevelStore()

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
      filters.name,
      filters.company,
      filters.departemen,
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
    formState.value.formData = {
      company_id: null,
      departement_id: null,
      name: '',
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

  const exportFunction = async () => {
    try {
      const response = await store.apiExport(filters)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'jenis-izin-report.xlsx'
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
    formState.value.dialog.maxwidth = ['form', 'show'].includes(variant) ? 700 : 400
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true
    const response = await store.apiGetShow(id)

    formState.value.selectItemCompany = response.data.select_company
    formState.value.selectItemDepartement = response.data.select_departement
    formState.value.formData = {
      company_id: response.data.level.company_id,
      departement_id: response.data.level.departement_id,
      name: response.data.level.name,
    }
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const handleSubmitForm = async () => {
    const idData = formState.value.idData
    const formData = formState.value.formData

    if (isFormValid(formData)) {
      try {
        const response = idData
          ? await store.apiPutUpdate(formData, idData)
          : await store.apiPostAdd(formData)

        if (response) {
          await loadItems()
          formState.value.dialog.show = false
          handleAlert(response.success, response.message)
        }
      } catch (error) {
        console.error('❌ Error submitting data:', error)
        formState.value.dialog.show = false
      }
    } else {
      console.log('Data form belum lengkap.')
    }
  }

  const isFormValid = (formData) =>
    formData.company_id &&
    formData.departement_id &&
    formData.name

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
    pagination,
    filters,
    formState,
    tableOptions,
    alertState,
    handleTableOptions,
    handleBtnChange,
    handleDateRangeChange,
    handleCancelForm,
    handleSubmitForm,
    loadFormData,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
  }
}
