import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueDraggable from 'vue-draggable'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueDraggable)
app.mount('#app')
