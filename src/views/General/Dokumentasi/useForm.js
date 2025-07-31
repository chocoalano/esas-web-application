// useForm.js
import { useFormStore } from "@/stores/general/dokumentasi/form";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

export function useForm() {
  const formRef = ref(null);
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const store = useFormStore();

  const isEditMode = ref(false);
  const icon = ref('mdi-bookshelf');
  const title = ref('Form Data Dokumentasi');
  const text = ref('Lengkapi informasi detail Dokumentasi Anda.');
  const cancelText = ref('Batal');

  // Define rules more comprehensively if needed later
  const rules = {
    required: value => {
      // Handle different types of values for 'required'
      if (value === null || value === undefined || value === '') {
        return 'Bidang ini wajib diisi.';
      }
      // For arrays (like v-file-input): check if it has elements
      if (Array.isArray(value) && value.length === 0) {
        return 'Bidang ini wajib diisi.';
      }
      return true; // Valid
    },
    // Add other rules here as needed, e.g.,
    // minLength: len => value => (value && value.length >= len) || `Minimal ${len} karakter.`,
    // email: value => /.+@.+\..+/.test(value) || 'Email tidak valid.'
  };

  // formData is already unwrapped here by storeToRefs
  const { formData, isLoading } = storeToRefs(store);

  watch(() => route.params.id, (newId) => {
    if (newId) {
      isEditMode.value = true;
      store.resetForm();
      store.EDIT_DATA_ACTION(newId);
      title.value = 'Edit Data Dokumentasi';
    } else {
      isEditMode.value = false;
      store.resetForm(); // Always reset form for new creation
      store.CREATE_DATA_ACTION(); // Fetch initial data/options for create mode if needed
      title.value = 'Tambah Data Dokumentasi';
    }
  }, { immediate: true });

  const handleConfirm = async () => {
    if (!formRef?.value) {
      toast.error("Form referensi tidak ditemukan. Pastikan ref='formRef' terpasang pada <v-form>.");
      return;
    }
    if (typeof formRef.value.validate !== 'function') {
      console.error("formRef.value.validate is not a function. Check Vuetify form setup.");
      toast.error("Validasi formulir tidak dapat dijalankan.");
      return;
    }
    const { valid, errors } = await formRef.value.validate();
    if (!valid) {
      // You can even display specific errors from the `errors` array
      const errorMessage = errors.length > 0 ? errors.map(e => e.errorMessages).join(', ') : "Mohon lengkapi semua bidang yang wajib diisi.";
      toast.error(`Gagal menyimpan: ${errorMessage}`);
      return;
    }
    try {
      let result;
      // 'formData' is already the unwrapped reactive object due to 'storeToRefs'
      if (isEditMode.value) {
        result = await store.UPDATE_ACTION(route.params.id, formData);
      } else {
        result = await store.CREATE_ACTION(formData);
      }

      if (result?.status === 200 || result?.success) { // Also check for a 'success' property if your API returns it
        if (!isEditMode.value) store.resetForm();
        toast.success('Data berhasil disimpan.');
        router.push({ name: 'general.dokumentasi.list' }); // Ensure this route name is correct
      } else {
        // More specific error handling from API response
        const apiErrors = result?.errors || {};
        const generalErrorMessage = apiErrors.general || "Terjadi kesalahan saat menyimpan data.";
        toast.error(generalErrorMessage);

        // You might want to display field-specific errors from the API here
        store.setErrors(apiErrors); // Assuming your store has a setErrors action
      }
    } catch (error) {
      console.error("Submission catch error:", error); // Log the full error object
      toast.error(`Terjadi kesalahan sistem. ${error.message || 'Silakan coba lagi.'}`);
    }
  };

  const handleCancel = () => {
    store.resetForm();
    router.back();
  };

  return {
    store,
    formRef,
    formData, // This is the reactive object
    handleConfirm,
    handleCancel,
    isEditMode,
    cancelText,
    icon,
    title,
    text,
    rules,
    isLoading
  };
}
