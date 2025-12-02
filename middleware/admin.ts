export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('token');
  const user = useCookie('user');
  
  if (!token.value) {
    return navigateTo('/login');
  }
  
  if (user.value && JSON.parse(user.value).role !== 'admin') {
    return navigateTo('/');
  }
});

