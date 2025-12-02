<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">注册</h1>
      <p class="text-center text-gray-600 mb-8">创建新账号</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input v-model="username" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="password" type="password" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          <p class="text-xs text-gray-500 mt-1">至少6位字符</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input v-model="confirmPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-center text-gray-500">
        已有账号？
        <NuxtLink to="/login" class="text-purple-600 hover:text-purple-700 font-medium">立即登录</NuxtLink>
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
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  const result = await auth.register(username.value, email.value, password.value);
  
  if (result.success) {
    success.value = '注册成功，正在跳转...';
    setTimeout(() => {
      navigateTo('/login');
    }, 1500);
  } else {
    error.value = result.message || '注册失败';
  }
  
  loading.value = false;
};
</script>

