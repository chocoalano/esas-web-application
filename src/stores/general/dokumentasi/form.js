// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('dokumentasiForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    title: '',
    subtitle: '',
    status: false,
    text_docs: '',
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
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

  async function CREATE_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/general-module/documentations/create`);
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
      const response = await api.get(`/general-module/documentations/${id}/edit`);
      const data = response.data.data;
      formData.title = data.title ?? null;
      formData.subtitle = data.subtitle ?? false;
      formData.status = data.status ?? null;
      formData.text_docs = data.text_docs ?? null;
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
      const response = await api.post(`/general-module/documentations`, formData);
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
      const response = await api.put(`/general-module/documentations/${id}`, formData);
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
