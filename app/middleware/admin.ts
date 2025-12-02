export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated.value) {
    return navigateTo('/login');
  }
  
  if (!auth.isAdmin.value) {
    return navigateTo('/');
  }
});

