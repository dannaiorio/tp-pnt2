<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useFavoritosStore } from '@/stores/useFavoritosStore'
import { useRouter } from 'vue-router'
 
const authStore = useAuthStore()
const favoritosStore = useFavoritosStore()
const router = useRouter()
 
function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
 
<template>
  <nav class="navbar navbar-solid">
    <router-link to="/" class="nav-brand">
      <span class="brand-mark">◐</span>CINE-ORT
    </router-link>
 
    <div class="nav-links">
      <router-link to="/" class="nav-link">Inicio</router-link>
      <router-link to="/catalogo" class="nav-link">Catálogo</router-link>
 
      <!-- Solo si NO es admin -->
      <template v-if="!authStore.esAdmin">
        <router-link to="/ranking" class="nav-link">Ranking</router-link>
        <router-link to="/favoritos" class="nav-link nav-link-fav">
          Favoritos
          <span class="nav-badge" v-if="favoritosStore.favoritos.length > 0">
            {{ favoritosStore.favoritos.length }}
          </span>
        </router-link>
      </template>
 
      <!-- Solo si es admin -->
      <router-link v-if="authStore.esAdmin" to="/admin" class="nav-link nav-link-admin">
        ⚙️ Admin
      </router-link>
    </div>
 
    <!-- Auth -->
    <div class="nav-auth">
      <template v-if="authStore.estaLogueado">
        <span class="nav-usuario">{{ authStore.usuarioLogueado.email }}</span>
        <button class="boton-secundario btn-logout" @click="logout">Salir</button>
      </template>
      <template v-else>
        <router-link to="/login" class="boton btn-login-nav">Ingresar</router-link>
      </template>
    </div>
  </nav>
 
  <main class="main-content">
    <router-view />
  </main>
</template>
 
<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
 
:root {
  --acento: #d42e94;
  --acento-hover: #d42e50;
  --fondo: #0d0d0d;
  --fondo-card: #161616;
  --fondo-card-hover: #1e1e1e;
  --texto: #f0e6f6;
  --texto-suave: #7a6e82;
  --borde: #252525;
  --navbar-h: 70px;
}
 
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
html, body { height: 100%; }
 
body {
  background-color: var(--fondo);
  color: var(--texto);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
}
 
/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
 
/* ── Navbar ── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--navbar-h);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 2rem;
  z-index: 200;
  transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
}
 
.navbar-solid {
  background: rgba(13,13,13,0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--borde);
}
 
.nav-brand {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 3px;
  color: var(--acento);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
 
.brand-mark { font-size: 1.3rem; opacity: 0.9; }
 
.nav-links {
  display: flex;
  gap: 3rem;
  align-items: center;
  justify-self: center;
}
 
.nav-link {
  color: var(--texto-suave);
  text-decoration: none;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.18s, background 0.18s;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
 
.nav-link:hover { color: var(--texto); background: rgba(255,255,255,0.05); }
 
.nav-link.router-link-active {
  color: var(--acento);
  background: rgba(236, 61, 96, 0.12);
}
 
.nav-link-admin {
  color: var(--acento) !important;
  border: 1px solid rgba(212,46,148,0.3);
}
 
.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--acento);
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  margin-left: 5px;
  vertical-align: middle;
}
 
/* Auth */
.nav-auth {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-self: end;
}
 
.nav-usuario {
  font-size: 12px;
  color: var(--texto-suave);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
 
.btn-logout {
  padding: 0.4rem 0.9rem;
  font-size: 13px;
}
 
.btn-login-nav {
  padding: 0.4rem 1rem;
  font-size: 13px;
}
 
/* ── Main ── */
.main-content { padding-top: var(--navbar-h); min-height: 100vh; }
 
/* ── Botones globales ── */
.boton {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: var(--acento); color: white;
  border: none; padding: 0.6rem 1.3rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
  cursor: pointer; text-decoration: none;
  transition: background 0.18s, transform 0.12s;
}
.boton:hover { background: var(--acento-hover); transform: translateY(-1px); }
.boton:active { transform: translateY(0); }
 
.boton-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--texto); padding: 0.6rem 1.3rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
  cursor: pointer; text-decoration: none;
  transition: background 0.18s;
}
.boton-ghost:hover { background: rgba(255,255,255,0.15); }
 
.boton-secundario {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: transparent; border: 1px solid var(--borde);
  color: var(--texto-suave); padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.18s, color 0.18s;
}
.boton-secundario:hover { border-color: #555; color: var(--texto); }
 
/* ── Inputs globales ── */
input[type="text"], input[type="password"], select {
  background: var(--fondo-card); border: 1px solid var(--borde);
  color: var(--texto); padding: 0.6rem 1rem;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; transition: border-color 0.18s;
}
input[type="text"]:focus, input[type="password"]:focus, select:focus { border-color: var(--acento); }
select option { background: #1a1a1a; }
 
/* ── Spinner global ── */
.spinner {
  width: 34px; height: 34px;
  border: 3px solid var(--borde);
  border-top-color: var(--acento);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
 
/* ── Error banner global ── */
.error-banner {
  padding: 1rem 1.25rem;
  background: rgba(231,76,60,0.08);
  border: 1px solid rgba(231,76,60,0.25);
  border-radius: 10px;
  display: flex; align-items: center;
  justify-content: space-between; gap: 1rem;
  font-size: 14px;
}
 
/* ── Títulos ── */
h1 { font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; }
h2 { font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; }
 
/* ── Modal overlay ── */
.modal-scrim {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(6px);
  z-index: 400;
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 
.modal {
  background: #141414;
  border: 1px solid var(--borde);
  border-radius: 16px;
  width: 100%; max-width: 780px;
  max-height: 90vh; overflow-y: auto;
  position: relative;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
 
.modal-close {
  position: absolute; top: 1rem; right: 1rem; z-index: 10;
  background: rgba(0,0,0,0.5); border: 1px solid var(--borde);
  color: var(--texto-suave); width: 32px; height: 32px;
  border-radius: 50%; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, background 0.15s;
}
.modal-close:hover { color: var(--texto); background: rgba(0,0,0,0.8); }
 
.modal-backdrop {
  height: 200px; border-radius: 16px 16px 0 0;
  position: relative; overflow: hidden;
}
 
.modal-body {
  display: flex; gap: 2rem;
  padding: 1.5rem 2rem 2rem;
}
 
.modal-poster {
  flex-shrink: 0; width: 160px;
  margin-top: -80px; position: relative; z-index: 2;
}
 
.modal-poster img {
  width: 100%; border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.6);
  display: block;
}
 
.modal-info { flex: 1; padding-top: 0.5rem; }
 
.modal-kicker {
  font-size: 11px; text-transform: uppercase;
  letter-spacing: 2px; color: var(--acento);
  display: block; margin-bottom: 0.4rem;
}
 
.modal-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  line-height: 1; margin-bottom: 0.75rem;
}
 
.modal-meta {
  display: flex; align-items: center;
  gap: 0.5rem; flex-wrap: wrap;
  font-size: 13px; color: var(--texto-suave);
  margin-bottom: 0.75rem;
}
 
.modal-dot { opacity: 0.4; }
 
.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
 
.chip {
  font-size: 12px; color: var(--acento);
  background: rgba(236,61,96,0.1);
  border: 1px solid rgba(236,61,96,0.2);
  padding: 3px 10px; border-radius: 20px;
}
 
.modal-synopsis {
  font-size: 14px; color: var(--texto-suave);
  line-height: 1.65; margin-bottom: 1.25rem;
}
 
.modal-credit { font-size: 13px; color: var(--texto-suave); margin-bottom: 1.25rem; }
.modal-credit strong { color: var(--texto); margin-left: 0.4rem; }
 
.modal-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
 
.rating-chip {
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: rgba(245,197,24,0.12);
  border: 1px solid rgba(245,197,24,0.25);
  color: #f5c518; border-radius: 6px;
  padding: 2px 8px; font-size: 13px; font-weight: 600;
}
</style>