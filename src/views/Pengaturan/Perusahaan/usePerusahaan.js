import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { usePerusahaanStore } from '@/stores/pengaturan/perusahaan'

export function usePerusahaan() {
  const store = usePerusahaanStore()

  // UI states
  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  })

  const tableOptions = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })

  // Filter data
  const filters = reactive({
    name: '',
    radius: '',
    start: null,
    end: null,
    createdAt: null,
    updatedAt: null,
  })

  // Dialog & form
  const formState = ref({
    isEdit: false,
    idData: null,
    dialog: {
      show: false,
      variant: null,
      maxwidth: 400,
    },
    formData: {
      companyName: '',
      latitude: '',
      longitude: '',
      radius: '',
      address: '',
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

  const clearForm = () => {
    Object.assign(formState.value.formData, {
      companyName: '',
      latitude: '',
      longitude: '',
      radius: '',
      address: '',
    })
  }

  const computedDefaultSort = () => {
    return tableOptions.value.sortBy.length
      ? tableOptions.value.sortBy
      : [{ key: 'created_at', order: 'desc' }]
  }

  const formatFilters = () => {
    return Object.fromEntries(
      Object.entries({
        ...filters,
        createdAt: filters.createdAt ? dayjs(filters.createdAt).format('YYYY-MM-DD') : null,
        updatedAt: filters.updatedAt ? dayjs(filters.updatedAt).format('YYYY-MM-DD') : null,
      }).filter(([_, val]) => val !== null && val !== '')
    )
  }

  const loadItems = async () => {
    try {
      store.isLoading.list = true
      const response = await store.apiListPaginate({
        page: tableOptions.value.page,
        itemsPerPage: tableOptions.value.itemsPerPage,
        sortBy: computedDefaultSort(),
        search: formatFilters(),
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
    () => Object.values(filters),
    debounce(() => loadItems(), 500)
  )

  const handleDateRangeChange = (dateRange) => {
    filters.start = dateRange.startDate
    filters.end = dateRange.endDate
  }

  const handleBtnChange = ({ btn }) => {
    const actions = {
      filter: loadItems,
      refresh: loadItems,
      add: () => openDialog('form'),
      export: exportFunction,
      print: printFunction,
    }
    actions[btn]?.() || console.log(btn)
  }

  const downloadFile = (response, fileName, type) => {
    const blob = new Blob([response], { type })
    const url = window.URL.createObjectURL(blob)
    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: fileName,
    })
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const printFunction = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
      downloadFile(response, 'company-report.pdf', 'application/pdf')
    } catch (error) {
      console.error('Gagal mendownload PDF:', error)
    }
  }

  const exportFunction = async () => {
    try {
      const response = await store.apiExport(filters)
      downloadFile(
        response,
        'company-report.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    } catch (error) {
      console.error('Gagal mendownload Excel:', error)
    }
  }

  const openDialog = (variant) => {
    const width = variant === 'form' || variant === 'show' ? 700 : 400
    Object.assign(formState.value.dialog, { show: true, variant, maxwidth: width })
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true

    const { data } = await store.apiGetShow(id)
    formState.value.formData = {
      companyName: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      address: data.full_address,
    }
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
    clearForm()
  }

  const isFormValid = ({ companyName, latitude, longitude, radius, address }) =>
    companyName && latitude && longitude && radius && address

  const handleSubmitForm = async ({ id, form }) => {
    const data = form._rawValue
    const idValue = id._rawValue

    if (!isFormValid(data)) return console.warn('Form tidak lengkap.')

    try {
      const response = idValue
        ? await store.apiPutUpdate(data, idValue)
        : await store.apiPostAdd(data)
      if (response) {
        loadItems()
        handleAlert(response.success, response.message)
        formState.value.dialog.show = false
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      formState.value.dialog.show = false
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
    pagination.selected = []
    formState.value.idData = null
    formState.value.dialog.show = false
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
    handleBtnChange,
    handleDateRangeChange,
    openDialog,
    loadFormData,
    handleCancelForm,
    handleSubmitForm,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
  }
}
