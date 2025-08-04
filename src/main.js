import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import axiosPlugin from './plugins/axios'
import VueApexCharts from 'vue3-apexcharts'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import JsonViewer from "vue3-json-viewer"
import "vue3-json-viewer/dist/vue3-json-viewer.css"

import App from './App.vue'
import router from './router'

// Firebase
import { requestPermission, onMessageListener } from './plugins/firebase/firebase'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(ToastPlugin)
app.use(JsonViewer)
app.use(axiosPlugin)
app.use(vuetify)
app.use(VueApexCharts)
app.use(router)

app.mount('#app')

// Jalankan setelah app terpasang
import { useAuthStore } from './stores/auth/auth'

const storeAuth = useAuthStore()

requestPermission()
  .then(async (token) => {
    if (token) {
      await storeAuth.SET_FCM_TOKEN(token)
    } else {
      console.warn('No FCM token received')
    }
  })
  .catch((error) => {
    console.error('Error requesting FCM permission:', error)
  })

onMessageListener()
  .then((payload) => {
    console.log('Received foreground message:', payload)

    const notification = payload?.notification
    if (notification?.title && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/Logo.png',
      })
    }
  })
  .catch((err) => {
    console.error('🔥 Error receiving foreground message:', err)
  })
