import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useAbsensiDasborStore = defineStore('dasborAbsensi', () => {

  const isLoading = ref({
    company: false,
    charts: false,
    stats: false,
  });

  async function DASHBOARD_ACTION(start, end, company_id) {
    isLoading.value.stats = true;
    try {
      const { data } = await api.get(`/hris-dashboard`, {
        params: { start, end, company_id }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      throw error;
    } finally {
      isLoading.value.stats = false;
    }
  }
  async function GET_CHART_ACTION(start, end, company_id) {
    isLoading.value.charts = true;
    try {
      const { data } = await api.get(`/hris-dashboard/attendance-chart`, {
        params: { company_id, start, end }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      throw error;
    } finally {
      isLoading.value.charts = false;
    }
  }
  async function GET_COMPANY_ACTION() {
    isLoading.value.company = true;
    try {
      const res = await api.get(`/hris-dashboard/company`)
      return res;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value.company = false;
    }
  }

  return {
    isLoading,
    DASHBOARD_ACTION,
    GET_CHART_ACTION,
    GET_COMPANY_ACTION,
  }
})
