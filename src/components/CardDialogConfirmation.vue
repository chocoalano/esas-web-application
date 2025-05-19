<script setup>
// Props untuk membuat komponen lebih fleksibel
defineProps({
  icon: {
    type: String,
    default: 'mdi-map-marker',
  },
  title: {
    type: String,
    default: "Use Google's location service?",
  },
  text: {
    type: String,
    default:
      'Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  confirmText: {
    type: String,
    default: 'Hapus',
  },
})

// Emit untuk mengirim event saat tombol ditekan
const emit = defineEmits(['cancel', 'confirm'])

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <template v-slot:actions>
      <v-spacer></v-spacer>

      <v-btn @click="handleCancel">
        {{ cancelText }}
      </v-btn>

      <v-btn color="red" @click="handleConfirm">
        {{ confirmText }}
      </v-btn>
    </template>
  </v-card>
</template>
