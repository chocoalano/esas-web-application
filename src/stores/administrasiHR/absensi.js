import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useAbsensiStore = defineStore('absensi', () => {
  // Headers bersifat statis, jadi bisa didefinisikan dengan computed untuk kemudahan akses
  const headers = computed(() => [
    { title: "Nama Perusahaan", align: "start", sortable: false, key: "user.company.name" },
    { title: "Departement", align: "start", sortable: false, key: "user.employee.departement.name" },
    { title: "NIP", align: "start", sortable: true, key: "user.nip" },
    { title: "Nama", align: "start", sortable: true, key: "user.name" },
    { title: "Jam Masuk", align: "end", sortable: true, key: "time_in" },
    { title: "TD. Masuk", align: "end", sortable: false, key: "type_in" },
    // { title: "Status Masuk", align: "end", sortable: false, key: "status_in" },
    { title: "Jam Pulang", align: "end", sortable: true, key: "time_out" },
    { title: "TD. Pulang", align: "end", sortable: false, key: "type_out" },
    // { title: "Status Pulang", align: "end", sortable: false, key: "status_out" },
    { title: "Waktu Dibuat", align: "end", sortable: true, key: "created_at" },
    // { title: "Waktu Diperbaharui", align: "end", sortable: true, key: "updated_at" },
    { title: '#', key: 'actions', align: 'end', sortable: false },
  ])

  const isLoading = ref({
    list: false,
    show: false,
    add: false,
    update: false,
    delete: false
  });

  function buildFormData(form, isUpdate = false) {
    const t = toRaw(form)
    const formData = new FormData()
    if (isUpdate) formData.append('_method', 'PUT')

    const appendIfExists = (key, value) => {
      if (value !== undefined && value !== null) formData.append(key, value)
    }

    // Basic Info
    appendIfExists('user_id', t.user_id)
    appendIfExists('user_timework_schedule_id', t.user_timework_schedule_id)
    appendIfExists('time_in', t.time_in)
    appendIfExists('time_out', t.time_out)
    appendIfExists('type_in', t.type_in)
    appendIfExists('type_out', t.type_out)
    appendIfExists('lat_in', t.lat_in)
    appendIfExists('lat_out', t.lat_out)
    appendIfExists('long_in', t.long_in)
    appendIfExists('long_out', t.long_out)
    appendIfExists('status_in', t.status_in)
    appendIfExists('status_out', t.status_out)
    if (t.image_in) formData.append('image_in', t.image_in)
    if (t.image_out) formData.append('image_out', t.image_out)

    return formData
  }

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
  const apiGetSchedule = (company_id, departement_id, user_id) => {
    const endpoint = company_id && departement_id && user_id
      ? '/web-api/kelengkapan-form/filter-schedule'
      : '/web-api/kelengkapan-form/all-schedule'
    console.log(company_id, departement_id, user_id);

    const params = company_id && departement_id ? { company_id, departement_id, user_id } : {}
    return fetchData(endpoint, params)
  }

  // Fungsi untuk mengambil data absensi dengan pagination
  async function apiListPaginate({ page = 1, itemsPerPage = 10, sortBy, search }) {
    isLoading.value.list = true;

    try {
      const { data } = await api.get('/web-api/absensi', {
        params: { page, limit: itemsPerPage, sortBy, search }
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
      throw error; // Melempar error agar bisa ditangani di luar
    } finally {
      isLoading.value.list = false;
    }
  }

  // Fungsi untuk mengambil detail perusahaan
  async function apiGetShow(id) {
    isLoading.value.show = true;
    try {
      const { data } = await api.get(`/web-api/absensi/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal mengambil data absensi:', error);
      throw error;
    } finally {
      isLoading.value.show = false;
    }
  }

  // Fungsi untuk menambah data absensi dengan form
  async function apiPostAdd(form) {
    isLoading.value.add = true;
    try {
      const { data } = await api.post('/web-api/absensi', buildFormData(form), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menambah data absensi:', error);
      throw error;
    } finally {
      isLoading.value.add = false;
    }
  }

  // Fungsi untuk memperbaharui data absensi dengan form
  async function apiPutUpdate(form, id) {
    isLoading.value.update = true;
    try {
      const { data } = await api.post(`/web-api/absensi/${id}`, buildFormData(form, true), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data;
    } catch (error) {
      console.error('Gagal memperbaharui data absensi:', error);
      throw error;
    } finally {
      isLoading.value.update = false;
    }
  }

  // Fungsi untuk menghapus data absensi
  async function apiDelete(id) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.delete(`/web-api/absensi/${id}`)
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data absensi:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk print data absensi
  async function apiDownloadPrint(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/absensi/download`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal download pdf data absensi:', error);
      throw error;
    } finally {
      isLoading.value.delete = false;
    }
  }

  // Fungsi untuk export data absensi
  async function apiExport(filter) {
    isLoading.value.delete = true;
    try {
      const { data } = await api.get(`/web-api/absensi/export`, { params: filter, responseType: 'blob' })
      return data; // Mengembalikan data agar bisa digunakan
    } catch (error) {
      console.error('Gagal menghapus data absensi:', error);
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
    apiGetSchedule,
    apiListPaginate,
    apiGetShow,
    apiPostAdd,
    apiPutUpdate,
    apiDelete,
    apiDownloadPrint,
    apiExport
  }
})
