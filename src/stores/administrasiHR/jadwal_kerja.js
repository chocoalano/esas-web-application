import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useJadwalKerjaStore = defineStore('jadwalKerja', () => {
  // Headers bersifat statis, jadi bisa didefinisikan dengan computed untuk kemudahan akses
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: true, key: "user.company.name" },
    { title: "Nama Departemen", align: "start", sortable: true, key: "employee.departement.name" },
    { title: "Nama Jadwal", align: "start", sortable: true, key: "timework.name" },
    { title: "Jam Masuk", align: "start", sortable: true, key: "timework.in" },
    { title: "Jam Pulang", align: "start", sortable: true, key: "timework.out" },
    { title: "Tgl", align: "start", sortable: true, key: "work_day" },
    { title: "NIP", align: "start", sortable: true, key: "user.nip" },
    { title: "Nama Pengguna", align: "start", sortable: true, key: "user.name" },
    { title: "Waktu Dibuat", align: "end", sortable: true, key: "created_at" },
    { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "updated_at" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({
    list: false,
    show: false,
    add: false,
    update: false,
    delete: false
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

  const apiGetCompany = () => fetchData('/web-api/kelengkapan-form/all-company')
  const apiGetDepartement = (company_id) => {
    console.log(company_id);

    const endpoint = company_id
      ? '/web-api/kelengkapan-form/filter-departement'
      : '/web-api/kelengkapan-form/all-departement'
    const params = company_id ? { company_id } : {}
    return fetchData(endpoint, params)
  }
  const apiGetPengguna = (company_id, departement_id) => {
    const endpoint = company_id && departement_id
      ? '/web-api/kelengkapan-form/filter-user'
      : '/web-api/kelengkapan-form/all-user'
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    return fetchData(endpoint, params)
  }
  const apiGetJamKerja = (company_id, departement_id) => {
    const endpoint = company_id && departement_id
      ? '/web-api/kelengkapan-form/filter-timework'
      : '/web-api/kelengkapan-form/all-timework'
    const params = company_id && departement_id ? { company_id, departement_id } : {}
    return fetchData(endpoint, params)
  }
  // Fungsi untuk mengambil data jadwal-kerja dengan pagination
  async function apiListPaginate({ page = 1, itemsPerPage = 10, sortBy, search }) {
    isLoading.value.list = true;

    try {
      const { data } = await api.get('/web-api/jadwal-kerja', {
        params: { page, limit: itemsPerPage, sortBy, search }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data jadwal-kerja:', error);
      throw error; // Melempar error agar bisa ditangani di luar
    } finally {
      isLoading.value.list = false;
    }
  }

  // Fungsi untuk mengambil detail perusahaan
  async function apiGetShow(id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/jadwal-kerja/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data jadwal-kerja:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk menambah data jadwal-kerja dengan form
  async function apiPostAdd(form) {
    isLoading.value.add = true;
    const t = toRaw(form)
    try {
      const { data } = await api.post('/web-api/jadwal-kerja', t,)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menambah data jadwal-kerja:', error);
      throw error;
    } finally {
      isLoading.value.add = false;
    }
  }

  // Fungsi untuk memperbaharui data jadwal-kerja dengan form
  async function apiPutUpdate(form, id) {
    isLoading.value.update = true;
    try {
      const { data } = await api.post(`/web-api/jadwal-kerja/${id}`, form)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal memperbaharui data jadwal-kerja:', error);
      throw error;
    } finally {
      isLoading.value.update = false;
    }
  }

  // Fungsi untuk menghapus data jadwal-kerja
  async function apiDelete(id) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.delete(`/web-api/jadwal-kerja/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data jadwal-kerja:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk print data jadwal-kerja
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/jadwal-kerja/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data jadwal-kerja:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data jadwal-kerja
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/jadwal-kerja/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data jadwal-kerja:', error);
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
    apiGetPengguna,
    apiGetJamKerja,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiDelete,
    apiDownloadPrint,
    apiExport
  }
})
