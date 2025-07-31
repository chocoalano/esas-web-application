// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const usePerusahaanFormStore = defineStore('perusahaanForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    name: '', // Sesuai dengan v-model di template
    latitude: null,
    longitude: null,
    radius: null,
    full_address: '', // Sesuai dengan v-model di template
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

  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/general-module/companies/${id}/edit`);
      const data = response.data.data;
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      formData.name = data.name || '';
      formData.latitude = data.latitude || null;
      formData.longitude = data.longitude || null;
      formData.radius = data.radius || null;
      formData.full_address = data.full_address || ''; // Asumsi 'full_address' dari API
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
      // setErrors({ fetch: 'Gagal memuat data perusahaan untuk diedit.' });
    } finally {
      isLoading.value = false;
    }
  }

  async function CREATE_ACTION(dataToSave) { // Ganti parameter menjadi dataToSave
    isLoading.value = true;
    clearErrors();
    try {
      const response = await api.post(`/general-module/companies`, dataToSave);
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
      const response = await api.put(`/general-module/companies/${id}`, dataToSave);
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
    EDIT_DATA_ACTION,
    CREATE_ACTION,
    UPDATE_ACTION,
    resetForm,
    setErrors,
    clearErrors,
  };
});
