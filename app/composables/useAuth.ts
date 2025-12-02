interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export const useAuth = () => {
  const token = useCookie('token');
  // 设置 cookie 选项，确保对象能正确序列化/反序列化
  const user = useCookie<User | null>('user', {
    default: () => null,
    serialize: (value: User | null) => value ? JSON.stringify(value) : '',
    parse: (value: string): User | null => {
      if (!value) return null;
      try {
        return JSON.parse(value) as User;
      } catch {
        return null;
      }
    }
  });

  const login = async (username: string, password: string) => {
    const { data } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });

    if (data.value?.success) {
      token.value = data.value.token;
      // useCookie 会自动序列化对象，直接存储对象即可
      user.value = data.value.user as User;
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
  // user.value 现在应该已经是对象了（通过 parse 函数处理）
  const currentUser = computed(() => user.value);
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

