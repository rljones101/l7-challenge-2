import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import Papa from 'vue-papa-parse'

const app = createApp(App)
app.use(ElementPlus, { zIndex: 3000 })
app.use(Papa)

app.mount('#app')
