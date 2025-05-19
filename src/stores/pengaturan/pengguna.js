import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const usePenggunaStore = defineStore('pengguna', () => {
  const headers = computed(() => [
    { title: 'Image', align: 'start', sortable: true, key: 'avatar' },
    { title: 'Perusahaan', align: 'start', sortable: true, key: 'company.name' },
    { title: 'Departemen', align: 'start', sortable: true, key: 'employee.departement.name' },
    { title: 'Posisi', align: 'start', sortable: true, key: 'employee.job_position.name' },
    { title: 'Level', align: 'start', sortable: true, key: 'employee.job_level.name' },
    { title: 'NIP', align: 'start', sortable: true, key: 'nip' },
    { title: 'Nama', align: 'start', sortable: true, key: 'name' },
    { title: 'Mail', align: 'start', sortable: true, key: 'email' },
    { title: 'Status', align: 'start', sortable: false, key: 'status' },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({ list: false, show: false, add: false, update: false, delete: false })

  async function fetchData(endpoint, params = {}, type = 'show') {
    isLoading.value[type] = true
    try {
      const { data } = await api.get(endpoint, { params })
      return data
    } catch (error) {
      console.error(`Gagal mengambil data dari ${endpoint}:`, error)
      throw error
    } finally {
      isLoading.value[type] = false
    }
  }

  const apiGetCompany = () => fetchData('/web-api/kelengkapan-form/all-company')

  const apiGetDepartement = (company_id) => fetchData('/web-api/kelengkapan-form/filter-departement', { company_id })

  const apiGetPosition = (company_id, departement_id) => {
    const endpoint = company_id && departement_id
      ? '/web-api/kelengkapan-form/filter-position'
      : '/web-api/kelengkapan-form/all-position'
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    return fetchData(endpoint, params)
  }

  const apiGetLevel = (company_id, departement_id) => {
    const endpoint = company_id && departement_id
      ? '/web-api/kelengkapan-form/filter-level'
      : '/web-api/kelengkapan-form/all-level'
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    return fetchData(endpoint, params)
  }

  const apiGetUser = (company_id, departement_id) => {
    const endpoint = company_id && departement_id
      ? '/web-api/kelengkapan-form/filter-user'
      : '/web-api/kelengkapan-form/all-user'
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    return fetchData(endpoint, params)
  }

  const apiListPaginate = ({ page = 1, itemsPerPage = 10, sortBy, search }) => {
    isLoading.value.list = true
    return api.get('/web-api/pengguna', {
      params: { page, limit: itemsPerPage, sortBy, search },
    })
      .then(({ data }) => data)
      .catch((error) => {
        console.error('Gagal mengambil data user:', error)
        throw error
      })
      .finally(() => (isLoading.value.list = false))
  }

  const apiGetShow = (id) => fetchData(`/web-api/pengguna/${id}`)

  function buildFormData(user, isUpdate = false) {
    const t = toRaw(user)
    const formData = new FormData()
    if (isUpdate) formData.append('_method', 'PUT')

    const appendIfExists = (key, value) => {
      if (value !== undefined && value !== null) formData.append(key, value)
    }

    // Basic Info
    appendIfExists('company_id', t.company_id)
    appendIfExists('name', t.name)
    appendIfExists('nip', t.nip)
    appendIfExists('email', t.email)
    appendIfExists('status', t.status)
    if (t.avatar_file) formData.append('avatar', t.avatar_file)

    // Details
    for (const key in t.details) appendIfExists(`details[${key}]`, t.details[key])
    for (const key in t.address) appendIfExists(`address[${key}]`, t.address[key])
    for (const key in t.salaries) appendIfExists(`salaries[${key}]`, t.salaries[key])

    if (t.employee) {
      for (const key in t.employee) appendIfExists(`employee[${key}]`, t.employee[key])
    }

    return formData
  }

  const apiPostAdd = async (user) => {
    isLoading.value.add = true
    try {
      const { data } = await api.post('/web-api/pengguna', buildFormData(user), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (error) {
      console.error('Gagal menambah data user:', error)
      throw error
    } finally {
      isLoading.value.add = false
    }
  }

  const apiResetPhoneId = async (id) => {
    isLoading.value.add = true
    try {
      const { data } = await api.get(`/web-api/pengguna/${id}/reset`)
      return data
    } catch (error) {
      console.error('Gagal menambah data user:', error)
      throw error
    } finally {
      isLoading.value.add = false
    }
  }
  const apiResetPassword = async (id) => {
    isLoading.value.add = true
    try {
      const { data } = await api.get(`/web-api/pengguna/${id}/reset/password`)
      return data
    } catch (error) {
      console.error('Gagal menambah data user:', error)
      throw error
    } finally {
      isLoading.value.add = false
    }
  }

  const apiPutUpdate = async (user, id) => {
    isLoading.value.update = true
    try {
      const { data } = await api.post(`/web-api/pengguna/${id}`, buildFormData(user, true), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (error) {
      console.error('Gagal memperbarui data user:', error)
      throw error
    } finally {
      isLoading.value.update = false
    }
  }

  // Fungsi untuk print data perusahaan
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/pengguna/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data perusahaan
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/pengguna/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data perusahaan:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  return {
    headers,
    isLoading,
    apiGetCompany,
    apiGetDepartement,
    apiGetPosition,
    apiGetLevel,
    apiResetPhoneId,
    apiResetPassword,
    apiGetUser,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiDownloadPrint,
    apiExport
  }
})
