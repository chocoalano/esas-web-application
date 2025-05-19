import { useAbsensiStore } from '@/stores/administrasiHR/absensi'
import dayjs from 'dayjs'
import { ref, reactive, watch, onMounted } from 'vue'
import debounce from 'lodash/debounce'
import { useRouter } from 'vue-router'
import { stateDialog, stateTable, stateTableFilters } from './types'


export function useAbsensi() {
  const router = useRouter()
  const store = useAbsensiStore()

  const pagination = reactive(stateTable())
  const filters = reactive(stateTableFilters())
  const dialog = ref(stateDialog())

  const idData = ref(null)
  const selectCompany = ref([])
  const selectDepartement = ref([])
  const selectUser = ref([])

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
      filters.company_id,
      filters.departement_id,
      filters.user_id,
      filters.status_in,
      filters.status_out,
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
        loadItems()
        break
      case 'refresh':
        loadItems()
        break
      case 'add':
        router.push({ name: 'admhr.absensi.create' })
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

  const printFunction = async () => {
    try {
      if (!filters.start && !filters.end) {
        alert('Silahkan filter data dengan memilih range tanggal terlebih dulu sebelum mencetak data!')
      } else {
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
      }
    } catch (error) {
      console.error('Gagal mendownload PDF:', error)
    }
  }

  const exportFunction = async () => {
    try {
      if (!filters.start && !filters.end) {
        alert('Silahkan filter data dengan memilih range tanggal terlebih dulu sebelum mengexport data!')
      } else {
        const response = await store.apiExport(filters)
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })

        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'laporan-absensi.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Gagal mendownload Excel:', error)
    }
  }

  const openDialog = (variant) => {
    dialog.value.show = true
    dialog.value.variant = variant
    dialog.value.maxwidth = ['form', 'show'].includes(variant) ? 1080 : 400
  }

  const handleEdit = async (id) => {
    router.push({ name: 'admhr.absensi.edit', params: { id: id } })
  }
  const handleShow = async (id) => {
    router.push({ name: 'admhr.absensi.show', params: { id: id } })
  }

  const handleRemove = (id) => {
    idData.value = id
    openDialog('confirmation')
  }

  const handleConfirmRemove = async () => {
    try {
      let responses = []

      if (idData.value) {
        const response = await store.apiDelete(idData.value)
        responses.push(response)
      } else if (pagination.selected.length > 0) {
        responses = await Promise.all(pagination.selected.map(id => store.apiDelete(id)))
      } else {
        console.warn('❗ Tidak ada data yang dipilih untuk dihapus.')
        return
      }

      await loadItems()
    } catch (error) {
      console.error('❌ Gagal menghapus data:', error)
    } finally {
      dialog.value.show = false
      pagination.selected = []
      idData.value = null
    }
  }

  const handleCancelRemove = () => {
    pagination.selected = []
    idData.value = null
    dialog.value.show = false
  }

  const getKelengkapanFormFilter = async () => {
    const [company, departement, user] = await Promise.all([
      store.apiGetCompany(),
      store.apiGetDepartement(filters.company_id),
      store.apiGetPengguna(filters.company_id, filters.departement_id),
    ])
    selectCompany.value = company.data
    selectDepartement.value = departement.data
    selectUser.value = user.data
  }

  const onCompanyChange = async (id) => {
    const { data } = await store.apiGetDepartement(id)
    selectDepartement.value = data
  }

  const onDepartemenChange = async (company_id, id) => {
    const response = await store.apiGetPengguna(company_id, id)
    selectUser.value = response.data
  }

  onMounted(() => getKelengkapanFormFilter())

  return {
    store,
    pagination,
    filters,
    dialog,
    selectCompany,
    selectDepartement,
    selectUser,
    handleTableOptions,
    handleBtnChange,
    handleDateRangeChange,
    handleEdit,
    handleShow,
    handleRemove,
    handleConfirmRemove,
    handleCancelRemove,
    onCompanyChange,
    onDepartemenChange,
  }
}
