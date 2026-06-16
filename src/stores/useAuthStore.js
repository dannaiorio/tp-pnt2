import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
 
const URL_USUARIOS = 'https://6a03ce8d2afe8349b4b583b8.mockapi.io/usuarios'
 
export const useAuthStore = defineStore('auth', () => {
  const usuarioLogueado = ref(null)
 
  const estaLogueado = computed(() => !!usuarioLogueado.value)
  const esAdmin = computed(() => usuarioLogueado.value?.rol === 'admin')
 
  async function login(email, password) {
    const respuesta = await fetch(URL_USUARIOS)
    const usuarios = await respuesta.json()
    const encontrado = usuarios.find(u => u.email === email && u.password === password)
    if (encontrado) {
      usuarioLogueado.value = encontrado
      return true
    }
    return false
  }
 
  function logout() {
    usuarioLogueado.value = null
  }
 
  return { usuarioLogueado, estaLogueado, esAdmin, login, logout }
})