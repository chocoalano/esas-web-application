// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const themes = {
  light: {
    dark: false, // Light mode
    colors: {
      // Warna latar belakang utama dan permukaan, meniru Nuxt.com (bersih dan terang)
      background: '#FFFFFF',
      surface: '#f9fafc', // Background untuk card, dialog, dll.
      // Nuansa abu-abu terang untuk elemen "bright" dan "light" agar ada kedalaman
      'surface-bright': '#0f172b', // Agak sedikit abu-abu untuk elemen menonjol
      'surface-light': '#E0E0E0',  // Lebih gelap sedikit, untuk elemen seperti hover/active states
      'surface-variant': '#BDBDBD', // Untuk batas, divider, atau elemen minor
      // Warna teks untuk kontras yang baik di atas permukaan terang
      'on-background': '#2C3E50', // Teks utama di atas background (Nuxt dark text)
      'on-surface': '#2C3E50',   // Teks utama di atas surface
      'on-surface-variant': '#607D8B', // Teks sekunder atau label (abu-abu sedang)
      // Warna primary (hijau Nuxt) diatur agar terlihat baik di light mode
      primary: '#00C853', // Nuansa hijau Nuxt yang dominan
      'primary-darken-1': '#29BF12', // Agak lebih gelap untuk penekanan
      secondary: '#48A9A6', // Warna sekunder tetap
      'secondary-darken-1': '#018786',
      error: '#FF1744',
      info: '#40C4FF',
      success: '#00E676',
      warning: '#F57F17',
    },
    variables: {
      'border-color': '#BDBDBD', // Warna border yang sesuai di light mode
      'border-opacity': 0.20,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.870,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.01,
      'focus-opacity': 0.2,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.12,
      'dragged-opacity': 0.08,
      'theme-kbd': '#212529', // Background keyboard gelap
      'theme-on-kbd': '#FFFFFF', // Teks keyboard terang
      'theme-code': '#F5F5F5', // Background blok kode terang
      'theme-on-code': '#2C3E50', // Teks blok kode gelap
    }
  },
  dark: {
    dark: true, // Dark mode
    colors: {
      background: '#091a28',
      surface: '#091a28',
      'surface-bright': '#1A3343',
      'surface-light': '#254A62',
      'surface-variant': '#3F5F7A',
      'on-background': '#EBF4F1',
      'on-surface': '#EBF4F1',
      'on-surface-variant': '#A8B9C8',
      primary: '#42D392',
      'primary-darken-1': '#29BF12',
      secondary: '#48A9A6',
      'secondary-darken-1': '#018786',
      error: '#F21B3F',
      info: '#08BDBD',
      success: '#ABFF4F',
      warning: '#FF9914',
    },
    variables: {
      'border-color': '#A8B9C8',
      'border-opacity': 0.12,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.60,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.08,
      'focus-opacity': 0.16,
      'selected-opacity': 0.12,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.16,
      'dragged-opacity': 0.12,
      'theme-kbd': '#EBF4F1',
      'theme-on-kbd': '#212529',
      'theme-code': '#2A2A2A',
      'theme-on-code': '#EBF4F1',
    }
  }
}

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
    VTimePicker,
    VFileUpload
  },
  directives,
  theme: {
    defaultTheme: 'light', // Default tema adalah terang
    themes,
  },
  icons: {
    defaultSet: 'mdi',
  },
})

export default vuetify
