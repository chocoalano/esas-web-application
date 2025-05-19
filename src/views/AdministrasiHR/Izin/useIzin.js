import { useIzinStore } from '@/stores/administrasiHR/izin'
import dayjs from 'dayjs'
import { ref, reactive, watch, onMounted, toRaw } from 'vue'
import debounce from 'lodash/debounce'
import { stateAlert, stateForm, stateTable, stateTableFilters } from './types'

export function useIzin() {
  const store = useIzinStore()

  // PAGINATION dan FILTER
  const pagination = reactive(stateTable())
  const filters = reactive(stateTableFilters())
  const formState = ref(stateForm())
  const alertState = ref(stateAlert())
  const selectType = ref([])
  const dialogApprove = ref(false)
  const attApprove = ref({
    id: null,
    type: null,
    step: null,
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

      const sortBy = pagination.value.sortBy.length
        ? pagination.value.sortBy
        : [{ key: 'created_at', order: 'desc' }]

      const search = Object.fromEntries(
        Object.entries({
          ...filters,
          createdAt: filters.createdAt ? dayjs(filters.createdAt).format('YYYY-MM-DD') : null,
          updatedAt: filters.updatedAt ? dayjs(filters.updatedAt).format('YYYY-MM-DD') : null,
        }).filter(([_, val]) => val !== null && val !== '')
      )

      const response = await store.apiListPaginate({
        page: pagination.value.page,
        itemsPerPage: pagination.value.itemsPerPage,
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
    pagination.value = { ...options }
    loadItems()
  }

  watch(
    () => [
      filters.permit_type,
      filters.permit_numbers,
      filters.workday,
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
    formState.value.formData = stateForm().formData
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
    formState.value.dialog.maxwidth = ['form', 'show'].includes(variant) ? 1000 : 400
  }

  const show = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true
    const response = await store.apiGetShow(id)
    formState.value.selectItemCompany = response.data.select_company
    formState.value.selectItemDepartement = response.data.select_departement
    formState.value.formData = {
      company_id: response.data.user.company_id,
      departement_id: response.data.user.employee.departement_id,
      user_id: response.data.user_id,
      permittype_id: response.data.permit_type.id,
      schedule_id: response.data.schedule_id,
      permit_numbers: response.data.permit_numbers,
      timein_adjust: response.data.timein_adjust,
      timeout_adjust: response.data.timeout_adjust,
      current_shift_id: response.data.current_shift_id,
      adjust_shift_id: response.data.adjust_shift_id,
      start_date: response.data.start_date,
      end_date: response.data.end_date,
      start_time: response.data.start_time,
      end_time: response.data.end_time,
      notes: response.data.notes,
      file: response.data.file,
    }
  }

  const edit = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true
    const response = await store.apiGetShow(id)
    formState.value.selectItemCompany = response.data.select_company
    formState.value.selectItemDepartement = response.data.select_departement
    formState.value.formData = {
      company_id: response.data.user.company_id,
      departement_id: response.data.user.employee.departement_id,
      user_id: response.data.user_id,
      permittype_id: response.data.permit_type.id,
      schedule_id: response.data.schedule_id,
      permit_numbers: response.data.permit_numbers,
      timein_adjust: response.data.timein_adjust,
      timeout_adjust: response.data.timeout_adjust,
      current_shift_id: response.data.current_shift_id,
      adjust_shift_id: response.data.adjust_shift_id,
      start_date: response.data.start_date,
      end_date: response.data.end_date,
      start_time: response.data.start_time,
      end_time: response.data.end_time,
      notes: response.data.notes,
      file: null,
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
  const handleCancelApproval = async () => {
    dialogApprove.value = false
  }

  const handleConfirmApproval = async (form) => {
    if (!form || !form.data || !form.id || !form.type) {
      console.error('❌ Form tidak valid:', form)
      return
    }
    console.log('🚀 Sedang submit approval', form)
    try {
      await store.apiPutApproval(form.data, form.id, form.type, form.notes)
      console.log('✅ Approval berhasil')
    } catch (error) {
      console.error('❌ Gagal melakukan approval data:', error)
    } finally {
      await loadItems()
      dialogApprove.value = false
    }
  }

  const getKelengkapanFormFilter = async () => {
    const response = await store.apiGetPermit()
    selectType.value = response.data
  }

  const approveLine = async (id, type) => {
    dialogApprove.value = true
    attApprove.value = {
      id: id,
      type: type,
      step: 'line'
    }
    console.log(`Approve line ID : ${id}`)
  }
  const approveMngr = async (id, type) => {
    dialogApprove.value = true
    attApprove.value = {
      id: id,
      type: type,
      step: 'manager'
    }
    alert(`Approve mngr ID : ${id}`)
  }
  const approveHr = async (id, type) => {
    dialogApprove.value = true
    attApprove.value = {
      id: id,
      type: type,
      step: 'hr'
    }
    alert(`Approve hr ID : ${id}`)
  }
  const validate = (data, type) => {
    const users = toRaw(data)
    const t = users.filter(user => user.user_type === type && user.user_approve === 'w')
    return t.length > 0 ? true : false
  }

  onMounted(() => getKelengkapanFormFilter())

  return {
    store,
    pagination,
    filters,
    formState,
    alertState,
    selectType,
    dialogApprove,
    attApprove,
    handleTableOptions,
    handleBtnChange,
    handleDateRangeChange,
    handleCancelForm,
    handleSubmitForm,
    show,
    edit,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
    approveLine,
    approveMngr,
    approveHr,
    handleCancelApproval,
    handleConfirmApproval,
    validate,
  }
}
