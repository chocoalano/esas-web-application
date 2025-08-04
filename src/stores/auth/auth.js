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
  function buildFormData(datapost, isput = true) {
    const formData = new FormData()
    if (isput) {
      formData.append('_method', 'PUT')
    }
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

  async function GET_FORM_PROFILE_ATTRIBUTE() {
    try {
      isLoading.value = true
      const q = profile.value
      const res = await api.get('/general-module/users/create', {
        params: {
          company_id: q.company_id,
          dept_id: q.employee.departement_id,
          post_id: q.employee.job_position_id,
          lvl_id: q.employee.job_level_id,
        }
      })
      return res
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  async function LOGOUT_ACTION() {
    try {
      isLoading.value = true
      await api.get('/general-module/auth/logout')
      token.value = null
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Login
  async function LOGIN_ACTION(formLogin) {
    try {
      isLoading.value = true
      const res = await api.post('/general-module/auth/login', formLogin)
      setToken(res.data.token)
      await GET_PROFILE_ACTION()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Ambil profile
  async function GET_PROFILE_ACTION() {
    try {
      isLoading.value = true
      const res = await api.get('/general-module/auth')
      setProfile(res.data.user)
      setPermission(res.data.permissions)
      return res.data
    } catch (error) {
      console.error('Fetching profile failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Kirim profile update
  async function POST_PROFILE_ACTION(datapost) {
    try {
      isLoading.value = true
      const formData = buildFormData(datapost, true)
      const res = await api.post('/general-module/auth', formData, {
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

  async function GET_PEMBERITAHUAN_ACTION(page, limit, start, end) {
    try {
      isLoading.value = true
      const { data } = await api.get('/general-module/notifications', {
        params: { page, limit, start, end }
      })
      return data;
    } catch (error) {
      console.error('Gagal mengambil data pemberitahuan:', error);
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function GET_READ_PEMBERITAHUAN_ACTION(id) {
    try {
      isLoading.value = true
      const response = await api.get(`/general-module/notifications/${id}`)
      return response;
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
    LOGIN_ACTION,
    LOGOUT_ACTION,
    GET_PROFILE_ACTION,
    POST_PROFILE_ACTION,
    GET_FORM_PROFILE_ATTRIBUTE,
    GET_PEMBERITAHUAN_ACTION,
    GET_READ_PEMBERITAHUAN_ACTION
  }
})
