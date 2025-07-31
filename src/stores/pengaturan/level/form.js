// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('levelForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    company_id: null,
    departement_id: null,
    name: '',
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
  const companyOptions = reactive([]);
  const departemenOptions = reactive([]);
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
      const response = await api.get(`/hris-module/job-levels/create`);
      const data = response.data.form;
      this.companyOptions = data.company
      this.departemenOptions = data.departemen
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }
  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/job-levels/${id}/edit`);
      const data = response.data.data;
      const form = response.data.form;
      this.companyOptions = form.company
      this.departemenOptions = form.departemen
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      formData.company_id = data.company_id || null;
      formData.departement_id = data.departement_id || null;
      formData.name = data.name || ''; // Asumsi 'full_address' dari API
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
      const response = await api.post(`/hris-module/job-levels`, dataToSave);
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
      const response = await api.put(`/hris-module/job-levels/${id}`, dataToSave);
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
