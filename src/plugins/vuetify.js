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
      background: '#FFFFFF',
      surface: '#FFFFFF',
      'surface-bright': '#FFFFFF',
      'surface-light': '#EEEEEE',
      'surface-variant': '#424242',
      'on-surface-variant': '#EEEEEE',
      primary: '#1867C0',
      'primary-darken-1': '#1F5592',
      secondary: '#48A9A6',
      'secondary-darken-1': '#018786',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
    variables: {
      'border-color': '#000000',
      'border-opacity': 0.12,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.60,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.12,
      'dragged-opacity': 0.08,
      'theme-kbd': '#212529',
      'theme-on-kbd': '#FFFFFF',
      'theme-code': '#F5F5F5',
      'theme-on-code': '#000000',
    }
  },
  dark: {
    dark: true, // Dark mode
    colors: {
      background: '#1E1E1E',
      surface: '#1E1E1E',
      'surface-bright': '#2A2A2A',
      'surface-light': '#333333',
      'surface-variant': '#424242',
      'on-surface-variant': '#EEEEEE',
      primary: '#BB86FC',
      'primary-darken-1': '#3700B3',
      secondary: '#03DAC6',
      'secondary-darken-1': '#018786',
      error: '#CF6679',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
    variables: {
      'border-color': '#FFFFFF',
      'border-opacity': 0.12,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.60,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.12,
      'dragged-opacity': 0.08,
      'theme-kbd': '#FFFFFF',
      'theme-on-kbd': '#212529',
      'theme-code': '#2A2A2A',
      'theme-on-code': '#FFFFFF',
    }
  }
}

const vuetify = createVuetify({
  components: {
    ...components,  // Menggunakan semua komponen bawaan Vuetify
    VDateInput,     // Menambahkan komponen khusus VDateInput
    VTimePicker,     // Menambahkan komponen khusus VTimePicker
    VFileUpload
  },
  directives,
  theme: {
    defaultTheme: 'dark', // Default tema adalah gelap
    themes, // Menggunakan tema yang sudah diperbaiki
  },
  icons: {
    defaultSet: 'mdi',  // Menggunakan Material Design Icons
  },
})

export default vuetify
