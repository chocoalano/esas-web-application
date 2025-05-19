import { useJadwalKerjaStore } from '@/stores/administrasiHR/jadwal_kerja'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { ref, reactive, watch, onMounted } from 'vue'
import { stateAlert, stateForm, stateTable, stateTableFilters } from './types'

export function useJadwalKerja() {
  const store = useJadwalKerjaStore()

  const pagination = reactive(stateTable())
  const filters = reactive(stateTableFilters())
  const formState = ref(stateForm())
  const alertState = ref(stateAlert())

  const selectCompany = ref([])
  const selectDepartement = ref([])
  const selectTimework = ref([])
  const selectUser = ref([])

  const handleAlert = (success, message) => {
    alertState.value = {
      show: true,
      title: success ? 'Berhasil' : 'Gagal',
      message,
      type: success ? 'success' : 'error',
    }

    setTimeout(() => {
      alertState.value.show = false
    }, 3000)
  }

  const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : null)

  const loadItems = async () => {
    try {
      store.isLoading.list = true
      const sortBy = pagination.sortBy.length
        ? pagination.sortBy
        : [{ key: 'created_at', order: 'desc' }]
      const search = Object.fromEntries(
        Object.entries({
          ...filters,
          workday: formatDate(filters.workday),
          createdAt: formatDate(filters.createdAt),
          updatedAt: formatDate(filters.updatedAt),
        }).filter(([_, val]) => val !== null && val !== '')
      )
      const response = await store.apiListPaginate({
        page: pagination.page,
        itemsPerPage: pagination.itemsPerPage,
        sortBy,
        search,
      })
      pagination.serverItems = response.data.data
      pagination.totalItems = response.data.total
    } catch (error) {
      alert('❌ Gagal memuat data:', error)
    } finally {
      store.isLoading.list = false
    }
  }
  const handlePagination = (options) => {
    Object.assign(pagination, options)
    loadItems()
  }
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
        alert('⚠️ Tombol tidak dikenali:', btn.btn)
    }
  }
  const add = () => {
    formState.value.formData = {
      company_id: '',
      departement: '',
      user_id: [],
      time_work_id: '',
      work_day_start: '',
      work_day_finish: '',
      dayoff: [],
    }
  }
  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  const printFunction = async () => {
    try {
      if (filters.company_id && filters.departement_id && filters.start && filters.end && filters.timework_id && filters.user_id) {
        const response = await store.apiDownloadPrint(filters)
        const blob = new Blob([response], { type: 'application/pdf' })
        downloadFile(blob, 'jadwal-kerja-report.pdf')
      } else {
        alert('Data ini cukup besar, kamu harus memilih, perusahaan, departemen, user, shift, tanggal mulai, dan tanggal selesai untuk melakukan filter!')
      }
    } catch (error) {
      alert('❌ Gagal mencetak PDF:', error)
    }
  }
  const exportFunction = async () => {
    try {
      const response = await store.apiExport(filters)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      downloadFile(blob, 'jadwal-kerja-report.xlsx')
    } catch (error) {
      alert('❌ Gagal mengekspor Excel:', error)
    }
  }
  const openDialog = (variant) => {
    formState.value.dialog = {
      show: true,
      variant,
      maxwidth: ['form', 'show'].includes(variant) ? 1000 : 400,
    }
  }

  const loadFormData = async (id, variant) => {
    openDialog(variant)
    formState.value.idData = id
    formState.value.isEdit = true
    const response = await store.apiGetShow(id)
    Object.assign(formState.value.formData, response.data)
  }

  const handleCancelForm = () => {
    formState.value.dialog.show = false
    formState.value.isEdit = false
    formState.value.idData = null
  }

  const handleSubmitForm = async ({ form, id }) => {
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
      alert('❌ Gagal menyimpan data:', error)
      formState.value.dialog.show = false
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
        : pagination.selected || []

      if (!ids.length) {
        alert('❗ Tidak ada data yang dipilih.')
        return
      }

      const responses = await Promise.all(ids.map((id) => store.apiDelete(id)))
      responses.forEach((res) => handleAlert(res.success, res.message))

      await loadItems()
    } catch (error) {
      alert('❌ Gagal menghapus data:', error)
    } finally {
      handleCancelRemove()
    }
  }

  const handleCancelRemove = () => {
    pagination.selected = []
    formState.value.idData = null
    formState.value.dialog.show = false
  }

  watch(
    () => [
      filters.company_id,
      filters.departement_id,
      filters.timework_id,
      filters.workday,
      filters.user_id,
      filters.start,
      filters.end,
      filters.createdAt,
      filters.updatedAt,
    ],
    debounce(loadItems, 500)
  )

  const getKelengkapanFormFilter = async () => {
    const [company, departement, user, jamkerja] = await Promise.all([
      store.apiGetCompany(),
      store.apiGetDepartement(filters.company_id),
      store.apiGetPengguna(filters.company_id, filters.departement_id),
      store.apiGetJamKerja(filters.company_id, filters.departement_id),
    ])
    selectCompany.value = company.data
    selectDepartement.value = departement.data
    selectUser.value = user.data
    selectTimework.value = jamkerja.data
  }

  const onCompanyChange = async (id) => {
    const { data } = await store.apiGetDepartement(id)
    selectDepartement.value = data
  }

  const onDepartemenChange = async (company_id, id) => {
    const [penggunaRes, jamKerjaRes] = await Promise.all([
      store.apiGetPengguna(company_id, id),
      store.apiGetJamKerja(company_id, id),
    ])
    selectUser.value = penggunaRes.data
    selectTimework.value = jamKerjaRes.data
  }

  onMounted(() => getKelengkapanFormFilter())

  return {
    store,
    pagination,
    filters,
    selectCompany,
    selectDepartement,
    selectTimework,
    selectUser,
    formState,
    alertState,
    onCompanyChange,
    onDepartemenChange,
    handlePagination,
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
