// useForm.js
import { useFormStore } from "@/stores/general/pengumuman/form";
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
  const icon = ref('mdi-bullhorn-variant-outline');
  const title = ref('Form Data Level');
  const text = ref('Lengkapi informasi detail level Anda.');
  const cancelText = ref('Batal');

  const rules = {
    required: value => !!value || 'Bidang ini wajib diisi.'
  };

  const { formData, isLoading } = storeToRefs(store);

  watch(() => route.params.id, (newId) => {
    if (newId) {
      isEditMode.value = true;
      store.resetForm();
      store.EDIT_DATA_ACTION(newId);
      title.value = 'Edit Data Pengumuman';
    } else {
      isEditMode.value = false;
      store.CREATE_DATA_ACTION();
      store.resetForm();
      title.value = 'Tambah Data Pengumuman';
    }
  }, { immediate: true });

  const handleConfirm = async () => {
    if (!formRef?.value || typeof formRef.value.validate !== 'function') {
      toast.error("Form tidak tersedia atau belum terpasang.");
      return;
    }

    const { valid } = await formRef.value.validate();
    if (!valid) {
      toast.error("Mohon lengkapi semua bidang yang wajib diisi.");
      return;
    }

    try {
      let result;
      if (isEditMode.value) {
        result = await store.UPDATE_ACTION(route.params.id, formData.value);
      } else {
        result = await store.CREATE_ACTION(formData.value);
      }

      if (result?.status === 200) {
        if (!isEditMode.value) store.resetForm();
        toast.success('Data berhasil disimpan.');
        router.push({ name: 'general.pengumuman.list' });
      } else {
        toast.error(result?.errors || "Terjadi kesalahan saat menyimpan.");
        store.setErrors(result?.errors || {});
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan sistem. ${error}`);
    }
  };

  const handleCancel = () => {
    store.resetForm();
    router.back();
  };

  return {
    store,
    formRef,
    formData,
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
