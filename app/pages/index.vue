<template>
  <div class="page-home">
    <!-- 背景网格 -->
    <div class="bg-grid"></div>
    
    <!-- 3D 浮动元素 -->
    <div class="float-element float-element-1"></div>
    <div class="float-element float-element-2"></div>
    
    <!-- 导航栏 -->
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="nav-content">
          <div class="nav-logo">
            <div class="logo-icon">
              <span>N</span>
            </div>
            <h1 class="logo-text">NomiImages</h1>
          </div>
          <div class="nav-links">
            <ThemeToggle />
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/upload" class="btn btn-primary">上传图片</NuxtLink>
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/login" class="nav-link">登录</NuxtLink>
            <NuxtLink v-if="!auth.isAuthenticated.value" to="/register" class="nav-link">注册</NuxtLink>
            <NuxtLink v-if="auth.isAuthenticated.value" to="/upload" class="btn btn-primary">上传图片</NuxtLink>
            <NuxtLink v-if="auth.isAuthenticated.value" to="/dashboard" class="nav-link">个人中心</NuxtLink>
            <NuxtLink v-if="auth.isAdmin.value" to="/admin" class="nav-link">后台管理</NuxtLink>
            <button v-if="auth.isAuthenticated.value" @click="auth.logout" class="nav-link">退出</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- Hero 区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span>🚀 专业图床解决方案</span>
          </div>
          <h1 class="hero-title">下一代图床系统</h1>
          <p class="hero-description">
            安全、快速、可靠的图片托管服务<br>
            支持多种格式，无限存储，极速CDN加速
          </p>
          <div class="hero-buttons">
            <NuxtLink to="/upload" class="btn btn-primary btn-large">
              <span>上传图片</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            <button @click="scrollToFeatures" class="btn btn-secondary btn-large">了解更多</button>
          </div>
        </div>

        <!-- 3D 卡片展示 -->
        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card"
            @mouseenter="handleCardHover($event, index)"
            @mousemove="handleCardMove($event, index)"
            @mouseleave="handleCardLeave($event, index)"
            :ref="el => cardRefs[index] = el as HTMLElement | null"
          >
            <div class="feature-icon">
              <div class="feature-emoji">{{ feature.icon }}</div>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>

        <!-- 特性展示 -->
        <div ref="featuresSection" class="features-section">
          <div class="feature-block">
            <div class="feature-block-content">
              <div class="feature-block-text">
                <h2 class="feature-block-title">极速上传</h2>
                <p class="feature-block-desc">
                  采用先进的CDN技术，无论您在世界任何地方，都能享受到极速的上传和访问体验。
                  支持拖拽上传、批量上传，让图片管理变得简单高效。
                </p>
                <ul class="feature-list">
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    全球CDN加速节点
                  </li>
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    拖拽批量上传
                  </li>
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
                    实时上传进度
                  </li>
                </ul>
              </div>
              <div class="feature-block-image">
                <div class="feature-image-box">
                  <div class="feature-emoji-large">⚡</div>
                </div>
              </div>
            </div>
        </div>

          <div class="feature-block">
            <div class="feature-block-content">
              <div class="feature-block-image feature-block-image-left">
                <div class="feature-image-box">
                  <div class="feature-emoji-large">🔒</div>
                </div>
            </div>
              <div class="feature-block-text">
                <h2 class="feature-block-title">安全可靠</h2>
                <p class="feature-block-desc">
                  企业级安全保障，所有图片都经过加密存储。支持访问权限控制，
                  确保您的图片数据安全无忧。
                </p>
                <ul class="feature-list">
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    加密存储
                  </li>
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    权限管理
                  </li>
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    定期备份
                  </li>
                </ul>
            </div>
          </div>
        </div>

          <div class="feature-block">
            <div class="feature-block-content">
              <div class="feature-block-text">
                <h2 class="feature-block-title">灵活配置</h2>
                <p class="feature-block-desc">
                  强大的后台管理系统，支持自定义文件名格式、存储策略等。
                  完全掌控您的图床服务。
                </p>
                <ul class="feature-list">
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    自定义文件名格式
                  </li>
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    存储策略配置
                  </li>
                  <li class="feature-list-item">
                    <svg class="feature-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    访问统计
                  </li>
                </ul>
              </div>
              <div class="feature-block-image">
                <div class="feature-image-box">
                  <div class="feature-emoji-large">⚙️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      <!-- CTA 区域 -->
      <section class="cta-section">
        <div class="cta-box">
          <h2 class="cta-title">准备开始了吗？</h2>
          <p class="cta-description">立即上传图片，快速获取图片链接</p>
          <div class="cta-buttons">
            <NuxtLink to="/upload" class="btn btn-primary btn-large">立即上传</NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <p>&copy; 2025 NomiImages. All rights reserved.</p>
    </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '../../components/ThemeToggle.vue';

definePageMeta({
  middleware: 'setup'
});

const auth = useAuth();
const featuresSection = ref<HTMLElement | null>(null);
const cardRefs = ref<(HTMLElement | null)[]>([]);

const features = [
  {
    icon: '🚀',
    title: '极速上传',
    description: '采用CDN加速技术，全球节点分布，确保快速上传和访问体验。'
  },
  {
    icon: '🔒',
    title: '安全可靠',
    description: '企业级安全保障，加密存储，多重备份机制，数据安全无忧。'
  },
  {
    icon: '⚙️',
    title: '灵活配置',
    description: '强大的后台管理系统，支持自定义配置，完全掌控您的服务。'
  }
];

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const handleCardHover = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index];
  if (card) {
    card.style.transition = 'transform 0.1s ease-out';
  }
};

const handleCardMove = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index];
  if (card) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }
};

const handleCardLeave = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index];
  if (card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.5s ease-out';
  }
};
</script>

<style scoped>
.page-home {
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
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #6366f1, #9333ea);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.3s;
}

.logo-icon:hover {
  transform: rotateY(12deg);
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
  transition: color 0.15s;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover {
  color: var(--text-primary);
}

.main-content {
  position: relative;
  z-index: 10;
}

.hero-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1rem 5rem;
}

@media (min-width: 640px) {
  .hero-section {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-section {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.hero-content {
  text-align: center;
  margin-bottom: 5rem;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1.5rem;
}

.hero-badge span {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, var(--text-primary), var(--text-secondary), var(--text-tertiary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.25;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 48rem;
  margin: 0 auto 3rem;
  line-height: 1.625;
}

@media (min-width: 768px) {
  .hero-description {
    font-size: 1.5rem;
  }
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
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
  gap: 0.5rem;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4338ca;
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background: var(--bg-secondary);
  border-color: var(--accent);
  transform: scale(1.05);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.75rem;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.15s;
}

.btn:hover .btn-icon {
  transform: translateX(0.25rem);
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 8rem;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--border);
  transition: all 0.5s;
  transform-style: preserve-3d;
}

.feature-card:hover {
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-0.5rem);
}

.feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: background-color 0.15s;
}

.feature-card:hover .feature-icon {
  background: rgba(99, 102, 241, 0.3);
}

.feature-emoji {
  font-size: 1.875rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.625;
}

.features-section {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.feature-block {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 3rem;
  border: 1px solid var(--border);
}

.feature-block-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .feature-block-content {
    grid-template-columns: repeat(2, 1fr);
      }
}

.feature-block-text {
  order: 1;
}

.feature-block-image {
  order: 2;
}

@media (min-width: 1024px) {
  .feature-block-image-left {
    order: 1;
  }
  
  .feature-block-image-left + .feature-block-text {
    order: 2;
  }
}

.feature-block-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.feature-block-desc {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.625;
  margin-bottom: 1.5rem;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
    }

.feature-list-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.feature-check {
  width: 1.25rem;
  height: 1.25rem;
  color: #6366f1;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.feature-image-box {
  aspect-ratio: 16 / 9;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-emoji-large {
  font-size: 3.75rem;
}

.cta-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1rem;
  }

@media (min-width: 640px) {
  .cta-section {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .cta-section {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.cta-box {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 4rem;
  border: 1px solid var(--border);
  text-align: center;
}

.cta-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.cta-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
  }
}

.footer {
  position: relative;
  z-index: 10;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  backdrop-filter: blur(10px);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .footer-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .footer-container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.footer-content {
  text-align: center;
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
</style>

