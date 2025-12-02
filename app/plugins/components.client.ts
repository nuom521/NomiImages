import ThemeToggle from '../../components/ThemeToggle.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ThemeToggle', ThemeToggle);
});

