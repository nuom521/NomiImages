<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">登录</h1>
      <p class="text-center text-gray-600 mb-8">欢迎回来</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input v-model="username" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="password" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-center text-gray-500">
        还没有账号？
        <NuxtLink to="/register" class="text-purple-600 hover:text-purple-700 font-medium">立即注册</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'setup'
});

const auth = useAuth();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  const result = await auth.login(username.value, password.value);
  
  if (result.success) {
    navigateTo('/');
  } else {
    error.value = result.message || '登录失败';
  }
  
  loading.value = false;
};
</script>

