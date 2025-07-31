<template>
  <v-card :prepend-icon="icon" :title="title">
    <v-card-text>
      <p class="text-error text-h6 mb-4">
        {{ text }}
      </p>
      <p class="mb-4">
        Tindakan ini akan <strong class="text-error">menghapus data secara permanen</strong> dan tidak dapat
        dikembalikan. Pastikan Anda memahami konsekuensi dari penghapusan ini, dan siap menerima
        <strong class="text-error">sanksi serta hukuman</strong> apabila terdapat
        kerugian pada perusahaan atas tindakan yang Anda lakukan.
      </p>
      <p class="mb-4">
        Untuk melanjutkan penghapusan, mohon masukkan **Nomor Konfirmasi** berikut
        (<strong class="text-primary">{{ generatedNumber }}</strong>) pada kolom di bawah ini sebagai konfirmasi,
        bahwa Anda melakukan ini secara <strong class="text-error">Sadar</strong> dan bertanggung jawab.
      </p>
      <v-text-field v-model="confirmationInput" label="Masukkan Nomor Konfirmasi di Sini"
        :rules="[rules.required, rules.numberMatch]" outlined dense required @paste.prevent @copy.prevent
        @keyup.enter="handleConfirm"></v-text-field>
    </v-card-text>

    <template v-slot:actions>
      <v-spacer></v-spacer>

      <v-btn @click="handleCancel">
        {{ cancelText }}
      </v-btn>

      <v-btn color="error" @click="handleConfirm" :disabled="!isConfirmationValid">
        {{ confirmText }}
      </v-btn>
    </template>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Destructuring langsung props yang akan digunakan di template atau script
// Menghapus 'expectedNip' karena tidak lagi digunakan
const { icon, title, text, cancelText, confirmText } = defineProps({
  icon: {
    type: String,
    default: 'mdi-alert-box',
  },
  title: {
    type: String,
    default: 'Konfirmasi Penghapusan Data KRITIS',
  },
  text: {
    type: String,
    default: 'Anda akan menghapus data yang sangat penting. Pertimbangkan kembali!',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  confirmText: {
    type: String,
    default: 'Hapus Permanen dan Bertanggung Jawab',
  },
});

const emit = defineEmits(['cancel', 'confirm']);

const generatedNumber = ref('');
const confirmationInput = ref('');

const generateRandomNumber = () => {
  generatedNumber.value = String(Math.floor(100000 + Math.random() * 90000000));
};

const isConfirmationValid = computed(() => {
  return confirmationInput.value === generatedNumber.value;
});

const rules = {
  required: value => !!value || 'Nomor konfirmasi wajib diisi.',
  numberMatch: value => value === generatedNumber.value || 'Nomor konfirmasi tidak cocok.',
};

const handleCancel = () => {
  emit('cancel');
  confirmationInput.value = '';
  generateRandomNumber();
};

const handleConfirm = () => {
  if (isConfirmationValid.value) {
    emit('confirm');
    confirmationInput.value = '';
    generateRandomNumber();
  }
};

onMounted(() => {
  generateRandomNumber();
});
</script>

<style scoped>
/* Anda bisa menambahkan gaya kustom di sini jika diperlukan */
</style>
