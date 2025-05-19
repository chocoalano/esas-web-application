import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('authToken') || null)
  const permission = ref([])
  const profile = ref({})
  const isLoading = ref(false)

  // Token handler
  function setToken(newToken) {
    token.value = newToken
  }

  function setPermission(newPermission) {
    permission.value = newPermission
  }

  function setProfile(newProfile) {
    profile.value = newProfile
  }

  // Helper untuk membuat FormData nested sesuai Laravel dot notation
  function buildFormData(datapost) {
    const formData = new FormData()
    const appendFormData = (data, parentKey = '') => {
      for (const key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue
        const value = data[key]
        if (value === null || value === undefined) continue
        const formKey = parentKey ? `${parentKey}[${key}]` : key
        if (value instanceof File || value instanceof Blob) {
          formData.append(formKey, value, value.name)
        } else if (typeof value === 'object' && !(value instanceof Date)) {
          appendFormData(value, formKey)
        } else {
          formData.append(formKey, value)
        }
      }
    }
    appendFormData(datapost)
    return formData
  }

  async function fetchData(endpoint, params = {}, type = 'show') {
    isLoading.value = true
    try {
      const { data } = await api.get(endpoint, { params })
      return data
    } catch (error) {
      console.error(`Gagal mengambil data dari ${endpoint}:`, error)
      throw error
    } finally {
      isLoading.value = false
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

  // Logout
  async function logout() {
    try {
      isLoading.value = true
      await api.get('/web-auth/logout')
      token.value = null
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Login
  async function login(formLogin) {
    try {
      isLoading.value = true
      const res = await api.post('/web-auth/login', formLogin)
      setToken(res.data.data.token)
      await getPermission()
      await getProfile()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Ambil permission
  async function getPermission() {
    try {
      isLoading.value = true
      const res = await api.get('/web-auth/permission')
      setPermission(res.data.data.permissions)
    } catch (error) {
      console.error('Fetching permissions failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Ambil profile
  async function getProfile() {
    try {
      isLoading.value = true
      const res = await api.get('/web-auth/profile')
      setProfile(res.data.data)
      return res.data.data
    } catch (error) {
      console.error('Fetching profile failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Kirim profile update
  async function postProfile(datapost) {
    try {
      isLoading.value = true
      const formData = buildFormData(datapost)
      const res = await api.post('/web-auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data.data
    } catch (error) {
      console.error('Posting profile failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function getPemberitahuan(page, start, end) {
    try {
      isLoading.value = true
      const { data } = await api.get('/web-auth/pemberitahuan', {
        params: { page, start, end }
      })
      return data;
    } catch (error) {
      console.error('Gagal mengambil data pemberitahuan:', error);
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function getReadPemberitahuan(id) {
    try {
      isLoading.value = true
      const { data } = await api.get(`/web-auth/pemberitahuan/${id}`)
      return data;
    } catch (error) {
      console.error('Gagal mengambil data pemberitahuan:', error);
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Login status
  const isAuthenticated = computed(() => Boolean(token.value))

  // Sinkronisasi token dengan localStorage
  watch(token, (newToken) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken)
    } else {
      localStorage.removeItem('authToken')
    }
  })

  return {
    token,
    permission,
    profile,
    isAuthenticated,
    isLoading,
    setToken,
    setPermission,
    setProfile,
    login,
    logout,
    getPermission,
    getProfile,
    postProfile,
    apiGetCompany,
    apiGetDepartement,
    apiGetPosition,
    apiGetLevel,
    apiGetUser,
    getPemberitahuan,
    getReadPemberitahuan
  }
})
