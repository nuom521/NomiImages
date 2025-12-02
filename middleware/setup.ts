export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await useFetch('/api/config/check');
  
  if (data.value?.configured && to.path === '/setup') {
    return navigateTo('/');
  }
  
  if (!data.value?.configured && to.path !== '/setup') {
    return navigateTo('/setup');
  }
});

