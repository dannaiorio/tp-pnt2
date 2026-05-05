<script setup></script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <router-view/>
  <router-link to="/">Home</router-link>
  <router-link to="/catalogo">Catálogo</router-link>
  <router-link to="/favoritos">Favoritos</router-link>
  <router-link to="/detalle">Detalle</router-link>
</template>

<style scoped></style>
