// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('jam_kerjaForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    company_id: null,
    departemen_id: null,
    name: '',
    in: null,
    out: null,
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
      const response = await api.get(`/hris-module/time-workes/create`);
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
      const response = await api.get(`/hris-module/time-workes/${id}/edit`);
      const data = response.data.data;
      const form = response.data.form;
      this.companyOptions = form.company
      this.departemenOptions = form.departemen
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      formData.company_id = data.company_id || null;
      formData.departemen_id = data.departemen_id || null;
      formData.name = data.name || '';
      formData.in = data.in || null;
      formData.out = data.out || null;
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
      const response = await api.post(`/hris-module/time-workes`, dataToSave);
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
      const response = await api.put(`/hris-module/time-workes/${id}`, dataToSave);
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
