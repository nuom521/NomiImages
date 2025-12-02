<template>
  <div class="page-admin">
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
            <NuxtLink to="/dashboard" class="nav-link">个人中心</NuxtLink>
            <button @click="auth.logout" class="nav-link">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="admin-main">
      <div class="admin-card">
        <h2 class="admin-title">后台管理</h2>

        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card stat-card-blue">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="stat-card stat-card-green">
            <div class="stat-value">{{ stats.totalImages }}</div>
            <div class="stat-label">总图片数</div>
          </div>
          <div class="stat-card stat-card-purple">
            <div class="stat-value">{{ stats.todayImages }}</div>
            <div class="stat-label">今日上传</div>
          </div>
          <div class="stat-card stat-card-pink">
            <div class="stat-value">{{ formatSize(stats.totalSize) }}</div>
            <div class="stat-label">总存储量</div>
          </div>
        </div>

        <!-- 标签页 -->
        <div class="tabs">
          <button 
            @click="activeTab = 'config'" 
            :class="['tab-button', activeTab === 'config' ? 'active' : '']"
          >
            系统配置
          </button>
          <button 
            @click="activeTab = 'images'" 
            :class="['tab-button', activeTab === 'images' ? 'active' : '']"
          >
            图片管理
          </button>
          <button 
            @click="activeTab = 'users'" 
            :class="['tab-button', activeTab === 'users' ? 'active' : '']"
          >
            用户管理
          </button>
        </div>

        <!-- Config Tab -->
        <div v-if="activeTab === 'config'" class="tab-content">
          <div v-for="config in configs" :key="config.key" class="config-item">
            <label class="config-label">{{ config.description }}</label>
            <select
              v-if="config.key === 'allow_guest_upload'"
              v-model="config.value"
              class="input"
            >
              <option value="true">允许</option>
              <option value="false">不允许</option>
            </select>
            <input 
              v-else-if="config.key !== 'allowed_mime_types'" 
              v-model="config.value" 
              type="text" 
              class="input"
            >
            <input 
              v-else 
              v-model="config.value" 
              type="text" 
              class="input"
              placeholder="用逗号分隔，如: image/jpeg,image/png"
            >
            <p class="config-hint" v-if="config.key === 'filename_format'">
              可用变量: {timestamp}, {random}, {original}, {userid}, {date}, {time}
            </p>
            <p class="config-hint" v-if="config.key === 'guest_image_expire_days'">
              0 表示永久保存
            </p>
          </div>
          <button @click="saveConfig" class="btn btn-primary">
            保存配置
          </button>
        </div>

        <!-- Images Tab -->
        <div v-if="activeTab === 'images'" class="tab-content">
          <div class="images-grid">
            <div 
              v-for="image in adminImages" 
              :key="image.id" 
              class="admin-image-card"
            >
              <div class="admin-image-preview">
                <img :src="image.url" :alt="image.originalName">
              </div>
              <div class="admin-image-info">
                <p class="admin-image-name">{{ image.originalName }}</p>
                <p class="admin-image-meta">{{ image.user?.username || '游客' }} · {{ formatDate(image.createdAt) }}</p>
                <button 
                  @click="deleteImage(image.id)" 
                  class="btn btn-danger btn-full"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>邮箱</th>
                  <th>角色</th>
                  <th>已用空间</th>
                  <th>空间限制</th>
                  <th>使用率</th>
                  <th>操作</th>
                  <th>注册时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in adminUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td class="user-name">{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-user']">
                      {{ user.role === 'admin' ? '管理员' : '用户' }}
                    </span>
                  </td>
                  <td>{{ formatSize(user.usedStorage) }}</td>
                  <td>
                    <span v-if="editingUserId === user.id" class="storage-edit">
                      <input 
                        v-model.number="editingStorageLimit" 
                        type="number" 
                        class="storage-input"
                        placeholder="字节数，留空为无限制"
                        min="0"
                      >
                      <button @click="saveStorageLimit(user.id)" class="btn btn-primary btn-small">保存</button>
                      <button @click="cancelEdit" class="btn btn-secondary btn-small">取消</button>
                    </span>
                    <span v-else>
                      {{ user.storageLimit ? formatSize(user.storageLimit) : '无限制' }}
                    </span>
                  </td>
                  <td>
                    <div v-if="user.storageLimit" class="storage-progress">
                      <div class="storage-progress-bar">
                        <div 
                          class="storage-progress-fill" 
                          :style="{ width: getStorageUsagePercent(user) + '%' }"
                          :class="{ 'storage-progress-warning': getStorageUsagePercent(user) > 80, 'storage-progress-danger': getStorageUsagePercent(user) > 95 }"
                        ></div>
                      </div>
                      <span class="storage-progress-text">{{ getStorageUsagePercent(user).toFixed(1) }}%</span>
                    </div>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <button 
                      v-if="editingUserId !== user.id"
                      @click="editStorageLimit(user)" 
                      class="btn btn-primary btn-small"
                    >
                      编辑
                    </button>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '../../../components/ThemeToggle.vue';

definePageMeta({
  middleware: ['setup', 'auth', 'admin']
});

// 类型定义
interface Config {
  key: string;
  value: string;
  description: string;
}

interface Stats {
  totalUsers: number;
  totalImages: number;
  todayImages: number;
  totalSize: number;
}

interface Image {
  id: number;
  url: string;
  originalName: string;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
  } | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  storageLimit: number | null;
  usedStorage: number;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

const auth = useAuth();
const api = useApi();
const activeTab = ref<'config' | 'images' | 'users'>('config');
const configs = ref<Config[]>([]);
const stats = ref<Stats>({
  totalUsers: 0,
  totalImages: 0,
  todayImages: 0,
  totalSize: 0,
});
const adminImages = ref<Image[]>([]);
const adminUsers = ref<User[]>([]);
const editingUserId = ref<number | null>(null);
const editingStorageLimit = ref<number | null>(null);

onMounted(async () => {
  await loadConfig();
  await loadStats();
  await loadImages();
  await loadUsers();
});

const loadConfig = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/config') as ApiResponse<{ configs: Config[] }>;
    if (data.success && data.configs) {
      configs.value = data.configs;
    }
  } catch (error: any) {
    console.error('Failed to load config:', error);
  }
};

const loadStats = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/stats') as ApiResponse<{ stats: Stats }>;
    if (data.success && data.stats) {
      stats.value = data.stats;
    }
  } catch (error: any) {
    console.error('Failed to load stats:', error);
  }
};

const loadImages = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/images') as ApiResponse<{ images: Image[] }>;
    if (data.success && data.images) {
      adminImages.value = data.images;
    }
  } catch (error: any) {
    console.error('Failed to load images:', error);
  }
};

const loadUsers = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/users') as ApiResponse<{ users: User[] }>;
    if (data.success && data.users) {
      adminUsers.value = data.users;
    }
  } catch (error: any) {
    console.error('Failed to load users:', error);
  }
};

const saveConfig = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/config', {
      method: 'PUT',
      body: { configs: configs.value },
    }) as ApiResponse<null>;
    if (data.success) {
      alert('配置保存成功');
    }
  } catch (error: any) {
    alert('保存失败: ' + (error.data?.message || error.message || '未知错误'));
  }
};

const deleteImage = async (id: number) => {
  if (!confirm('确定要删除这张图片吗？')) return;
  
  try {
    const data = await api.fetchWithAuth(`/api/admin/images/${id}`, {
      method: 'DELETE',
    }) as ApiResponse<null>;
    if (data.success) {
      adminImages.value = adminImages.value.filter(img => img.id !== id);
      alert('删除成功');
    }
  } catch (error: any) {
    alert('删除失败: ' + (error.data?.message || error.message || '未知错误'));
  }
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString('zh-CN');
};

const getStorageUsagePercent = (user: User): number => {
  if (!user.storageLimit) return 0;
  return (user.usedStorage / user.storageLimit) * 100;
};

const editStorageLimit = (user: User) => {
  editingUserId.value = user.id;
  editingStorageLimit.value = user.storageLimit;
};

const cancelEdit = () => {
  editingUserId.value = null;
  editingStorageLimit.value = null;
};

const saveStorageLimit = async (userId: number) => {
  try {
    const limitValue = editingStorageLimit.value === null || editingStorageLimit.value === undefined 
      ? null 
      : editingStorageLimit.value;
    
    const data = await api.fetchWithAuth(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: { storageLimit: limitValue },
    }) as ApiResponse<{ user: User }>;
    
    if (data.success) {
      // Update the user in the list
      const userIndex = adminUsers.value.findIndex(u => u.id === userId);
      if (userIndex !== -1 && adminUsers.value[userIndex]) {
        adminUsers.value[userIndex].storageLimit = limitValue;
      }
      cancelEdit();
      alert('空间限制更新成功');
    }
  } catch (error: any) {
    alert('更新失败: ' + (error.data?.message || error.message || '未知错误'));
  }
};
</script>

<style scoped>
.page-admin {
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

.admin-main {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .admin-main {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .admin-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.admin-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid var(--border);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.admin-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.stat-card-blue {
  background: linear-gradient(to bottom right, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05));
  border-color: rgba(37, 99, 235, 0.2);
}

:root[data-theme="dark"] .stat-card-blue {
  background: linear-gradient(to bottom right, rgba(37, 99, 235, 0.2), rgba(59, 130, 246, 0.1));
}

.stat-card-green {
  background: linear-gradient(to bottom right, rgba(22, 163, 74, 0.1), rgba(34, 197, 94, 0.05));
  border-color: rgba(22, 163, 74, 0.2);
}

:root[data-theme="dark"] .stat-card-green {
  background: linear-gradient(to bottom right, rgba(22, 163, 74, 0.2), rgba(34, 197, 94, 0.1));
}

.stat-card-purple {
  background: linear-gradient(to bottom right, rgba(147, 51, 234, 0.1), rgba(168, 85, 247, 0.05));
  border-color: rgba(147, 51, 234, 0.2);
}

:root[data-theme="dark"] .stat-card-purple {
  background: linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(168, 85, 247, 0.1));
}

.stat-card-pink {
  background: linear-gradient(to bottom right, rgba(219, 39, 119, 0.1), rgba(236, 72, 153, 0.05));
  border-color: rgba(219, 39, 119, 0.2);
}

:root[data-theme="dark"] .stat-card-pink {
  background: linear-gradient(to bottom right, rgba(219, 39, 119, 0.2), rgba(236, 72, 153, 0.1));
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-card-blue .stat-label {
  color: #3b82f6;
}

.stat-card-green .stat-label {
  color: #22c55e;
}

.stat-card-purple .stat-label {
  color: #a855f7;
}

.stat-card-pink .stat-label {
  color: #ec4899;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.15s;
  border-bottom: 2px solid transparent;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  color: var(--text-tertiary);
  cursor: pointer;
}

.tab-button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tab-button:hover {
  color: var(--text-secondary);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-item {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.config-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.config-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.15s;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

/* 下拉菜单样式 */
select.input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

select.input:focus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234f46e5' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
}

:root[data-theme="dark"] select.input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23818cf8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
}

:root[data-theme="dark"] select.input:focus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2399a3ff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
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

.admin-image-card {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.15s;
}

.admin-image-card:hover {
  border-color: var(--accent);
  transform: translateY(-0.25rem);
}

.admin-image-preview {
  aspect-ratio: 16 / 9;
  background: var(--bg-tertiary);
  overflow: hidden;
}

.admin-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.admin-image-card:hover .admin-image-preview img {
  transform: scale(1.1);
}

.admin-image-info {
  padding: 1rem;
}

.admin-image-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-image-meta {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.table tbody tr {
  border-bottom: 1px solid var(--border);
}

.table tbody tr:hover {
  background-color: var(--bg-card);
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-admin {
  background-color: rgba(99, 102, 241, 0.15);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

:root[data-theme="dark"] .badge-admin {
  background-color: rgba(99, 102, 241, 0.2);
  color: #818cf8;
}

.badge-user {
  background-color: rgba(107, 114, 128, 0.15);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

:root[data-theme="dark"] .badge-user {
  background-color: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.15s;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4338ca;
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #b91c1c;
  transform: scale(1.05);
}

.btn-full {
  width: 100%;
}

.btn-secondary {
  background-color: #6b7280;
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: #4b5563;
  transform: scale(1.05);
}

.storage-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.storage-input {
  width: 200px;
  padding: 0.5rem 0.75rem;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.storage-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.storage-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
}

.storage-progress-bar {
  flex: 1;
  height: 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 9999px;
  overflow: hidden;
}

.storage-progress-fill {
  height: 100%;
  background: linear-gradient(to right, #10b981, #059669);
  border-radius: 9999px;
  transition: width 0.3s;
}

.storage-progress-fill.storage-progress-warning {
  background: linear-gradient(to right, #f59e0b, #d97706);
}

.storage-progress-fill.storage-progress-danger {
  background: linear-gradient(to right, #ef4444, #dc2626);
}

.storage-progress-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  min-width: 3rem;
  text-align: right;
}
</style>
