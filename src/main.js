import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueDraggable from 'vue-draggable'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons' // Import the entire free solid icon set

const app = createApp(App)

library.add(fas);

app.use(createPinia())
app.use(router)
app.use(VueDraggable)
app.mount('#app')
