import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'
import dayjs from 'dayjs'

export const useIzinStore = defineStore('izin', () => {
  const headers = computed(() => [
    { title: "Jenis Izin", align: "start", sortable: true, key: "permit_type.type" },
    { title: "ID Numbers", align: "start", sortable: true, key: "permit_numbers" },
    { title: "Waktu kerja", align: "start", sortable: true, key: "user_timework_schedule.work_day" },
    { title: "Dari Tgl", align: "start", sortable: true, key: "start_date" },
    { title: "Sampai Tgl", align: "end", sortable: true, key: "end_date" },
    { title: "Dari Jam", align: "end", sortable: true, key: "start_time" },
    { title: "Sampai Jam", align: "end", sortable: true, key: "end_time" },
    { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "created_at" },
    { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "updated_at" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({
    list: false,
    show: false,
    add: false,
    update: false,
    delete: false,
  })

  async function fetchData(endpoint, params = {}, type = 'show') {
    isLoading.value[type] = true
    try {
      const { data } = await api.get(endpoint, { params })
      return data
    } catch (error) {
      console.error(`Gagal fetch ${endpoint}:`, error)
      throw error
    } finally {
      isLoading.value[type] = false
    }
  }

  function buildFormData(form, id) {
    const t = toRaw(form)
    const formData = new FormData()
    const fields = [
      'adjust_shift_id',
      'company_id',
      'current_shift_id',
      'departement_id',
      'end_date',
      'end_time',
      'file',
      'notes',
      'permit_numbers',
      'permittype_id',
      'schedule_id',
      'start_date',
      'start_time',
      'timein_adjust',
      'timeout_adjust',
      'user_id',
    ]

    // Append fields jika tidak null/undefined
    fields.forEach(field => {
      if (t[field] !== undefined && t[field] !== null && t[field] !== '') {
        formData.append(field, t[field])
      }
    })

    // Tanggal & waktu wajib dikirim dalam format yang tepat
    // Format: YYYY-MM-DD untuk tanggal
    // Format: HH:mm:ss untuk waktu
    if (t.start_date) {
      formData.append('start_date', dayjs(t.start_date).format('YYYY-MM-DD'))
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      formData.append('start_date', dayjs(yesterday).format('YYYY-MM-DD'));
    }

    if (t.end_date) {
      formData.append('end_date', dayjs(t.end_date).format('YYYY-MM-DD'))
    } else {
      formData.append('end_date', dayjs(new Date).format('YYYY-MM-DD'))
    }
    console.log(t.start_time);

    if (t.start_time) {
      formData.append('start_time', t.start_time)
    } else {
      formData.append('start_time', dayjs(new Date).format('HH:mm'))
    }

    if (t.end_time) {
      formData.append('end_time', t.end_time)
    } else {
      formData.append('end_time', dayjs(new Date).format('HH:mm'))
    }

    // Method spoofing for PUT
    if (id) formData.append('_method', 'PUT')

    return formData
  }


  const apiGetCompany = () => fetchData('/web-api/kelengkapan-form/all-company')
  const apiGetPermit = () => fetchData('/web-api/kelengkapan-form/all-permit')
  const apiGetNumbers = (permit_type_id) => fetchData('/web-api/izin/code-numbers', { permit_type_id })

  const apiGetShift = (company_id, departement_id) => {
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    const endpoint = Object.keys(params).length ? '/web-api/kelengkapan-form/filter-timework' : '/web-api/kelengkapan-form/all-timework'
    return fetchData(endpoint, params)
  }

  const apiGetDepartement = (company_id) => {
    const params = company_id ? { company_id } : {}
    const endpoint = company_id ? '/web-api/kelengkapan-form/filter-departement' : '/web-api/kelengkapan-form/all-departement'
    return fetchData(endpoint, params)
  }

  const apiGetUser = (company_id, departement_id) => {
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    const endpoint = Object.keys(params).length ? '/web-api/kelengkapan-form/filter-user' : '/web-api/kelengkapan-form/all-user'
    return fetchData(endpoint, params)
  }

  const apiGetSchedule = (company_id, departement_id, user_id) => {
    const params = (company_id && departement_id && user_id) ? { company_id, departement_id, user_id } : {}
    const endpoint = Object.keys(params).length ? '/web-api/kelengkapan-form/filter-schedule' : '/web-api/kelengkapan-form/all-schedule'
    return fetchData(endpoint, params)
  }

  const apiListPaginate = ({ page = 1, itemsPerPage = 10, sortBy, search } = {}) => {
    return fetchData('/web-api/izin', { page, limit: itemsPerPage, sortBy, search }, 'list')
  }

  const apiGetShow = (id) => fetchData(`/web-api/izin/${id}`, {}, 'show')

  const apiPostAdd = async (form) => {
    isLoading.value.add = true
    try {
      const { data } = await api.post('/web-api/izin', buildFormData(form), {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return data
    } catch (error) {
      console.error('Gagal tambah izin:', error)
      throw error
    } finally {
      isLoading.value.add = false
    }
  }

  const apiPutUpdate = async (form, id) => {
    isLoading.value.update = true
    try {
      const { data } = await api.post(`/web-api/izin/${id}`, buildFormData(form, id), {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return data
    } catch (error) {
      console.error('Gagal update izin:', error)
      throw error
    } finally {
      isLoading.value.update = false
    }
  }

  const apiPutApproval = async (form, id, type, notes) => {
    isLoading.value.add = true
    try {
      const { data } = await api.put(`/web-api/izin/${id}/approval`, { approval: form, type, notes })
      return data
    } catch (error) {
      console.error('Gagal approval izin:', error)
      throw error
    } finally {
      isLoading.value.add = false
    }
  }

  const apiDelete = async (id) => {
    isLoading.value.delete = true
    try {
      const { data } = await api.delete(`/web-api/izin/${id}`)
      return data
    } catch (error) {
      console.error('Gagal hapus izin:', error)
      throw error
    } finally {
      isLoading.value.delete = false
    }
  }

  const apiDownloadPrint = (filter) => fetchDataFile('/web-api/izin/download', filter)
  const apiExport = (filter) => fetchDataFile('/web-api/izin/export', filter)

  async function fetchDataFile(endpoint, params = {}) {
    isLoading.value.delete = true
    try {
      const { data } = await api.get(endpoint, { params, responseType: 'blob' })
      return data
    } catch (error) {
      console.error(`Gagal download file dari ${endpoint}:`, error)
      throw error
    } finally {
      isLoading.value.delete = false
    }
  }

  return {
    headers,
    isLoading,
    apiGetCompany,
    apiGetPermit,
    apiGetNumbers,
    apiGetShift,
    apiGetDepartement,
    apiGetUser,
    apiGetSchedule,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiPutApproval,
    apiDelete,
    apiDownloadPrint,
    apiExport,
  }
})
