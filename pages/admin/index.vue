<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    <nav class="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-white">NomiImages</NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">首页</NuxtLink>
            <NuxtLink to="/dashboard" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">个人中心</NuxtLink>
            <button @click="auth.logout" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-2xl p-8 mb-6">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">后台管理</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="text-3xl font-bold">{{ stats.totalUsers }}</div>
            <div class="text-blue-100 mt-1">总用户数</div>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div class="text-3xl font-bold">{{ stats.totalImages }}</div>
            <div class="text-green-100 mt-1">总图片数</div>
          </div>
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div class="text-3xl font-bold">{{ stats.todayImages }}</div>
            <div class="text-purple-100 mt-1">今日上传</div>
          </div>
          <div class="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
            <div class="text-3xl font-bold">{{ formatSize(stats.totalSize) }}</div>
            <div class="text-pink-100 mt-1">总存储量</div>
          </div>
        </div>

        <div class="flex space-x-2 mb-6">
          <button @click="activeTab = 'config'" :class="['px-6 py-2 rounded-lg transition', activeTab === 'config' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            系统配置
          </button>
          <button @click="activeTab = 'images'" :class="['px-6 py-2 rounded-lg transition', activeTab === 'images' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            图片管理
          </button>
          <button @click="activeTab = 'users'" :class="['px-6 py-2 rounded-lg transition', activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            用户管理
          </button>
        </div>

        <!-- Config Tab -->
        <div v-if="activeTab === 'config'" class="space-y-4">
          <div v-for="config in configs" :key="config.key" class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ config.description }}</label>
            <input v-if="config.key !== 'allowed_mime_types'" v-model="config.value" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            <input v-else v-model="config.value" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="用逗号分隔，如: image/jpeg,image/png">
            <p class="text-xs text-gray-500 mt-1" v-if="config.key === 'filename_format'">
              可用变量: {timestamp}, {random}, {original}, {userid}, {date}, {time}
            </p>
            <p class="text-xs text-gray-500 mt-1" v-if="config.key === 'guest_image_expire_days'">
              0 表示永久保存
            </p>
          </div>
          <button @click="saveConfig" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
            保存配置
          </button>
        </div>

        <!-- Images Tab -->
        <div v-if="activeTab === 'images'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="image in adminImages" :key="image.id" class="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <img :src="image.url" :alt="image.originalName" class="w-full h-48 object-cover">
              <div class="p-4">
                <p class="text-sm text-gray-700 mb-1 truncate">{{ image.originalName }}</p>
                <p class="text-xs text-gray-500 mb-2">{{ image.user?.username || '游客' }} · {{ formatDate(image.createdAt) }}</p>
                <button @click="deleteImage(image.id)" class="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'">
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in adminUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="['px-2 py-1 rounded text-xs', user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800']">
                      {{ user.role === 'admin' ? '管理员' : '用户' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(user.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['setup', 'auth', 'admin']
});

const auth = useAuth();
const api = useApi();
const activeTab = ref('config');
const configs = ref([]);
const stats = ref({
  totalUsers: 0,
  totalImages: 0,
  todayImages: 0,
  totalSize: 0,
});
const adminImages = ref([]);
const adminUsers = ref([]);

onMounted(async () => {
  await loadConfig();
  await loadStats();
  await loadImages();
  await loadUsers();
});

const loadConfig = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/config');
    if (data.success) {
      configs.value = data.configs;
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
};

const loadStats = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/stats');
    if (data.success) {
      stats.value = data.stats;
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};

const loadImages = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/images');
    if (data.success) {
      adminImages.value = data.images;
    }
  } catch (error) {
    console.error('Failed to load images:', error);
  }
};

const loadUsers = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/users');
    if (data.success) {
      adminUsers.value = data.users;
    }
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const saveConfig = async () => {
  try {
    const data = await api.fetchWithAuth('/api/admin/config', {
      method: 'PUT',
      body: { configs: configs.value },
    });
    if (data.success) {
      alert('配置保存成功');
    }
  } catch (error) {
    alert('保存失败: ' + (error.data?.message || error.message));
  }
};

const deleteImage = async (id) => {
  if (!confirm('确定要删除这张图片吗？')) return;
  
  try {
    const data = await api.fetchWithAuth(`/api/admin/images/${id}`, {
      method: 'DELETE',
    });
    if (data.success) {
      adminImages.value = adminImages.value.filter(img => img.id !== id);
      alert('删除成功');
    }
  } catch (error) {
    alert('删除失败: ' + (error.data?.message || error.message));
  }
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN');
};
</script>

