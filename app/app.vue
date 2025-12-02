<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'NomiImages - 专业图床系统',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  script: [
    {
      innerHTML: `
        (function() {
          const themeMode = document.cookie.match(/theme-mode=([^;]+)/)?.[1] || 'system';
          const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const actualTheme = themeMode === 'system' ? getSystemTheme() : themeMode;
          document.documentElement.setAttribute('data-theme', actualTheme);
          document.documentElement.classList.add(actualTheme);
        })();
      `,
      type: 'text/javascript',
    },
  ],
});

// 初始化主题系统
const theme = useTheme();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 浅色主题（默认） */
:root,
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f1f3f5;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --border: rgba(0, 0, 0, 0.1);
  --border-light: rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 深色主题 */
:root[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  --bg-card: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-tertiary: #6b7280;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --border: rgba(255, 255, 255, 0.1);
  --border-light: rgba(255, 255, 255, 0.05);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  min-height: 100vh;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* 玻璃态效果 */
.glass {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

:root[data-theme="light"] .glass {
  background: rgba(255, 255, 255, 0.8);
}

:root[data-theme="dark"] .glass {
  background: rgba(255, 255, 255, 0.05);
}

/* 通用工具类 */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

.text-white {
  color: #ffffff;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-indigo-400 {
  color: #818cf8;
}

.text-indigo-500 {
  color: #6366f1;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-4xl {
  font-size: 2.25rem;
}

.text-5xl {
  font-size: 3rem;
}

.text-6xl {
  font-size: 3.75rem;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.bg-indigo-700 {
  background-color: #4338ca;
}

.bg-gray-900 {
  background-color: #111827;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-2xl {
  border-radius: 1rem;
}

.rounded-full {
  border-radius: 9999px;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-2\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.py-20 {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.py-32 {
  padding-top: 8rem;
  padding-bottom: 8rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.p-12 {
  padding: 3rem;
}

.p-16 {
  padding: 4rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mb-12 {
  margin-bottom: 3rem;
}

.mb-20 {
  margin-bottom: 5rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.w-full {
  width: 100%;
}

.w-10 {
  width: 2.5rem;
}

.w-14 {
  width: 3.5rem;
}

.w-72 {
  width: 18rem;
}

.w-96 {
  width: 24rem;
}

.h-10 {
  height: 2.5rem;
}

.h-14 {
  height: 3.5rem;
}

.h-16 {
  height: 4rem;
}

.h-20 {
  height: 5rem;
}

.h-24 {
  height: 6rem;
}

.h-48 {
  height: 12rem;
}

.h-72 {
  height: 18rem;
}

.h-96 {
  height: 24rem;
}

.min-h-screen {
  min-height: 100vh;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.top-20 {
  top: 5rem;
}

.bottom-20 {
  bottom: 5rem;
}

.left-10 {
  left: 2.5rem;
}

.right-10 {
  right: 2.5rem;
}

.z-10 {
  z-index: 10;
}

.z-50 {
  z-index: 50;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-x-auto {
  overflow-x: auto;
}

.border {
  border-width: 1px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-white\/10 {
  border-color: rgba(255, 255, 255, 0.1);
}

.border-indigo-500\/50 {
  border-color: rgba(99, 102, 241, 0.5);
}

.border-indigo-500\/30 {
  border-color: rgba(99, 102, 241, 0.3);
}

.border-red-500\/50 {
  border-color: rgba(239, 68, 68, 0.5);
}

.border-green-500\/50 {
  border-color: rgba(34, 197, 94, 0.5);
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-white {
  --tw-gradient-from: #ffffff;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 255, 255, 0));
}

.from-gray-200 {
  --tw-gradient-from: #e5e7eb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(229, 231, 235, 0));
}

.from-gray-400 {
  --tw-gradient-from: #9ca3af;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(156, 163, 175, 0));
}

.from-indigo-500 {
  --tw-gradient-from: #6366f1;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(99, 102, 241, 0));
}

.from-indigo-600 {
  --tw-gradient-from: #4f46e5;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(79, 70, 229, 0));
}

.from-blue-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
}

.from-green-600 {
  --tw-gradient-from: #16a34a;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(22, 163, 74, 0));
}

.from-purple-600 {
  --tw-gradient-from: #9333ea;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(147, 51, 234, 0));
}

.from-pink-600 {
  --tw-gradient-from: #db2777;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(219, 39, 119, 0));
}

.to-gray-400 {
  --tw-gradient-to: #9ca3af;
}

.to-purple-600 {
  --tw-gradient-to: #9333ea;
}

.to-blue-500 {
  --tw-gradient-to: #3b82f6;
}

.to-green-500 {
  --tw-gradient-to: #22c55e;
}

.to-purple-500 {
  --tw-gradient-to: #a855f7;
}

.to-pink-500 {
  --tw-gradient-to: #ec4899;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.text-transparent {
  color: transparent;
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}

.hover\:text-white:hover {
  color: #ffffff;
}

.hover\:text-gray-300:hover {
  color: #d1d5db;
}

.hover\:text-indigo-300:hover {
  color: #a5b4fc;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.hover\:-translate-y-2:hover {
  transform: translateY(-0.5rem);
}

.hover\:border-indigo-500\/50:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

.hover\:border-white\/20:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.hover\:bg-red-700:hover {
  background-color: #b91c1c;
}

.hover\:bg-white\/5:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}

.focus\:ring-1:focus {
  box-shadow: 0 0 0 1px #6366f1;
}

.cursor-pointer {
  cursor: pointer;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.inline-block {
  display: inline-block;
}

.inline-flex {
  display: inline-flex;
}

.grid {
  display: grid;
}

.hidden {
  display: none;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.object-cover {
  object-fit: cover;
}

.uppercase {
  text-transform: uppercase;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.shadow-indigo-500\/50 {
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.5);
}

.blur-3xl {
  filter: blur(64px);
}

.opacity-30 {
  opacity: 0.3;
}

.opacity-50 {
  opacity: 0.5;
}

.leading-relaxed {
  line-height: 1.625;
}

.leading-tight {
  line-height: 1.25;
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.float {
  animation: float 6s ease-in-out infinite;
}

.rotate {
  animation: rotate 20s linear infinite;
}

.pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* 响应式 */
@media (min-width: 640px) {
  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .sm\:flex-row {
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  
  .md\:text-2xl {
    font-size: 1.5rem;
  }
  
  .md\:text-7xl {
    font-size: 4.5rem;
  }
}

@media (min-width: 1024px) {
  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  
  .lg\:order-1 {
    order: 1;
  }
  
  .lg\:order-2 {
    order: 2;
  }
}

/* 背景网格 */
.bg-grid {
  background-image: 
    linear-gradient(to right, var(--border-light) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-light) 1px, transparent 1px);
  background-size: 4rem 4rem;
  transition: background-image 0.3s ease;
}

/* 3D变换 */
.transform-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4338ca;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.2);
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 输入框样式 */
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.15s ease-in-out;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
  background-color: var(--bg-primary);
}

/* 卡片样式 */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

/* 标签页样式 */
.tab-button {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  border-bottom: 2px solid transparent;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  color: #9ca3af;
  cursor: pointer;
}

.tab-button.active {
  color: #818cf8;
  border-bottom-color: #818cf8;
}

.tab-button:hover {
  color: #d1d5db;
}

/* 表格样式 */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
}

.table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}

.table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 徽章样式 */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-admin {
  background-color: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.badge-user {
  background-color: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.3);
}
</style>
