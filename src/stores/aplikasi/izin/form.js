// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';
import dayjs from 'dayjs';

export const useFormStore = defineStore('izinForm', () => {
  // --- State ---
  const createInitialFormData = () => ({
    company_id: null,
    departement_id: null,
    user_id: null,
    permit_type_id: null,
    user_timework_schedule_id: null,
    permit_numbers: null,
    timein_adjust: null,
    timeout_adjust: null,
    current_shift_id: null,
    adjust_shift_id: null,
    start_date: null,
    end_date: null,
    start_time: null,
    end_time: null,
    notes: '',
    file: null,
    filename: null,
  });

  const formData = reactive(createInitialFormData());
  const errors = reactive({});
  const companyOptions = reactive([]);
  const departemenOptions = reactive([]);
  const userOptions = reactive([]);
  const permitOptions = reactive([]);
  const scheduleOptions = reactive([]);
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

  function buildFormData(isUpdate = false, form = {}) {
    const fd = new FormData()
    if (isUpdate) {
      fd.append('_method', 'PUT')
    }
    for (const [key, value] of Object.entries(form)) {
      if (value !== null && value !== undefined) {
        let finalValue = value
        if (key === 'start_date' || key === 'end_date') {
          finalValue = dayjs(value).format('YYYY-MM-DD')
        }
        fd.append(key, finalValue)
      }
    }
    return fd
  }

  async function CREATE_DATA_ACTION() {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/permits/create`, {
        params: {
          companyId: formData.company_id,
          deptId: formData.departement_id,
          userId: formData.user_id,
          typeId: formData.permit_type_id,
          scheduleId: formData.user_timework_schedule_id
        }
      });
      const data = response.data.form;
      this.formData.permit_numbers = data.permit_numbers
      this.companyOptions = data.companies
      this.departemenOptions = data.departments
      this.userOptions = data.users
      this.permitOptions = data.permit_types
      this.scheduleOptions = data.schedules
    } catch (err) {
      console.error('Gagal mengambil data perusahaan:', err);
    } finally {
      isLoading.value = false;
    }
  }
  async function EDIT_DATA_ACTION(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/hris-module/permits/${id}/edit`, {
        params: {
          companyId: formData.company_id,
          deptId: formData.departement_id,
          userId: formData.user_id,
          typeId: formData.permit_type_id,
          scheduleId: formData.user_timework_schedule_id
        }
      });
      const data = response.data.data;
      const form = response.data.form;

      this.formData.permit_numbers = form.permit_numbers
      this.companyOptions = form.companies
      this.departemenOptions = form.departments
      this.userOptions = form.users
      this.permitOptions = form.permit_types
      this.scheduleOptions = form.schedules
      // Memetakan data dari API ke formData sesuai struktur yang diharapkan
      // Penting: Pastikan properti 'data' dari API sesuai dengan properti formData
      Object.assign(formData, {
        company_id: data.user?.company_id ?? null,
        departement_id: data.user?.employee?.departement_id ?? null,
        user_id: data.user_id ?? null,
        permit_type_id: data.permit_type_id ?? null,
        user_timework_schedule_id: data.user_timework_schedule_id ?? null,
        permit_numbers: data.permit_numbers ?? null,
        timein_adjust: data.timein_adjust ?? null,
        timeout_adjust: data.timeout_adjust ?? null,
        current_shift_id: data.current_shift_id ?? null,
        adjust_shift_id: data.adjust_shift_id ?? null,
        start_date: data.start_date ?? null,
        end_date: data.end_date ?? null,
        start_time: data.start_time ?? null,
        end_time: data.end_time ?? null,
        notes: data.notes ?? '',
        file: null, // biasanya tidak dimuat saat edit
        filename: data.file ?? null,
      })
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
      const fd = buildFormData(false, dataToSave);
      const response = await api.post(`/hris-module/permits`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response
    } catch (err) {
      return err
    } finally {
      isLoading.value = false;
    }
  }

  async function UPDATE_ACTION(id, dataToSave) { // Ganti parameter data menjadi dataToSave
    isLoading.value = true;
    clearErrors();
    try {
      const fd = buildFormData(true, dataToSave);
      const response = await api.post(`/hris-module/permits/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response
    } catch (err) {
      return err
    } finally {
      isLoading.value = false;
    }
  }

  // --- Return Store ---
  return {
    // State
    companyOptions,
    departemenOptions,
    userOptions,
    permitOptions,
    scheduleOptions,
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
