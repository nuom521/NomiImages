<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
    <nav class="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-white">NomiImages</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/login" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">
              登录
            </NuxtLink>
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/register" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              注册
            </NuxtLink>
            <NuxtLink v-if="auth.isAuthenticated.value" to="/dashboard" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">
              个人中心
            </NuxtLink>
            <NuxtLink v-if="auth.isAdmin.value" to="/admin" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">
              后台管理
            </NuxtLink>
            <button v-if="auth.isAuthenticated.value" @click="auth.logout" class="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition">
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">图片上传</h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition cursor-pointer" 
             @click="triggerFileInput"
             @dragover.prevent="dragover = true"
             @dragleave.prevent="dragover = false"
             @drop.prevent="handleDrop"
             :class="{ 'border-purple-500 bg-purple-50': dragover }">
          <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden" multiple>
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-lg text-gray-600 mb-2">点击或拖拽图片到此处上传</p>
          <p class="text-sm text-gray-400">支持 JPG、PNG、GIF、WEBP 格式</p>
        </div>

        <div v-if="uploading" class="mt-6">
          <div class="bg-purple-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-purple-800 font-medium">上传中...</span>
              <span class="text-purple-600">{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-purple-200 rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
            </div>
          </div>
        </div>

        <div v-if="uploadedImages.length > 0" class="mt-8">
          <h3 class="text-xl font-bold mb-4 text-gray-800">上传成功</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="image in uploadedImages" :key="image.id" class="bg-gray-50 rounded-lg p-4">
              <img :src="image.url" alt="Uploaded" class="w-full h-48 object-cover rounded-lg mb-2">
              <div class="flex items-center justify-between">
                <input :value="image.url" readonly class="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm mr-2">
                <button @click="copyUrl(image.url)" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
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
  middleware: 'setup'
});

const auth = useAuth();
const fileInput = ref(null);
const dragover = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadedImages = ref([]);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (e) => {
  const files = Array.from(e.target.files);
  await uploadFiles(files);
};

const handleDrop = async (e) => {
  dragover.value = false;
  const files = Array.from(e.dataTransfer.files);
  await uploadFiles(files);
};

const uploadFiles = async (files) => {
  uploadedImages.value = [];
  uploading.value = true;
  uploadProgress.value = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = useCookie('token');
      const response = await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': token.value ? `Bearer ${token.value}` : '',
        },
      });

      if (response.success) {
        uploadedImages.value.push(response.image);
      }
    } catch (error) {
      alert('上传失败: ' + (error.data?.message || error.message));
    }

    uploadProgress.value = ((i + 1) / files.length) * 100;
  }

  uploading.value = false;
  uploadProgress.value = 0;
};

const copyUrl = async (url) => {
  await navigator.clipboard.writeText(url);
  alert('链接已复制到剪贴板');
};
</script>

