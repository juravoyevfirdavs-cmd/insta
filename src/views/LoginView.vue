<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h1 class="logo">Instagram</h1>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <input 
            v-model="form.login" 
            type="text" 
            placeholder="Telefon raqami, foydalanuvchi nomi yoki email" 
            required 
            class="input-field"
          />

          <div class="password-wrapper">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Parol" 
              required 
              class="input-field"
            />
            <button 
              type="button" 
              class="eye-btn" 
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Kirish...' : 'Войти' }}
          </button>
        </form>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div class="divider">
          <span class="line"></span>
          <span class="text">ИЛИ</span>
          <span class="line"></span>
        </div>

        <a href="#" class="forgot-password">Забыли пароль?</a>
      </div>

      <div class="register-box">
        <p>У вас ещё нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import http from '../api/http';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({ login: '', password: '' });
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await http.post('/auth/login', {
      login: form.value.login,
      password: form.value.password
    });

    localStorage.setItem('token', response.data.token);
    
    if (authStore.setUser) {
      authStore.setUser(response.data.user);
    }
    
    router.push('/');
  } catch (error) {
    // Xatoni aniqroq ko'rsatish
    if (error.response) {
      // Serverdan javob keldi (lekin xato bilan)
      errorMessage.value = error.response.data?.message || 'Login yoki parol noto\'g\'ri';
    } else if (error.request) {
      // So'rov yuborildi, lekin javob kelmadi (server ishlamayapti)
      errorMessage.value = 'Server bilan aloqa yo\'q. Backend ishlayaptimi?';
    } else {
      // Boshqa xatolik
      errorMessage.value = 'Xatolik yuz berdi: ' + error.message;
    }
    console.error("Login xatosi:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 350px;
}

.login-box {
  width: 100%;
  background: #121212;
  border: 1px solid #262626;
  padding: 40px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  font-family: 'Brush Script MT', cursive, sans-serif;
  font-size: 48px;
  margin-bottom: 30px;
  color: #fff;
  letter-spacing: 1px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-field {
  width: 100%;
  padding: 12px 14px;
  background: #1a1a1a;
  border: 1px solid #363636;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.input-field:focus {
  border-color: #555;
}
.input-field::placeholder {
  color: #777;
}

.password-wrapper {
  position: relative;
  width: 100%;
}
.password-wrapper input {
  padding-right: 40px;
}
.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: transform 0.2s;
}
.eye-btn:hover {
  transform: translateY(-50%) scale(1.1);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #0095f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.3s, transform 0.1s;
}
.btn-submit:hover:not(:disabled) {
  background: #1877f2;
}
.btn-submit:active:not(:disabled) {
  transform: scale(0.98);
}
.btn-submit:disabled {
  background: #00376b;
  cursor: not-allowed;
  opacity: 0.7;
}

.error {
  color: #ed4956;
  font-size: 13px;
  margin-top: 15px;
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}
.divider .line {
  flex: 1;
  height: 1px;
  background: #262626;
}
.divider .text {
  color: #888;
  font-size: 12px;
  font-weight: 600;
  margin: 0 18px;
}

.forgot-password {
  color: #0095f6;
  font-size: 13px;
  text-decoration: none;
}
.forgot-password:hover {
  text-decoration: underline;
}

.register-box {
  width: 100%;
  background: #121212;
  border: 1px solid #262626;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  color: #a8a8a8;
}
.register-box a {
  color: #0095f6;
  text-decoration: none;
  font-weight: 600;
}
.register-box a:hover {
  text-decoration: underline;
}

body.light-theme .login-box {
  background: #fff;
  border-color: #dbdbdb;
}
body.light-theme .logo {
  color: #000;
}
body.light-theme .input-field {
  background: #fafafa;
  border-color: #dbdbdb;
  color: #000;
}
body.light-theme .input-field:focus {
  border-color: #a8a8a8;
}
body.light-theme .input-field::placeholder {
  color: #999;
}
body.light-theme .divider .line {
  background: #dbdbdb;
}
body.light-theme .divider .text {
  color: #888;
}
body.light-theme .register-box {
  background: #fff;
  border-color: #dbdbdb;
  color: #000;
}
body.light-theme .register-box a {
  color: #0095f6;
}
</style>