export const useApi = () => {
  const token = useCookie('token');

  const fetchWithAuth = async (url: string, options: any = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': token.value ? `Bearer ${token.value}` : '',
    };

    return $fetch(url, {
      ...options,
      headers,
    });
  };

  return {
    fetchWithAuth,
  };
};

