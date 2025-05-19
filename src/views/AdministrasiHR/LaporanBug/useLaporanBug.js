import { useLaporanBugStore } from '@/stores/administrasiHR/laporan_bug'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'
import debounce from 'lodash/debounce'

export function useLaporanBug() {
  const store = useLaporanBugStore()

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
    company: '',
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

  const formState = ref({
    isEdit: false,
    idData: null,
    formData: {
      title: '',
      status: false,
      message: '',
      platform: '',
      image: null,
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
      filters.title,
      filters.company,
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
      case 'refresh':
        loadItems()
        break
      case 'add':
        add()
        openDialog('form')
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

  const add = async () => {
    formState.value.formData = {
      status: false,
      message: '',
      platform: '',
      image: null,
    }
  }

  const openDialog = (variant) => {
    formState.value.dialog.show = true
    formState.value.dialog.variant = variant
    formState.value.dialog.maxwidth = ['form', 'show'].includes(variant) ? 1000 : 400
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true
    const response = await store.apiGetShow(id)
    formState.value.formData = {
      title: response.data.title,
      status: response.data.status,
      message: response.data.message,
      platform: response.data.platform,
      image: response.data.image,
    }
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const handleSubmitForm = async (data) => {
    const { form, id } = data
    try {
      const response = id
        ? await store.apiPutUpdate(form, id)
        : await store.apiPostAdd(form)

      if (response) {
        await loadItems()
        formState.value.dialog.show = false
        handleAlert(response.success, response.message)
      }
    } catch (error) {
      console.error('❌ Error submitting data:', error)
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
