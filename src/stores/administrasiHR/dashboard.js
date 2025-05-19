import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useDashboardHrStore = defineStore('dashboard', () => {

  const isLoading = ref({
    company: false,
  });

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

  const apiGetCompany = () => fetchData('/web-api/kelengkapan-form/all-company', {}, 'company')

  async function apiCountUser(company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/akun`, {
        params: { company_id }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountDepartement(company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/departemen`, {
        params: { company_id }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountPosisi(company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/posisi`, {
        params: { company_id }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountAbsen(start, end, company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/absen`, {
        params: { start, end, company_id }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountIzin(start, end, company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/izin`, {
        params: { start, end, company_id }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data izin:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountAbsenSekarang(company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/absen`, {
        params: { company_id, now: true }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absen saat ini:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountAbsenAlphaSekarang(company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/absen-alpha`, {
        params: { company_id, now: true }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absen alpha saat ini:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiCountAbsenLateSekarang(company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/absen-telat`, {
        params: { company_id, now: true }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absen terlambat saat ini:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }
  async function apiChartAbsen(start, end, company_id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/dashboard-hr/absen-chart`, {
        params: { company_id, start, end }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absen chart:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  return {
    isLoading,
    apiGetCompany,
    apiCountUser,
    apiCountDepartement,
    apiCountPosisi,
    apiCountAbsen,
    apiCountIzin,
    apiCountAbsenSekarang,
    apiCountAbsenAlphaSekarang,
    apiCountAbsenLateSekarang,
    apiChartAbsen,
  }
})
