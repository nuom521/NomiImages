<template>
  <div class="page-dashboard">
    <div class="bg-grid"></div>
    
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="nav-content">
          <NuxtLink to="/" class="nav-logo">
            <div class="logo-icon">
              <span>N</span>
            </div>
            <h1 class="logo-text">NomiImages</h1>
          </NuxtLink>
          <div class="nav-links">
            <ThemeToggle />
            <NuxtLink to="/upload" class="btn btn-primary">上传图片</NuxtLink>
            <NuxtLink v-if="auth.isAdmin.value" to="/admin" class="nav-link">后台管理</NuxtLink>
            <button @click="auth.logout" class="nav-link">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="dashboard-main">
      <div class="dashboard-card">
        <h2 class="dashboard-title">个人中心</h2>

        <div class="user-welcome">
          <h3 class="user-welcome-title">欢迎，{{ auth.currentUser.value?.username }}</h3>
          <p class="user-welcome-email">{{ auth.currentUser.value?.email }}</p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>

        <div v-else-if="images.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="empty-text">还没有上传过图片</p>
          <NuxtLink to="/upload" class="btn btn-primary">去上传</NuxtLink>
        </div>

        <div v-else class="images-grid">
          <div 
            v-for="image in images" 
            :key="image.id" 
            class="image-card"
          >
            <div class="image-preview">
              <img :src="image.url" :alt="image.originalName">
            </div>
            <div class="image-info">
              <p class="image-name">{{ image.originalName }}</p>
              <p class="image-meta">{{ formatSize(image.size) }} · {{ formatDate(image.createdAt) }}</p>
              <div class="image-actions">
                <input 
                  :value="image.url" 
                  readonly 
                  class="image-url-input"
                >
                <button 
                  @click="copyUrl(image.url)" 
                  class="btn btn-primary btn-small"
                >
                  <span>复制</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '../../components/ThemeToggle.vue';

definePageMeta({
  middleware: ['setup', 'auth']
});

interface Image {
  id: number;
  url: string;
  originalName: string;
  size: number;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  images?: Image[];
  message?: string;
}

const auth = useAuth();
const api = useApi();
const images = ref<Image[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await api.fetchWithAuth('/api/images/my') as ApiResponse;
    if (data.success && data.images) {
      images.value = data.images;
    }
  } catch (error) {
    console.error('Failed to load images:', error);
  } finally {
    loading.value = false;
  }
});

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN');
};

const copyUrl = async (url: string) => {
  await navigator.clipboard.writeText(url);
  alert('链接已复制到剪贴板');
};
</script>

<style scoped>
.page-dashboard {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, var(--border-light) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-light) 1px, transparent 1px);
  background-size: 4rem 4rem;
  opacity: 0.3;
}

.nav-bar {
  position: relative;
  z-index: 50;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .nav-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 0 2rem;
  }
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #6366f1, #9333ea);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon span {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--text-primary), var(--text-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  font-family: inherit;
}

.nav-link:hover {
  color: var(--text-primary);
}

.dashboard-main {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .dashboard-main {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.dashboard-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid var(--border);
  padding: 2rem;
}

.dashboard-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.user-welcome {
  background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(147, 51, 234, 0.1));
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  margin-bottom: 2rem;
}

.user-welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.user-welcome-email {
  color: var(--text-secondary);
}

.loading-state {
  text-align: center;
  padding: 5rem 0;
}

.spinner {
  display: inline-block;
  width: 4rem;
  height: 4rem;
  border: 4px solid var(--border);
  border-top-color: var(--accent);
  border-bottom-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
}

.empty-icon {
  display: inline-block;
  width: 5rem;
  height: 5rem;
  color: var(--text-tertiary);
  margin-bottom: 1.5rem;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.images-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .images-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.image-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.15s;
}

.image-card:hover {
  border-color: var(--accent);
  transform: translateY(-0.25rem);
}

.image-preview {
  aspect-ratio: 16 / 9;
  background: var(--bg-tertiary);
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-card:hover .image-preview img {
  transform: scale(1.1);
}

.image-info {
  padding: 1rem;
}

.image-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-meta {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.image-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.image-url-input {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  outline: none;
}

.image-url-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.15s;
  cursor: pointer;
  border: none;
  text-decoration: none;
  gap: 0.25rem;
}

.btn-primary {
  background-color: var(--accent);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--accent-hover);
  transform: scale(1.05);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-small svg {
  width: 0.75rem;
  height: 0.75rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
