<template>
  <div class="theme-toggle-wrapper">
    <button
      @click="toggleTheme"
      class="theme-toggle-button"
      :title="getThemeTitle()"
      aria-label="切换主题"
    >
      <!-- 浅色主题图标 -->
      <svg
        v-if="mounted && theme.isDark.value"
        class="theme-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <!-- 深色主题图标 -->
      <svg
        v-else-if="mounted"
        class="theme-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <!-- SSR 占位符 -->
      <svg
        v-else
        class="theme-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>

    <!-- 主题选择下拉菜单 -->
    <div v-if="showMenu" class="theme-menu glass">
      <button
        @click="setThemeMode('light')"
        class="theme-menu-item"
        :class="{ active: theme.themeMode.value === 'light' }"
      >
        <svg class="theme-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>浅色</span>
        <svg v-if="theme.themeMode.value === 'light'" class="theme-menu-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        @click="setThemeMode('dark')"
        class="theme-menu-item"
        :class="{ active: theme.themeMode.value === 'dark' }"
      >
        <svg class="theme-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span>深色</span>
        <svg v-if="theme.themeMode.value === 'dark'" class="theme-menu-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        @click="setThemeMode('system')"
        class="theme-menu-item"
        :class="{ active: theme.themeMode.value === 'system' }"
      >
        <svg class="theme-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>跟随系统</span>
        <svg v-if="theme.themeMode.value === 'system'" class="theme-menu-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const theme = useTheme();
const showMenu = ref(false);
const mounted = ref(false);

const toggleTheme = () => {
  showMenu.value = !showMenu.value;
};

const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
  theme.setTheme(mode);
  showMenu.value = false;
};

const getThemeTitle = () => {
  if (theme.themeMode.value === 'system') {
    return '跟随系统';
  }
  return theme.isDark.value ? '切换到浅色' : '切换到深色';
};

// 点击外部关闭菜单
onMounted(() => {
  mounted.value = true;
  
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-toggle-wrapper')) {
      showMenu.value = false;
    }
  };
  
  document.addEventListener('click', handleClickOutside);
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>

<style scoped>
.theme-toggle-wrapper {
  position: relative;
}

.theme-toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle-button:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent);
  transform: scale(1.05);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.theme-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 10rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
}

.theme-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.theme-menu-item:hover {
  background: var(--bg-secondary);
}

.theme-menu-item.active {
  background: var(--bg-tertiary);
  color: var(--accent);
}

.theme-menu-icon {
  width: 1rem;
  height: 1rem;
}

.theme-menu-check {
  width: 1rem;
  height: 1rem;
  margin-left: auto;
}
</style>

