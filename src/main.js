import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import axiosPlugin from './plugins/axios'
import VueApexCharts from 'vue3-apexcharts'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/vue3-json-viewer.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(ToastPlugin)
app.use(JsonViewer)
app.use(axiosPlugin)
app.use(vuetify)
app.use(VueApexCharts)
app.use(router)

app.mount('#app')
