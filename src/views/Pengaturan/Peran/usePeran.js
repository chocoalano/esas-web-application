import { ref, reactive, watch } from 'vue'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'
import { usePeranStore } from '@/stores/pengaturan/peran'

export function usePeran() {
  const store = usePeranStore()

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

  const formState = ref({
    isEdit: false,
    idData: null,
    selectItemPermission: [],
    formData: { name: '', permission: [] },
    dialog: { show: false, variant: null, maxwidth: 400 },
  })

  const alertState = ref({
    show: false,
    title: '',
    message: '',
    type: 'error',
  })

  const showAlert = (success, message) => {
    Object.assign(alertState.value, {
      show: true,
      title: success ? 'Berhasil' : 'Gagal',
      message,
      type: success ? 'success' : 'error',
    })

    setTimeout(() => (alertState.value.show = false), 3000)
  }

  const formatDate = (date) => date ? dayjs(date).format('YYYY-MM-DD') : null

  const buildSearchParams = () => {
    const { name, start, end, createdAt, updatedAt } = filters
    return Object.fromEntries(
      Object.entries({
        name,
        start,
        end,
        createdAt: formatDate(createdAt),
        updatedAt: formatDate(updatedAt),
      }).filter(([_, val]) => val !== null && val !== '')
    )
  }

  const loadItems = async () => {
    try {
      store.isLoading.list = true

      const sort = pagination.sortBy.length
        ? pagination.sortBy
        : [{ key: 'created_at', order: 'desc' }]

      const response = await store.apiListPaginate({
        page: pagination.page,
        itemsPerPage: pagination.itemsPerPage,
        sortBy: sort,
        search: buildSearchParams(),
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
    Object.assign(pagination, options)
    loadItems()
  }

  watch(
    () => Object.values(filters),
    debounce(loadItems, 500)
  )

  const handleDateRangeChange = ({ startDate, endDate }) => {
    filters.start = startDate
    filters.end = endDate
  }

  const handleBtnChange = async ({ btn }) => {
    const actions = {
      filter: loadItems,
      refresh: loadItems,
      add: () => {
        prepareForm()
        openDialog('form')
      },
      export: exportData,
      print: printData,
    }

    const action = actions[btn] || (() => console.log(btn))
    await action()
  }

  const openDialog = (variant) => {
    formState.value.dialog = {
      show: true,
      variant,
      maxwidth: ['form', 'show'].includes(variant) ? 2000 : 400,
    }
  }

  const prepareForm = async () => {
    const { data } = await store.apiGetShow(1)
    formState.value.selectItemPermission = data.select_permission
  }

  const printData = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
      const url = URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))

      const link = Object.assign(document.createElement('a'), {
        href: url,
        download: 'company-report.pdf',
      })

      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload PDF:', error)
    }
  }

  const exportData = async () => {
    try {
      const response = await store.apiExport(filters)
      const url = URL.createObjectURL(new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }))

      const link = Object.assign(document.createElement('a'), {
        href: url,
        download: 'company-report.xlsx',
      })

      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal mendownload Excel:', error)
    }
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true

    const { data } = await store.apiGetShow(id)

    formState.value.selectItemPermission = data.select_permission
    formState.value.formData = {
      name: data.role.name,
      permission: data.permission,
    }
  }

  const handleCancelForm = () => {
    Object.assign(formState.value, {
      dialog: { show: false, variant: null, maxwidth: 400 },
      isEdit: false,
      idData: null,
    })
  }

  const handleSubmitForm = async ({ id, form }) => {
    const idData = id._rawValue
    const formData = form._rawValue

    try {
      const response = idData
        ? await store.apiPutUpdate(formData, idData)
        : await store.apiPostAdd(formData)

      if (response) {
        await loadItems()
        showAlert(response.success, response.message)
        handleCancelForm()
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      handleCancelForm()
    }
  }

  const handleRemove = (id) => {
    formState.value.idData = id
    openDialog('confirmation')
  }

  const handleConfirmRemove = async () => {
    try {
      const ids = formState.value.idData
        ? [formState.value.idData]
        : pagination.selected

      if (!ids.length) {
        console.warn('❗ Tidak ada data yang dipilih untuk dihapus.')
        return
      }

      const responses = await Promise.all(ids.map(id => store.apiDelete(id)))

      responses.forEach(res => showAlert(res.success, res.message))
      await loadItems()
    } catch (error) {
      console.error('❌ Gagal menghapus data:', error)
    } finally {
      handleCancelRemove()
    }
  }

  const handleCancelRemove = () => {
    formState.value.dialog.show = false
    formState.value.idData = null
    pagination.selected = []
  }

  return {
    store,
    pagination,
    filters,
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
