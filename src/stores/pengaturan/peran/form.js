// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('peranForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    name: '',
    user_id: [],
    permission: [],
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
  const userOptions = reactive([]);
  const permissionOptions = reactive([]);
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
      const response = await api.get(`/general-module/roles/create`);
      const data = response.data.form;
      this.userOptions = data.users
      this.permissionOptions = data.permissions
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }
  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/general-module/roles/${id}/edit`);
      const data = response.data.data;
      const form = response.data.form;
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      formData.name = data.name || null;
      formData.user_id = data.user_ids || null;
      formData.permission = data.permission_ids || null;
      this.userOptions = form.users
      this.permissionOptions = form.permissions
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
      const response = await api.post(`/general-module/roles`, dataToSave);
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
      const response = await api.put(`/general-module/roles/${id}`, dataToSave);
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
    userOptions,
    permissionOptions,

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
