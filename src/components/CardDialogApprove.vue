<script setup>
import { ref } from 'vue'

// Props untuk membuat komponen lebih fleksibel
const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  approve_type: {
    type: String,
    default: null,
  },
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
})

// Emit untuk mengirim event saat tombol ditekan
const radios = ref('')
const notes = ref('')
const emit = defineEmits(['cancel', 'confirm'])

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm', {
    data: radios.value,
    id: props.id,
    type: props.approve_type,
    notes: notes.value,
  })
}
</script>

<template>
  <v-card :prepend-icon="icon" :title="title" :text="text">
    <v-card-text>
      <p>Selected Button: {{ radios }}</p>
      <v-radio-group v-model="radios">
        <v-radio label="Izinkan permintaan ini" value="y"></v-radio>
        <v-radio label="Tolak permintaan ini" value="n"></v-radio>
        <v-radio label="Tunggu, masih perlu difikirkan" value="w"></v-radio>
      </v-radio-group>
      <v-textarea v-model="notes" variant="outlined" label="Catatan/keterangan/alasan"></v-textarea>
    </v-card-text>
    <template v-slot:actions>
      <v-spacer></v-spacer>
      <v-btn @click="handleCancel"> Batal </v-btn>
      <v-btn color="red" @click="handleConfirm"> Submit </v-btn>
    </template>
  </v-card>
</template>
