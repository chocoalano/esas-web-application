// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('laporanBugForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    title: '',
    status: false,
    message: '',
    platform: '',
    image: null,
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
  const isLoading = ref(false);
  const isFormSubmitted = ref(false); // Bisa dihapus jika tidak terpakai

  // --- Getters ---
  const getIsLoading = computed(() => isLoading.value);
  const getIsFormSubmitted = computed(() => isFormSubmitted.value);

  function buildFormDataToSend(isUpdate = false) {
    const fd = new FormData();

    if (isUpdate) {
      fd.append('_method', 'PUT'); // Simulate PUT request for Laravel
    }

    for (const key in formData) {
      const value = formData[key];
      if (key === 'image') {
        if (value instanceof File) {
          fd.append(key, value);
        }
      } else if (value !== null && value !== undefined) {
        if (key === 'status') {
          fd.append(key, value ? 1 : 0);
        } else {
          fd.append(key, value);
        }
      }
    }
    return fd;
  }

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

  async function CREATE_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/general-module/bug-reports/create`);
      const data = response.data.form;
      return data
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }
  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/general-module/bug-reports/${id}/edit`);
      const data = response.data.data;
      const form = response.data.form;
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      formData.title = data.title ?? null;
      formData.status = data.status ?? false;
      formData.message = data.message ?? null;
      formData.platform = data.platform ?? null;
      formData.image = data.image ?? null;
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function CREATE_ACTION() { // Ganti parameter menjadi dataToSave
    isLoading.value = true;
    clearErrors();
    try {
      const response = await api.post(`/general-module/bug-reports`, buildFormDataToSend(false), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response
    } catch (err) {
      const res = err.response?.data;
      setErrors(res?.errors || {});
      return err
    } finally {
      isLoading.value = false;
    }
  }

  async function UPDATE_ACTION(id) { // Ganti parameter data menjadi dataToSave
    isLoading.value = true;
    clearErrors();
    try {
      const response = await api.post(`/general-module/bug-reports/${id}`, buildFormDataToSend(true), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response
    } catch (err) {
      const res = err.response?.data;
      setErrors(res?.errors || {});
      return err
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
