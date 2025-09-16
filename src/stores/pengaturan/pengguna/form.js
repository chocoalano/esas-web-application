// stores/userFormStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { api } from '@/plugins/axios';

export const useUserFormStore = defineStore('userForm', () => {
  // --- State ---
  const initialFormData = () => ({
    company_id: null,
    nip: null,
    name: '',
    email: '',
    password: '',
    status: 'active',
    avatar: null,
    avatar_file: null,
    salaries: {
      basic_salary: null,
      payment_type: 'Monthly',
    },
    details: {
      phone: null,
      placebirth: '',
      datebirth: null,
      gender: null,
      blood: null,
      marital_status: null,
      religion: null,
    },
    address: {
      identity_type: null,
      identity_numbers: null,
      province: '',
      city: '',
      citizen_address: '',
      residential_address: '',
    },
    employee: {
      departement_id: null,
      job_position_id: null,
      job_level_id: null,
      approval_line_id: null,
      approval_manager_id: null,
      join_date: null,
      sign_date: null,
      bank_name: '',
      bank_number: null,
      bank_holder: '',
    }
  });

  const formData = reactive(initialFormData());
  const error = reactive({});
  const isLoading = ref(false);
  const isFormSubmitted = ref(false);

  const selectItemCompany = ref([]);
  const selectItemDepartement = ref([]);
  const selectItemPosition = ref([]);
  const selectItemLevel = ref([]);
  const selectItemLine = ref([]);
  const selectItemMngr = ref([]);

  // --- Getters ---
  const getFormData = computed(() => formData);
  const getErrors = computed(() => error);
  const getIsLoading = computed(() => isLoading.value);
  const getFormSubmitted = computed(() => isFormSubmitted.value);

  // --- Actions ---
  async function fetchUserData(id) {
    isLoading.value = true;
    try {
      const response = await api.get(`/general-module/users/${id}/edit`);
      const data = response.data.data;
      const form = response.data.form;

      selectItemCompany.value = form.companies;
      selectItemDepartement.value = form.departements;
      selectItemPosition.value = form.job_positions;
      selectItemLevel.value = form.job_levels;
      selectItemLine.value = form.users;
      selectItemMngr.value = form.users;
      // Isi formData dengan data yang diterima dari API
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null && !Array.isArray(formData[key])) {
          // Untuk objek bertingkat seperti salaries, details, address, employee
          Object.keys(formData[key]).forEach(subKey => {
            if (data[key] && data[key][subKey] !== undefined) {
              formData[key][subKey] = data[key][subKey];
            }
          });
        } else if (data[key] !== undefined) {
          // Untuk properti level atas
          formData[key] = data[key];
        }
      })

    } catch (err) {
      console.error('Gagal mengambil data user:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // --- Actions ---
  async function fetchUserDataCreate(params = {}) {
    isLoading.value = true;
    try {
      // Bangun query string dinamis dari params
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/general-module/users/create${queryString ? `?${queryString}` : ''}`);

      const form = response?.data?.form;
      if (!form) {
        console.warn("Form tidak ditemukan dalam response:", response);
        return;
      }

      // Mapping form ke state
      selectItemCompany.value = form.companies || [];
      selectItemDepartement.value = form.departements || [];
      selectItemPosition.value = form.job_positions || [];
      selectItemLevel.value = form.job_levels || [];
      selectItemLine.value = form.users || [];
      selectItemMngr.value = form.users || [];

    } catch (err) {
      console.error("Gagal mengambil form data:", err);
    } finally {
      isLoading.value = false;
    }
  }


  function resetForm() {
    Object.assign(formData, initialFormData());
    Object.keys(error).forEach(k => delete error[k]);
    isFormSubmitted.value = false;
  }

  function setErrors(errors = {}) {
    Object.keys(error).forEach(k => delete error[k]);
    Object.assign(error, errors);
    isFormSubmitted.value = true;
  }

  function buildFormData(isUpdate = false) {
    const fd = new FormData();
    if (isUpdate) fd.append('_method', 'PUT');

    const append = (key, value) => {
      if (value !== null && value !== undefined) {
        fd.append(key, value);
      }
    };

    // Top-level fields
    ['company_id', 'name', 'nip', 'email', 'status', 'password'].forEach(key => append(key, formData[key]));
    if (formData.avatar_file) append('avatar', formData.avatar_file);

    // Nested objects
    const nested = ['details', 'address', 'salaries', 'employee'];
    nested.forEach(section => {
      Object.entries(formData[section] || {}).forEach(([k, v]) => append(`${section}[${k}]`, v));
    });

    return fd;
  }

  async function submitForm(isEditMode, userId = null) {
    isLoading.value = true;
    isFormSubmitted.value = true;

    try {
      const url = isEditMode ? `/general-module/users/${userId}` : `/general-module/users`;
      const fd = buildFormData(isEditMode);
      const response = await api.post(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        success: true,
        message: response.data.message || 'Data berhasil disimpan.',
        data: response.data,
      };

    } catch (err) {
      console.error('Gagal mengirim data form:', err);
      const res = err.response?.data;
      setErrors(res?.errors || {});
      return {
        success: false,
        message: res?.message || 'Terjadi kesalahan saat menyimpan data.',
        errors: res?.errors || {},
      };

    } finally {
      isLoading.value = false;
    }
  }

  function onDateChangeDetail(value) {
    formData.details.datebirth = value;
  }

  function onDateChangeEmpJoindate(value) {
    formData.employee.join_date = value;
  }

  function onDateChangeEmpSigndate(value) {
    formData.employee.sign_date = value;
  }

  async function onDepartemenChange(companyId, departementId) {
    await fetchUserDataCreate({ company_id: companyId, dept_id: departementId });
  }

  // Saat posisi berubah
  async function onPositionChange(companyId, departementId, positionId) {
    await fetchUserDataCreate({ company_id: companyId, dept_id: departementId, post_id: positionId });
  }

  // --- Return Store ---
  return {
    formData,
    error,
    isLoading,
    isFormSubmitted,
    selectItemCompany,
    selectItemDepartement,
    selectItemPosition,
    selectItemLevel,
    selectItemLine,
    selectItemMngr,

    getFormData,
    getErrors,
    getIsLoading,
    getFormSubmitted,

    fetchUserDataCreate,
    fetchUserData,
    resetForm,
    setErrors,
    submitForm,
    onDateChangeDetail,
    onDateChangeEmpJoindate,
    onDateChangeEmpSigndate,
    onDepartemenChange,
    onPositionChange,
  };
});
