<template>
  <div class="page-upload">
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
            <NuxtLink to="/" class="nav-link">首页</NuxtLink>
            <NuxtLink v-if="auth.isAuthenticated.value" to="/dashboard" class="nav-link">个人中心</NuxtLink>
            <NuxtLink v-if="auth.isAdmin.value" to="/admin" class="nav-link">后台管理</NuxtLink>
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/login" class="nav-link">登录</NuxtLink>
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/register" class="btn btn-primary">注册</NuxtLink>
            <button v-if="auth.isAuthenticated.value" @click="auth.logout" class="nav-link">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="upload-main">
      <div class="upload-header">
        <h1 class="upload-title">图片上传</h1>
        <p class="upload-subtitle">支持拖拽上传、批量上传，快速获取图片链接</p>
      </div>

      <div 
        class="upload-area"
        :class="{ 'upload-area-dragover': dragover }"
        @click="triggerFileInput"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @drop.prevent="handleDrop"
      >
        <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="file-input" multiple>
        
        <div class="upload-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p class="upload-text">点击或拖拽图片到此处上传</p>
        <p class="upload-hint">支持 JPG、PNG、GIF、WEBP 格式</p>
      </div>

      <div v-if="uploading" class="upload-progress-box">
        <div class="upload-progress-header">
          <span class="upload-progress-label">上传中...</span>
          <span class="upload-progress-percent">{{ uploadProgress }}%</span>
        </div>
        <div class="upload-progress-bar">
          <div 
            class="upload-progress-fill"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>

      <div v-if="uploadedImages.length > 0" class="upload-results">
        <h2 class="upload-results-title">上传成功</h2>
        <div class="upload-results-grid">
          <div 
            v-for="image in uploadedImages" 
            :key="image.id"
            class="upload-result-card"
          >
            <div class="upload-result-image">
              <img :src="image.url" alt="Uploaded">
            </div>
            <div class="upload-result-actions">
              <input 
                :value="image.url" 
                readonly 
                class="upload-result-input"
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
    </main>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '../../components/ThemeToggle.vue';

definePageMeta({
  middleware: 'setup'
});

const auth = useAuth();
const fileInput = ref<HTMLInputElement | null>(null);
const dragover = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadedImages = ref<any[]>([]);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  await uploadFiles(files);
};

const handleDrop = async (e: DragEvent) => {
  dragover.value = false;
  const files = Array.from(e.dataTransfer?.files || []);
  await uploadFiles(files);
};

const uploadFiles = async (files: File[]) => {
  uploadedImages.value = [];
  uploading.value = true;
  uploadProgress.value = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = useCookie('token');
      const response = await $fetch<{ success: boolean; image?: any; message?: string }>('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': token.value ? `Bearer ${token.value}` : '',
        },
      });

      if (response.success && response.image) {
        uploadedImages.value.push(response.image);
      }
    } catch (error: any) {
      alert('上传失败: ' + (error.data?.message || error.message));
    }

    uploadProgress.value = ((i + 1) / files.length) * 100;
  }

  uploading.value = false;
  uploadProgress.value = 0;
};

const copyUrl = async (url: string) => {
  await navigator.clipboard.writeText(url);
  alert('链接已复制到剪贴板');
};
</script>

<style scoped>
.page-upload {
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
}

.nav-link:hover {
  color: var(--text-primary);
}

.upload-main {
  position: relative;
  z-index: 10;
  max-width: 80rem;
  margin: 0 auto;
  padding: 4rem 1rem;
}

@media (min-width: 640px) {
  .upload-main {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .upload-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.upload-header {
  text-align: center;
  margin-bottom: 3rem;
}

.upload-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--text-primary), var(--text-secondary), var(--text-tertiary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.upload-subtitle {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.upload-area {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 2px dashed var(--border);
  padding: 4rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.upload-area:hover {
  border-color: var(--accent);
}

.upload-area-dragover {
  border-color: var(--accent);
  background: var(--bg-tertiary);
  transform: scale(1.02);
}

.file-input {
  display: none;
}

.upload-icon {
  margin: 0 auto 1.5rem;
  width: 6rem;
  height: 6rem;
  color: var(--text-tertiary);
  transition: all 0.3s;
}

.upload-area:hover .upload-icon {
  transform: scale(1.1);
  color: var(--accent);
}

.upload-text {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  transition: color 0.15s;
}

.upload-area:hover .upload-text {
  color: var(--text-primary);
}

.upload-hint {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.upload-progress-box {
  margin-top: 2rem;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.upload-progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.upload-progress-label {
  color: var(--text-primary);
  font-weight: 500;
}

.upload-progress-percent {
  color: var(--accent);
  font-weight: 600;
}

.upload-progress-bar {
  width: 100%;
  background: var(--bg-tertiary);
  border-radius: 9999px;
  height: 0.75rem;
  overflow: hidden;
}

.upload-progress-fill {
  height: 100%;
  background: linear-gradient(to right, #6366f1, #9333ea);
  border-radius: 9999px;
  transition: width 0.3s;
  position: relative;
  overflow: hidden;
}

.upload-progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.upload-results {
  margin-top: 3rem;
}

.upload-results-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.upload-results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .upload-results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.upload-result-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  transition: all 0.15s;
}

.upload-result-card:hover {
  border-color: var(--accent);
  transform: translateY(-0.25rem);
}

.upload-result-image {
  aspect-ratio: 16 / 9;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  background: var(--bg-tertiary);
}

.upload-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.upload-result-card:hover .upload-result-image img {
  transform: scale(1.1);
}

.upload-result-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-result-input {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  outline: none;
}

.upload-result-input:focus {
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
  width: 1rem;
  height: 1rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
