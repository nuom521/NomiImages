<template>
  <div class="auth-page">
    <div class="bg-grid"></div>
    <div class="float-element float-element-1"></div>
    <div class="float-element float-element-2"></div>

    <div class="auth-box">
      <div class="auth-header">
        <div class="auth-logo">
          <div class="logo-icon">
            <span>N</span>
          </div>
          <h1 class="logo-text">NomiImages</h1>
        </div>
        <h2 class="auth-title">数据库配置</h2>
        <p class="auth-subtitle">首次使用需要配置数据库连接</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label class="form-label">数据库主机</label>
          <input 
            v-model="config.host" 
            type="text" 
            required 
            class="input"
            placeholder="localhost"
          >
        </div>

        <div class="form-group">
          <label class="form-label">端口</label>
          <input 
            v-model.number="config.port" 
            type="number" 
            required 
            class="input"
            placeholder="3306"
          >
        </div>

        <div class="form-group">
          <label class="form-label">数据库名</label>
          <input 
            v-model="config.database" 
            type="text" 
            required 
            class="input"
            placeholder="nomiimages"
          >
        </div>

        <div class="form-group">
          <label class="form-label">用户名</label>
          <input 
            v-model="config.username" 
            type="text" 
            required 
            class="input"
            placeholder="root"
          >
        </div>

        <div class="form-group">
          <label class="form-label">密码</label>
          <input 
            v-model="config.password" 
            type="password" 
            required 
            class="input"
            placeholder="请输入数据库密码"
          >
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <button 
          type="submit" 
          :disabled="loading" 
          class="btn btn-primary btn-full"
        >
          <span v-if="!loading">保存配置</span>
          <span v-else class="loading-spinner">配置中...</span>
        </button>
      </form>

      <p class="auth-footer">
        配置完成后，默认管理员账号：admin / admin123
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    const { data } = await useFetch<{ success: boolean; message?: string }>('/api/config/database', {
      method: 'POST',
      body: config.value,
    });

    if (data.value?.success) {
      success.value = data.value.message || '配置成功';
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

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
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

.float-element {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  animation: float 6s ease-in-out infinite;
}

.float-element-1 {
  top: 5rem;
  left: 2.5rem;
  width: 18rem;
  height: 18rem;
  background: rgba(99, 102, 241, 0.1);
}

.float-element-2 {
  bottom: 5rem;
  right: 2.5rem;
  width: 24rem;
  height: 24rem;
  background: rgba(147, 51, 234, 0.1);
  animation-delay: 2s;
}

.auth-box {
  position: relative;
  z-index: 10;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.auth-subtitle {
  color: var(--text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
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

.alert {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #fca5a5;
}

.alert-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.5);
  color: #86efac;
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
  background-color: var(--accent);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-hover);
  transform: scale(1.02);
}

.btn-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-spinner::before {
  content: '';
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
