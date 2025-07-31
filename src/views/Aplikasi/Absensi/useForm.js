import { useFormStore } from "@/stores/aplikasi/absensi/form";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

export function useForm() {
  const route = useRoute();
  const router = useRouter();
  const toast = useToast()
  const store = useFormStore();
  const formRef = ref(null);

  const isEditMode = ref(false);

  // Reactive properties for the form card/header
  const icon = ref('mdi-calendar-check');
  const title = ref('Form Data Absensi');
  const text = ref('Lengkapi informasi detail absensi Anda.');

  const cancelText = ref('Batal');

  // --- Validation Rules ---
  const rules = {
    required: value => !!value || 'Bidang ini wajib diisi.',
    coordinate: value => {
      const numValue = parseFloat(value);
      return (!isNaN(numValue) && isFinite(numValue)) || 'Harus berupa angka (koordinat).';
    },
    requiredFile: value => (value && value.length > 0) || 'Foto wajib diunggah.'
  };

  // --- Store State & Getters ---
  const { formData, isLoading, companyOptions, deptOptions, userOptions, scheduleOptions } = storeToRefs(store);

  // --- Watchers ---

  // Watch for changes in route.params.id to determine form mode and load initial data
  watch(() => route.params.id, (newId) => {
    if (newId) {
      isEditMode.value = true;
      title.value = 'Edit Data Absensi';
      store.resetForm();
      store.EDIT_DATA_ACTION(newId);
    } else {
      isEditMode.value = false;
      title.value = 'Tambah Data Absensi';
      store.resetForm();
      store.CREATE_DATA_ACTION();
    }
  }, { immediate: true });

  // Watch formData.company_id for changes to fetch dependent dropdowns
  watch(() => formData.value.company_id, (e) => {
    store.CREATE_DATA_ACTION();
  }, { deep: true });

  // Watch formData.departement_id for changes to fetch dependent dropdowns
  watch(() => formData.value.departement_id, (e) => {
    store.CREATE_DATA_ACTION();
  }, { deep: true });

  // Watch formData.user_id for changes to fetch dependent dropdowns
  watch(() => formData.value.user_id, (e) => {
    store.CREATE_DATA_ACTION();
  }, { deep: true });


  // --- Form Submission Handlers ---

  /**
   * Handles form submission (create or update).
   */
  const handleConfirm = async () => {
    const { valid } = await formRef.value.validate();
    if (!valid) {
      const message = 'Mohon lengkapi semua bidang yang wajib diisi dengan benar.'
      toast.error(`Gagal menyimpan data, pesan kesalahan : ${message}`)
      return;
    }

    try {
      let result;
      if (isEditMode.value) {
        result = await store.UPDATE_ACTION(route.params.id, formData.value);
      } else {
        result = await store.CREATE_ACTION(formData.value);
      }
      if (result.status === 200) {
        toast.success(`Berhasil menyimpan data, data disimpan`)
        if (!isEditMode.value) store.resetForm();
      } else {
        const message = 'Terjadi kesalahan, pastikan anda memiliki izin untuk melakukan tindakan ini dan melakukan pengisian form dengan benar!.'
        toast.error(`Gagal memuat data, pesan kesalahan : ${message}`)
      }
    } catch (error) {
      const message = 'Terjadi kesalahan, pastikan anda memiliki izin untuk melakukan tindakan ini dan melakukan pengisian form dengan benar!.'
      toast.error(`Gagal memuat data, pesan kesalahan : ${message}`)
    }
  };

  /**
   * Handles form cancellation, resets the form, and navigates back.
   */
  const handleCancel = () => {
    store.resetForm(); // Reset form state
    router.back(); // Navigate to the previous page
  };

  // --- Exposed Properties and Functions ---
  return {
    // State from Pinia store (unwrapped by storeToRefs)
    store, // Expose store directly if you need to call other actions/access other states
    formData,
    isLoading,
    companyOptions,
    deptOptions,
    userOptions,
    scheduleOptions,

    // Component-local reactive state and refs
    formRef,
    isEditMode,
    icon,
    title,
    text,
    cancelText,

    // Validation rules
    rules,

    // Event handlers
    handleConfirm,
    handleCancel,
  };
}
