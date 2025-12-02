<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">数据库配置</h1>
      <p class="text-center text-gray-600 mb-8">首次使用需要配置数据库连接</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">数据库主机</label>
          <input v-model="config.host" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">端口</label>
          <input v-model.number="config.port" type="number" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">数据库名</label>
          <input v-model="config.database" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input v-model="config.username" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="config.password" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50">
          {{ loading ? '配置中...' : '保存配置' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-center text-gray-500">
        配置完成后，默认管理员账号：admin / admin123
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'setup'
});

const config = ref({
  host: 'localhost',
  port: 3306,
  database: 'nomiimages',
  username: 'root',
  password: '',
});

const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const { data } = await useFetch('/api/config/database', {
      method: 'POST',
      body: config.value,
    });

    if (data.value?.success) {
      success.value = data.value.message;
      setTimeout(() => {
        navigateTo('/');
      }, 1500);
    } else {
      error.value = data.value?.message || '配置失败';
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || '配置失败';
  } finally {
    loading.value = false;
  }
};
</script>

