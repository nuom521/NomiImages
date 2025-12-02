# NomiImages - 图床系统

一个基于 Nuxt 4 + MySQL + Sequelize 构建的完整图床程序，具有精美的界面和完整的后台管理系统。

## 功能特性

- 🎨 **精美的现代化UI设计** - 使用渐变色彩和流畅动画
- 🔐 **完整的用户认证系统** - 注册、登录、JWT Token认证
- 📸 **图片上传功能** - 支持拖拽上传、多文件上传
- 👤 **个人中心** - 查看历史上传的图片
- 🛡️ **后台管理系统** - 完整的系统配置和用户管理
- ⚙️ **灵活的配置系统** - 可配置游客上传、文件保存时长、文件名格式等
- 🗄️ **数据库配置向导** - 首次访问自动引导数据库配置

## 技术栈

- **前端框架**: Nuxt 4
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **文件处理**: 原生 Node.js fs 模块

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

首次访问网站时，会自动跳转到数据库配置页面。填写以下信息：

- 数据库主机（默认: localhost）
- 端口（默认: 3306）
- 数据库名
- 用户名
- 密码

配置完成后，系统会自动创建数据表和默认配置。

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问 `http://localhost:28001`

## 默认账号

配置完成后，系统会自动创建默认管理员账号：

- **用户名**: admin
- **密码**: admin123

**⚠️ 请在生产环境中立即修改默认密码！**

## 目录结构

```
NomiImages/
├── app/                  # Nuxt 应用目录
│   ├── app.vue           # 应用根组件
│   ├── pages/            # 页面路由
│   │   ├── index.vue     # 首页（图片上传）
│   │   ├── setup.vue     # 数据库配置页面
│   │   ├── login.vue     # 登录页面
│   │   ├── register.vue  # 注册页面
│   │   ├── dashboard.vue # 个人中心
│   │   └── admin/        # 后台管理
│   │       └── index.vue # 管理后台首页
│   ├── composables/      # Vue 组合式函数
│   │   ├── useAuth.ts    # 认证相关
│   │   └── useApi.ts     # API 请求封装
│   └── middleware/       # 路由中间件
│       ├── auth.ts       # 认证中间件
│       ├── admin.ts      # 管理员中间件
│       └── setup.ts      # 配置检查中间件
├── server/               # 服务端代码
│   ├── api/              # API 路由
│   ├── utils/            # 工具函数
│   │   ├── db.ts         # 数据库连接
│   │   ├── models.ts     # 数据模型
│   │   ├── auth.ts       # 认证工具
│   │   └── image.ts      # 图片处理工具
│   └── middleware/       # 服务端中间件
└── data/                 # 数据目录（自动创建）
    ├── config.json       # 数据库配置
    └── image/            # 图片存储目录
        ├── guest/        # 游客图片
        └── {userId}/     # 用户图片
```

## 系统配置说明

在后台管理系统中，可以配置以下选项：

### 1. 是否允许游客上传
- `true`: 允许未登录用户上传图片
- `false`: 仅允许登录用户上传

### 2. 游客图片保存时长
- 数字（天）：游客上传的图片保存天数
- `0`: 永久保存

### 3. 文件名存储格式
支持以下魔法变量：
- `{timestamp}` - 时间戳（格式: YYYYMMDDHHmmss）
- `{random}` - 8位随机字符串
- `{original}` - 原始文件名（不含扩展名）
- `{userid}` - 用户ID（游客为 guest）
- `{date}` - 日期（格式: YYYY-MM-DD）
- `{time}` - 时间（格式: HH-mm-ss）

示例：`{timestamp}_{random}` → `20250115143022_a1b2c3d4.jpg`

### 4. 最大文件大小
以字节为单位，默认 10MB (10485760)

### 5. 允许的MIME类型
用逗号分隔，默认：`image/jpeg,image/png,image/gif,image/webp`

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 图片相关
- `POST /api/upload` - 上传图片（需要认证，游客可选）
- `GET /api/images/my` - 获取我的图片列表（需要认证）
- `GET /api/image/{path}` - 获取图片文件

### 配置相关
- `GET /api/config/check` - 检查数据库是否已配置
- `POST /api/config/database` - 配置数据库

### 后台管理（需要管理员权限）
- `GET /api/admin/config` - 获取系统配置
- `PUT /api/admin/config` - 更新系统配置
- `GET /api/admin/stats` - 获取统计数据
- `GET /api/admin/images` - 获取所有图片列表
- `GET /api/admin/users` - 获取所有用户列表
- `DELETE /api/admin/images/{id}` - 删除图片

## 生产环境部署

### 1. 环境变量

创建 `.env` 文件：

```env
JWT_SECRET=your-secret-key-change-this
```

### 2. 构建应用

```bash
npm run build
```

### 3. 启动生产服务器

```bash
npm run preview
```

### 4. 使用 PM2（推荐）

```bash
npm install -g pm2
pm2 start npm --name "nomiimages" -- start
```

## 注意事项

1. **安全性**: 生产环境请务必修改默认管理员密码和 JWT_SECRET
2. **文件存储**: 图片存储在 `data/image/` 目录，请确保有足够的磁盘空间
3. **数据库备份**: 定期备份 MySQL 数据库
4. **文件清理**: 可以设置定时任务清理过期的游客图片

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
