import { useFormStore } from "@/stores/pengaturan/level/form";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router"; // Impor useRouter
import { useToast } from "vue-toast-notification";

export function useForm() {
  const route = useRoute();
  const router = useRouter(); // Inisialisasi router
  const store = useFormStore();

  const toast = useToast()
  const formRef = ref(null);
  const isEditMode = ref(false);

  // Properti untuk v-card
  const icon = ref('mdi-office-building'); // Contoh ikon
  const title = ref('Form Data Level');
  const text = ref('Lengkapi informasi detail level Anda.');

  // Teks tombol cancel
  const cancelText = ref('Batal');

  // Aturan validasi
  const rules = {
    required: value => !!value || 'Bidang ini wajib diisi.'
  };

  // Gunakan storeToRefs untuk menjaga reaktivitas properti dari store
  const { formData } = storeToRefs(store); // formData di sini sudah unwrapped, jadi tidak perlu .value lagi
  const { isLoading } = storeToRefs(store); // Ambil isLoading dari store juga jika ingin menggunakannya

  watch(() => route.params.id, (newId) => {
    if (newId) {
      isEditMode.value = true;
      store.resetForm(); // Memastikan form bersih sebelum memuat data edit
      store.EDIT_DATA_ACTION(newId); // Panggil aksi di store
      title.value = 'Edit Data Level'; // Ganti judul ketika mode edit
    } else {
      isEditMode.value = false;
      store.CREATE_DATA_ACTION()
      store.resetForm(); // Bersihkan form jika tidak ada ID (mode tambah)
      title.value = 'Tambah Data Level'; // Ganti judul ketika mode tambah
    }
  }, { immediate: true });

  // Fungsi untuk menangani submit form
  const handleConfirm = async () => {
    // Validasi form pertama
    const { valid } = await formRef.value.validate();
    if (!valid) {
      toast.error('Mohon lengkapi semua bidang yang wajib diisi dengan benar.')
      return;
    }

    try {
      let result;
      console.log(formData.value);

      if (isEditMode.value) {
        result = await store.UPDATE_ACTION(route.params.id, formData.value);
      } else {
        result = await store.CREATE_ACTION(formData.value);
      }

      if (result.success) {
        toast.success('Data berhasil tersimpan')
        if (!isEditMode.value) store.resetForm();
        router.push({ name: 'pengaturan.level.list' });
      } else {
        toast.error('Data gagal tersimpan')
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan tak terduga: ${error.message || 'Gagal menyimpan data.'}`)
    }
  };

  // Fungsi untuk menangani pembatalan
  const handleCancel = () => {
    store.resetForm(); // Reset form saat dibatalkan
    router.back(); // Kembali ke halaman sebelumnya
  };

  return {
    store,
    formRef,
    formData, // formData di sini sudah objek reaktif langsung
    handleConfirm,
    handleCancel,
    isEditMode,
    cancelText,
    icon,
    title,
    text,
    rules,
    isLoading // Opsional, jika ingin menampilkan loading state di komponen
  }
}
