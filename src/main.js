import { createApp } from 'vue'
import App from './App.vue'
//import router from './router'
//createApp(App).use(router).mount('#app')

import VCalendar from 'v-calendar';
import 'v-calendar/style.css'; // 📅 Style-Datei

const app = createApp(App);

app.use(VCalendar, {}); // <- wichtige Zeile

app.mount('#app');
