<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRoute } from 'vue-router'
 
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()


const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
 
async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Completá los dos campos'
    return
  }
  try {
    isLoading.value = true
    error.value = ''
    const ok = await authStore.login(email.value, password.value)
    if (ok) {
     const redirect = route.query.redirect
      router.push(redirect || (authStore.esAdmin ? '/admin' : '/'))
    } else {
      error.value = 'Email o contraseña incorrectos'
    }
  } catch {
    error.value = 'Error al conectar. Intentá de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>
 
<template>
  <div class="login-page">
    <div class="login-bg"></div>
 
    <div class="login-card">
      <div class="login-brand">
        <span class="brand-mark">◐</span>
        <span class="brand-name">CINE-ORT</span>
      </div>
 
      <h1 class="login-titulo">Bienvenido</h1>
      <p class="login-sub">Ingresá para acceder a tu cuenta</p>
 
      <div v-if="error" class="error-banner" style="margin-bottom: 1rem;">
        <p>⚠️ {{ error }}</p>
      </div>
 
      <div class="form">
        <div class="campo">
          <label class="label">Email</label>
          <input
            type="text"
            v-model="email"
            placeholder="tu@email.com"
            @keyup.enter="handleLogin"
          />
        </div>
 
        <div class="campo">
          <label class="label">Contraseña</label>
          <input
            type="password"
            v-model="password"
            placeholder="••••••••"
            @keyup.enter="handleLogin"
          />
        </div>
 
        <button class="boton btn-login" @click="handleLogin" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-sm"></span>
          <span>{{ isLoading ? 'Ingresando...' : 'Ingresar' }}</span>
        </button>
      </div>
 
      <router-link to="/" class="skip-link">Explorar sin cuenta →</router-link>
    </div>
  </div>
</template>
 
<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}
 
.login-bg {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 60% 40%, rgba(212, 46, 148, 0.12) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(212, 46, 80, 0.08) 0%, transparent 50%);
  z-index: -1;
}
 
.login-card {
  background: var(--fondo-card);
  border: 1px solid var(--borde);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
 
.login-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
 
.brand-mark {
  font-size: 1.4rem;
  color: var(--acento);
}
 
.brand-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: var(--acento);
}
 
.login-titulo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  letter-spacing: 2px;
  color: var(--texto);
  margin-bottom: 0.25rem;
}
 
.login-sub {
  font-size: 14px;
  color: var(--texto-suave);
  margin-bottom: 2rem;
}
 
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
 
.campo {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
 
.label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--texto-suave);
}
 
input[type="text"],
input[type="password"] {
  width: 100%;
}
 
.btn-login {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 15px;
  margin-top: 0.5rem;
  gap: 0.5rem;
}
 
.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
 
.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
 
@keyframes spin { to { transform: rotate(360deg); } }
 
.skip-link {
  font-size: 13px;
  color: var(--texto-suave);
  text-decoration: none;
  text-align: center;
  transition: color 0.15s;
}
 
.skip-link:hover {
  color: var(--texto);
}
</style>