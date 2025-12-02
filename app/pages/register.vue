<template>
  <div class="auth-page">
    <div class="bg-grid"></div>
    <div class="float-element float-element-1"></div>
    <div class="float-element float-element-2"></div>

    <div class="auth-box">
      <div class="auth-header">
        <NuxtLink to="/" class="auth-logo">
          <div class="logo-icon">
            <span>N</span>
          </div>
          <h1 class="logo-text">NomiImages</h1>
        </NuxtLink>
        <h2 class="auth-title">注册</h2>
        <p class="auth-subtitle">创建新账号</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input 
            v-model="username" 
            type="text" 
            required 
            class="input"
            placeholder="请输入用户名"
          >
        </div>

        <div class="form-group">
          <label class="form-label">邮箱</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="input"
            placeholder="请输入邮箱"
          >
        </div>

        <div class="form-group">
          <label class="form-label">密码</label>
          <div class="password-input-wrapper">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              minlength="6"
              class="input password-input"
              placeholder="至少6位字符"
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              <svg v-if="showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p class="form-hint">至少6位字符</p>
        </div>

        <div class="form-group">
          <label class="form-label">确认密码</label>
          <div class="password-input-wrapper">
            <input 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              required 
              class="input password-input"
              placeholder="请再次输入密码"
            >
            <button 
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
            >
              <svg v-if="showConfirmPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
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
          <span v-if="!loading">注册</span>
          <span v-else class="loading-spinner">注册中...</span>
        </button>
      </form>

      <p class="auth-footer">
        已有账号？
        <NuxtLink to="/login" class="auth-link">立即登录</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'setup'
});

const auth = useAuth();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
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

.password-input-wrapper {
  position: relative;
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}

.password-toggle:hover {
  color: var(--text-secondary);
}

.password-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 0.25rem;
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

.auth-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}

.auth-link:hover {
  color: var(--accent-hover);
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
