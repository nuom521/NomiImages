export type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const themeMode = useCookie<ThemeMode>('theme-mode', {
    default: () => 'system', // 默认跟随系统
  });

  // 检测系统主题
  const getSystemTheme = (): 'light' | 'dark' => {
    if (process.client) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // SSR 默认浅色（确保 SSR 和客户端初始一致）
  };

  // 计算实际主题（用于 SSR 和客户端一致性）
  const getActualTheme = (mode: ThemeMode): 'light' | 'dark' => {
    return mode === 'system' ? getSystemTheme() : mode;
  };

  // 初始化 isDark，确保 SSR 和客户端一致
  const initialTheme = getActualTheme(themeMode.value);
  const isDark = ref(initialTheme === 'dark');
  
  let systemThemeListener: (() => void) | null = null;

  // 应用主题
  const applyTheme = (mode: ThemeMode) => {
    const actualTheme = getActualTheme(mode);
    isDark.value = actualTheme === 'dark';
    
    if (process.client) {
      const root = document.documentElement;
      root.setAttribute('data-theme', actualTheme);
      root.classList.remove('dark', 'light');
      root.classList.add(actualTheme);
    }
  };

  // 设置主题
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode;
    applyTheme(mode);
    setupSystemThemeListener();
  };

  // 设置系统主题监听器
  const setupSystemThemeListener = () => {
    // 移除旧的监听器
    if (systemThemeListener) {
      systemThemeListener();
      systemThemeListener = null;
    }

    // 如果当前模式是跟随系统，设置新的监听器
    if (process.client && themeMode.value === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      systemThemeListener = () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  };

  // 初始化主题（确保 SSR 和客户端一致）
  applyTheme(themeMode.value);
  
  // 客户端特定操作
  if (process.client) {
    setupSystemThemeListener();
  }

  // 监听主题模式变化
  watch(themeMode, (newMode) => {
    applyTheme(newMode);
    setupSystemThemeListener();
  });

  // 清理监听器
  onUnmounted(() => {
    if (systemThemeListener) {
      systemThemeListener();
      systemThemeListener = null;
    }
  });

  return {
    themeMode: readonly(themeMode),
    isDark: readonly(isDark),
    setTheme,
    getSystemTheme,
  };
};

