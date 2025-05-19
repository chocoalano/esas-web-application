// useJamKerja.ts
import { ref, reactive, watch } from 'vue'
import { useJamKerjaStore } from '@/stores/pengaturan/jam_kerja'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'

export function useJamKerja() {
  const store = useJamKerjaStore()

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

  const alertState = ref({
    show: false,
    title: '',
    message: '',
    type: 'error',
  })

  const formState = ref({
    isEdit: false,
    idData: null,
    selectItemCompany: [],
    selectItemDepartement: [],
    formData: {
      company_id: null,
      departemen_id: null,
      name: '',
      in: null,
      out: null,
    },
    dialog: {
      show: false,
      variant: null,
      maxwidth: 400,
    },
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
      alert('❌ Error loading data:', error)
    } finally {
      store.isLoading.list = false
    }
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
    debounce(() => {
      loadItems()
    }, 500),
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
    }
  }

  const handleTableOptions = (options) => {
    tableOptions.value = { ...options }
    loadItems()
  }

  const add = async () => {
    const response = await store.apiGetShow(1)
    formState.value.selectItemCompany = response.data.company_select
    formState.value.selectItemDepartement = response.data.dept_select
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
      window.URL.revokeObjectURL(url)
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
    const response = await store.apiGetShow(id)
    formState.value.selectItemCompany = response.data.company_select
    formState.value.selectItemDepartement = response.data.dept_select
    formState.value.formData = { ...response.data.timework }
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const isFormValid = (formData) =>
    formData.company_id && formData.departemen_id && formData.name && formData.in && formData.out

  const handleSubmitForm = async ({ id, form }) => {
    if (!isFormValid(form)) return alert('Incomplete form data.')
    try {
      const response = id
        ? await store.apiPutUpdate(form, id)
        : await store.apiPostAdd(form)
      if (response) {
        handleAlert(response.success, response.message)
        loadItems()
        formState.value.dialog.show = false
      }
    } catch (error) {
      alert('Error submitting data:', error)
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
    filters,
    pagination,
    tableOptions,
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
    handleCancelRemove,
  }
}
