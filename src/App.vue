<script setup></script>

<template>
  <router-view />
  <router-link to="/">Home</router-link>
  <router-link to="/catalogo">Catálogo</router-link>
  <router-link to="/favoritos">Favoritos</router-link>
  <router-link to="/detalle">Detalle</router-link>
  <router-link to="/ranking">Ranking</router-link>
</template>

<style>
body {
  background-color: #252424;
  color: rgb(244, 188, 255);
}
</style>
