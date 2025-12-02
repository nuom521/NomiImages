export const useAuth = () => {
  const token = useCookie('token');
  const user = useCookie('user');

  const login = async (username: string, password: string) => {
    const { data } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });

    if (data.value?.success) {
      token.value = data.value.token;
      user.value = JSON.stringify(data.value.user);
      return { success: true };
    }

    return { success: false, message: data.value?.message };
  };

  const register = async (username: string, email: string, password: string) => {
    const { data } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: { username, email, password },
    });

    if (data.value?.success) {
      return { success: true };
    }

    return { success: false, message: data.value?.message };
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    navigateTo('/login');
  };

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value ? JSON.parse(user.value) : null);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');

  return {
    login,
    register,
    logout,
    isAuthenticated,
    currentUser,
    isAdmin,
  };
};

