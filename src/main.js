import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueDraggable from 'vue-draggable'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons' // Import the entire free solid icon set
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'primeflex/primeflex.css';
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primevue/resources/primevue.min.css'; /* Deprecated */
import 'primeicons/primeicons.css';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css';


const app = createApp(App)

library.add(fas);

app.use(createPinia())
app.use(router)
app.use(VueDraggable)
app.use(PrimeVue, { ripple: true });
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.component('Button', Button);
app.component('InputText', InputText);

app.mount('#app')
