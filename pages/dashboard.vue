<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
    <nav class="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-white">NomiImages</NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">首页</NuxtLink>
            <NuxtLink v-if="auth.isAdmin.value" to="/admin" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">后台管理</NuxtLink>
            <button @click="auth.logout" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">个人中心</h2>

        <div class="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
          <h3 class="text-xl font-semibold mb-2">欢迎，{{ auth.currentUser.value?.username }}</h3>
          <p class="text-purple-100">{{ auth.currentUser.value?.email }}</p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>

        <div v-else-if="images.length === 0" class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-500 text-lg">还没有上传过图片</p>
          <NuxtLink to="/" class="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">去上传</NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="image in images" :key="image.id" class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <img :src="image.url" :alt="image.originalName" class="w-full h-48 object-cover">
            <div class="p-4">
              <p class="text-sm text-gray-600 mb-2 truncate">{{ image.originalName }}</p>
              <p class="text-xs text-gray-400 mb-3">{{ formatSize(image.size) }} · {{ formatDate(image.createdAt) }}</p>
              <div class="flex items-center space-x-2">
                <input :value="image.url" readonly class="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-xs">
                <button @click="copyUrl(image.url)" class="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['setup', 'auth']
});

const auth = useAuth();
const api = useApi();
const images = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await api.fetchWithAuth('/api/images/my');
    if (data.success) {
      images.value = data.images;
    }
  } catch (error) {
    console.error('Failed to load images:', error);
  } finally {
    loading.value = false;
  }
});

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

const copyUrl = async (url) => {
  await navigator.clipboard.writeText(url);
  alert('链接已复制到剪贴板');
};
</script>

