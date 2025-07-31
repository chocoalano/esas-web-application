// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useFormStore = defineStore('absenForm', () => {
  // --- State Initialization ---
  const createInitialFormData = () => ({
    company_id: '',
    departement_id: '',
    user_id: '',
    user_timework_schedule_id: '',
    time_in: '',
    time_out: '',
    type_in: '',
    type_out: '',
    lat_in: '',
    lat_out: '',
    long_in: '',
    long_out: '',
    image_in: null, // Will hold File object for new upload, or string (URL) for existing
    image_out: null, // Will hold File object for new upload, or string (URL) for existing
    status_in: '',
    status_out: '',
    // Add other fields from your form if any are missing
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
  const companyOptions = ref([]);
  const deptOptions = ref([]);
  const userOptions = ref([]);
  const scheduleOptions = ref([]);
  const isLoading = ref(false);
  // isFormSubmitted can be removed if not directly used in UI to show submission status
  // const isFormSubmitted = ref(false);

  // --- Getters ---
  const getIsLoading = computed(() => isLoading.value);
  // const getIsFormSubmitted = computed(() => isFormSubmitted.value); // If removed above, remove here too

  // --- Actions ---

  /**
   * Resets the form data, errors, and dropdown options to initial states.
   */
  function resetForm() {
    // Reset reactive object by assigning a new object
    Object.assign(formData, createInitialFormData());
    clearErrors();
    // isFormSubmitted.value = false; // If removed, remove here
    companyOptions.value = [];
    deptOptions.value = [];
    userOptions.value = [];
    scheduleOptions.value = [];
  }

  /**
   * Sets validation errors from API response.
   * @param {Object} newErrors - New errors object.
   */
  function setErrors(newErrors = {}) {
    clearErrors(); // Clear existing errors first
    Object.assign(errors, newErrors); // Assign new errors
  }

  /**
   * Clears all current validation errors.
   */
  function clearErrors() {
    for (const key in errors) {
      delete errors[key];
    }
  }

  // --- Helper functions for clearing specific options ---
  function clearCompanyOptions() { companyOptions.value = []; }
  function clearDeptOptions() { deptOptions.value = []; }
  function clearUserOptions() { userOptions.value = []; }
  function clearScheduleOptions() { scheduleOptions.value = []; }

  /**
   * Builds FormData object for multipart/form-data requests.
   * Handles file inputs and _method for PUT/PATCH simulation.
   * @param {boolean} isUpdate - True if this is an update operation (adds _method: 'PUT').
   * @param {Object} currentFormData - The reactive formData object.
   * @returns {FormData}
   */
  function buildFormDataToSend(isUpdate = false) {
    const fd = new FormData();

    if (isUpdate) {
      fd.append('_method', 'PUT'); // Simulate PUT request for Laravel
    }

    for (const key in formData) {
      const value = formData[key];
      console.log(`${key} : ${value}`);

      if (key === 'image_in' || key === 'image_out') {
        if (value instanceof File) {
          fd.append(key, value);
        }
      } else if (value !== null && value !== undefined) {
        // Append other non-null/undefined fields
        fd.append(key, value);
      }
    }
    return fd;
  }

  /**
   * Fetches data for creating a new attendance record form.
   */
  async function CREATE_DATA_ACTION() {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/user-attendances/create`, {
        params: {
          company_id: formData.company_id,
          departement_id: formData.departement_id,
          user_id: formData.user_id,
        }
      });
      const data = response.data.form;

      companyOptions.value = data.company || [];
      deptOptions.value = data.departement || [];
      userOptions.value = data.users || [];
      scheduleOptions.value = data.schedule || [];

    } catch (err) {
      console.error('Error fetching create form data:', err);
      // Optionally, set a global error message or specific errors
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetches data for editing an existing attendance record form.
   * @param {number} id - The ID of the attendance record to edit.
   */
  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/user-attendances/${id}/edit`, {
        params: {
          company_id: formData.company_id, // These might be used to filter initial options
          departement_id: formData.departement_id,
          user_id: formData.user_id,
        }
      });
      const data = response.data.data; // The specific attendance record
      const formOptions = response.data.form; // Data for dropdown options

      // Update dropdown options
      companyOptions.value = formOptions.company || [];
      deptOptions.value = formOptions.departement || [];
      userOptions.value = formOptions.users || [];
      scheduleOptions.value = formOptions.schedule || [];

      // Populate formData with existing attendance record data
      formData.company_id = data.company_id;
      formData.departement_id = data.departement_id;
      formData.user_id = data.user_id;
      formData.user_timework_schedule_id = data.user_timework_schedule_id;
      formData.time_in = data.time_in ?? '';
      formData.time_out = data.time_out ?? '';
      formData.type_in = data.type_in ?? '';
      formData.type_out = data.type_out ?? '';
      formData.lat_in = data.lat_in ?? '';
      formData.lat_out = data.lat_out ?? '';
      formData.long_in = data.long_in ?? '';
      formData.long_out = data.long_out ?? '';
      // For images, store the URL from the API. The v-file-input will show "null"
      // but if user selects a new file, it will be a File object.
      // Your backend should handle if 'image_in' is URL (no change) or File (new upload).
      formData.image_in = data.image_in ?? null;
      formData.image_out = data.image_out ?? null;
      formData.status_in = data.status_in ?? '';
      formData.status_out = data.status_out ?? '';
      console.log(formData);

    } catch (err) {
      console.error('Error fetching edit form data:', err);
      // Optionally, set a global error message or specific errors
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Sends a POST request to create a new attendance record.
   * @returns {Promise<Object>} Object with success status, message, and optional data/errors.
   */
  async function CREATE_ACTION() {
    isLoading.value = true;
    clearErrors();
    try {
      const payload = buildFormDataToSend(false); // isUpdate = false
      const response = await api.post(`/hris-module/user-attendances`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (err) {
      const res = err.response?.data;
      setErrors(res?.errors || {});
      console.error('Error creating attendance record:', err);
      return {
        success: false,
        message: res?.message || 'Terjadi kesalahan saat menyimpan data absensi.',
        errors: res?.errors || {},
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Sends a POST request (with _method=PUT) to update an existing attendance record.
   * @param {number} id - The ID of the attendance record to update.
   * @returns {Promise<Object>} Object with success status, message, and optional data/errors.
   */
  async function UPDATE_ACTION(id) {
    isLoading.value = true;
    clearErrors();
    try {
      const payload = buildFormDataToSend(true); // isUpdate = true
      // Use POST method for Laravel's _method simulation
      const response = await api.post(`/hris-module/user-attendances/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (err) {
      const res = err.response?.data;
      setErrors(res?.errors || {});
      console.error('Error updating attendance record:', err);
      return {
        success: false,
        message: res?.message || 'Terjadi kesalahan saat memperbarui data absensi.',
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
    // isFormSubmitted, // If removed, remove from here
    companyOptions,
    deptOptions,
    userOptions,
    scheduleOptions,

    // Getters
    getIsLoading,
    // getIsFormSubmitted, // If removed, remove from here

    // Actions
    CREATE_DATA_ACTION,
    EDIT_DATA_ACTION,
    CREATE_ACTION,
    UPDATE_ACTION,
    resetForm,
    setErrors,
    clearErrors,
    clearCompanyOptions,
    clearDeptOptions,
    clearUserOptions,
    clearScheduleOptions,
  };
});
