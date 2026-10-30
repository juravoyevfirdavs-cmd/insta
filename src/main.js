import './assets/main.css'
import './assets/instagram.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locales'
import { useAuthStore } from './stores/auth'

async function initApp() {
  const app = createApp(App)
  
  // 1. Pinia ni ulash (eng birinchi!)
  const pinia = createPinia()
  app.use(pinia)
  
  // 2. i18n ni ulash
  app.use(i18n)

  // 3. Mavzuni yuklash
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme')
  }

  // 4. MUHIM: Sessiyani tiklash
  const authStore = useAuthStore(pinia) // Pinia ni aniq ko'rsatamiz!
  
  const token = localStorage.getItem('token')
  if (token) {
    try {
      if (authStore.fetchMe) {
        await authStore.fetchMe()
      }
    } catch (e) {
      console.log("Sessiya tiklanmadi:", e)
      localStorage.removeItem('token')
    }
  }

  // 5. Routerni ulash va ilovani ishga tushirish
  app.use(router)
  app.mount('#app')
}

initApp()