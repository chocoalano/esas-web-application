// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('jadwal-shiftForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    company_id: null,
    departement: null,
    user_id: [],
    time_work_id: null,
    time_work_rolling_id: null,
    is_rolling: false,
    work_day_start: null,
    work_day_finish: null,
    dayoff: [],
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
  const companyOptions = reactive([]);
  const departemenOptions = reactive([]);
  const userOptions = reactive([]);
  const timeOptions = reactive([]);
  const isLoading = ref(false);
  const isFormSubmitted = ref(false); // Bisa dihapus jika tidak terpakai

  // --- Getters ---
  const getIsLoading = computed(() => isLoading.value);
  const getIsFormSubmitted = computed(() => isFormSubmitted.value);

  // --- Actions ---
  function resetForm() {
    Object.assign(formData, createInitialFormData());
    clearErrors();
    isFormSubmitted.value = false;
  }

  function setErrors(newErrors = {}) {
    clearErrors();
    Object.assign(errors, newErrors);
  }

  function clearErrors() {
    Object.keys(errors).forEach(key => delete errors[key]);
  }

  async function CREATE_DATA_ACTION() {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/time-user-schedules/create`, {
        params: {
          company_id: formData.company_id,
          departement_id: formData.departement,
        },
      });
      const data = response.data.form;
      this.companyOptions = data.company
      this.departemenOptions = data.departement
      this.userOptions = data.users
      this.timeOptions = data.timeworks
      return response
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }
  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/time-user-schedules/${id}/edit`);
      const data = response.data.data;
      const form = response.data.form;
      this.companyOptions = form.company
      this.departemenOptions = form.departement
      this.userOptions = form.users
      this.timeOptions = form.timeworks
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      formData.company_id = data.company_id || null;
      formData.departement = data.departement_id || null;
      formData.user_id = [data.user_id] || [];
      formData.time_work_id = data.time_work_id || null;
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function CREATE_ACTION(dataToSave) { // Ganti parameter menjadi dataToSave
    isLoading.value = true;
    clearErrors();
    try {
      const response = await api.post(`/hris-module/time-user-schedules`, dataToSave);
      return {
        success: true,
        message: response.data.message || 'Data perusahaan berhasil disimpan.',
        data: response.data,
      };
    } catch (err) {
      const res = err.response?.data;
      setErrors(res?.errors || {});
      return {
        success: false,
        message: res?.message || 'Terjadi kesalahan saat menyimpan data perusahaan.',
        errors: res?.errors || {},
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function UPDATE_ACTION(id, dataToSave) { // Ganti parameter data menjadi dataToSave
    isLoading.value = true;
    clearErrors();
    try {
      const response = await api.put(`/hris-module/time-user-schedules/${id}`, dataToSave);
      return {
        success: true,
        message: response.data.message || 'Data perusahaan berhasil diperbarui.',
        data: response.data,
      };
    } catch (err) {
      const res = err.response?.data;
      setErrors(res?.errors || {});
      return {
        success: false,
        message: res?.message || 'Terjadi kesalahan saat memperbarui data perusahaan.',
        errors: res?.errors || {},
      };
    } finally {
      isLoading.value = false;
    }
  }

  // --- Return Store ---
  return {
    // State
    formData,
    errors,
    isLoading,
    isFormSubmitted,
    companyOptions,
    departemenOptions,
    userOptions,
    timeOptions,

    // Getters
    getIsLoading,
    getIsFormSubmitted,

    // Actions
    CREATE_DATA_ACTION,
    EDIT_DATA_ACTION,
    CREATE_ACTION,
    UPDATE_ACTION,
    resetForm,
    setErrors,
    clearErrors,
  };
});
