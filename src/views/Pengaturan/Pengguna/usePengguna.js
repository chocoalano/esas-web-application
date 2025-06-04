// useJamKerja.ts
import { ref, reactive, watch, onMounted } from 'vue'
import { usePenggunaStore } from '@/stores/pengaturan/pengguna'
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'
import userShow from './types/userShow'
import { formatDay } from '@/composables/useApp'
import { get, set } from 'lodash'

export function usePengguna() {
  const store = usePenggunaStore()

  const pagination = reactive({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
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

  const alertState = ref({
    show: false,
    title: '',
    message: '',
    type: 'error',
  })
  const formErrors = ref({})
  const dataShow = reactive(userShow())

  const formState = ref({
    isEdit: false,
    idData: null,
    selectItemCompany: [],
    selectItemDepartement: [],
    selectItemPosition: [],
    selectItemLevel: [],
    selectItemLine: [],
    selectItemMngr: [],
    formData: {
      company_id: '',
      name: '',
      nip: '',
      email: '',
      password: '',
      email_verified_at: '',
      avatar: '',
      avatar_file: null,
      status: '',
      details: {
        phone: '',
        placebirth: '',
        datebirth: '',
        gender: '',
        blood: '',
        marital_status: '',
        religion: '',
      },
      address: {
        identity_type: '',
        identity_numbers: '',
        province: '',
        city: '',
        citizen_address: '',
        residential_address: '',
      },
      employee: {
        departement_id: '',
        job_position_id: '',
        job_level_id: '',
        approval_line_id: '',
        approval_manager_id: '',
        join_date: '',
        sign_date: '',
        bank_name: '',
        bank_number: '',
        bank_holder: '',
      },
      salaries: {
        basic_salary: null,
        payment_type: null,
      },
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
        getKelengkapanForm()
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

  const printFunction = async () => {
    try {
      const response = await store.apiDownloadPrint(filters)
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'users.pdf'
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
      link.download = 'users.xlsx'
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
    formState.value.dialog.maxwidth = ['form', 'show'].includes(variant) ? 2080 : 400
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    const response = await store.apiGetShow(id)
    formState.value.selectItemCompany = response.data.company_select
    formState.value.selectItemDepartement = response.data.dept_select
    formState.value.formData = { ...response.data.user }
    dataShow.value = { ...response.data.user }
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
    dataShow.value = userShow()
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

  const handleSubmitForm = async ({ id, form }) => {
    try {
      const formattedForm = { ...form }

      // Daftar field tanggal nested
      const tanggalFields = ['details.datebirth', 'employee.join_date', 'employee.sign_date']

      // Format tanggal untuk setiap field yang tersedia
      tanggalFields.forEach((field) => {
        const value = get(formattedForm, field)
        if (value) {
          set(formattedForm, field, formatDay(value))
        }
      })
      const response = id
        ? await store.apiPutUpdate(formattedForm, id)
        : await store.apiPostAdd(formattedForm)

      if (response) {
        handleAlert(response.success, response.message)
        loadItems()
        formState.value.dialog.show = false
      }
    } catch (error) {
      console.log(error.response.data);
      formErrors.value = error.response.data.errors
      alert('Error submitting data: ' + (error.response.data.message || error))
    }
  }

  const handleRemove = (id) => {
    formState.value.idData = id
    openDialog('confirmation')
  }
  const handleReset = (id) => {
    formState.value.idData = id
    openDialog('confirmation-reset')
  }
  const handleResetPass = (id) => {
    formState.value.idData = id
    openDialog('confirmation-reset-password')
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

  const handleConfirmReset = async () => {
    try {
      if (formState.value.idData) {
        await store.apiResetPhoneId(formState.value.idData)
      } else if (pagination.selected.length > 0) {
        await Promise.all(pagination.selected.map((id) => store.apiResetPhoneId(id)))
      }
      await loadItems()
    } catch (error) {
      console.error('❌ Error removing data:', error)
    } finally {
      formState.value.dialog.show = false
    }
  }

  const handleCancelReset = () => {
    pagination.selected = []
    formState.value.idData = null
    formState.value.dialog.show = false
  }

  const handleConfirmResetPass = async () => {
    try {
      if (formState.value.idData) {
        await store.apiResetPassword(formState.value.idData)
      } else if (pagination.selected.length > 0) {
        await Promise.all(pagination.selected.map((id) => store.apiResetPassword(id)))
      }
      await loadItems()
    } catch (error) {
      console.error('❌ Error removing data:', error)
    } finally {
      formState.value.dialog.show = false
    }
  }

  const handleCancelResetPass = () => {
    pagination.selected = []
    formState.value.idData = null
    formState.value.dialog.show = false
  }

  const getKelengkapanForm = async () => {
    try {
      const [company, departement, position, level, user] = await Promise.all([
        store.apiGetCompany(),
        store.apiGetDepartement(filters.company),
        store.apiGetPosition(filters.company, filters.departemen),
        store.apiGetLevel(filters.company, filters.departemen),
        store.apiGetUser(filters.company, filters.departemen),
      ])
      formState.value.selectItemCompany = company.data
      formState.value.selectItemDepartement = departement.data
      formState.value.selectItemPosition = position.data
      formState.value.selectItemLevel = level.data
      formState.value.selectItemLine = user.data
      formState.value.selectItemMngr = user.data
    } catch (error) {
      console.error('Gagal memuat data:', error)
    }
  }

  const onCompanyChange = async (id) => {
    const { data } = await store.apiGetDepartement(id)
    formState.value.selectItemDepartement = data
  }
  const onDepartemenChange = async (company_id, id) => {
    const { data } = await store.apiGetPosition(company_id, id)
    formState.value.selectItemPosition = data
  }
  const onPositionChange = async (company_id, id) => {
    const { data } = await store.apiGetLevel(company_id, id)
    formState.value.selectItemLevel = data
  }

  const resetFilters = () => {
    Object.keys(filters).forEach((key) => {
      filters[key] = typeof filters[key] === 'string' ? '' : null
    })
  }

  onMounted(async () => {
    getKelengkapanForm()
  })

  return {
    store,
    filters,
    pagination,
    tableOptions,
    formState,
    alertState,
    formErrors,
    onDepartemenChange,
    onPositionChange,
    onCompanyChange,
    handleDateRangeChange,
    handleBtnChange,
    handleTableOptions,
    handleCancelForm,
    handleSubmitForm,
    loadFormData,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
    resetFilters,
    handleReset,
    handleCancelReset,
    handleConfirmReset,
    handleResetPass,
    handleConfirmResetPass,
    handleCancelResetPass
  }
}
