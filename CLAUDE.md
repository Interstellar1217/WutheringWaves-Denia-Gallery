# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

**Denia Gallery** — 鸣潮（Wuthering Waves）3.3 版本五星热熔共鸣者达妮娅的同人画廊站点

- **Live Site**: https://interstellar1217.github.io/WutheringWaves-Denia-Gallery/
- **Deployment**: GitHub Pages via GitHub Actions（`main` 分支 push 自动部署）

---

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 18, Vite 5 |
| **路由** | React Router DOM v7 (HashRouter) |
| **样式** | 纯 CSS + 自定义主题变量 |
| **图片处理** | Sharp (缩略图生成) |

---

## 命令

```bash
npm install              # 安装依赖
npm run dev              # 启动开发服务器 (localhost:5173)
npm run build            # 构建生产版本 → dist/
npm run preview          # 预览生产构建
npm run thumbs           # 生成缩略图 (需要 sharp)
```

---

## 项目结构

```
.
├─ src/
│  ├─ App.jsx           # 根组件：NavBar + 路由 (Gallery, Profile)
│  ├─ Gallery.jsx       # 画廊主页面：筛选、排序、分页、灯箱、拖拽
│  ├─ Profile.jsx       # 角色资料页 (中英双语)
│  ├─ main.jsx          # 入口文件
│  └─ styles.css        # 全局样式 + 主题变量
├─ public/
│  ├─ data/images.json  # 画廊元数据
│  └─ images/
│     ├─ full/          # 原图
│     └─ thumbs/        # 缩略图 (自动生成)
└─ scripts/
   └─ generate-thumbnails.js  # 缩略图生成脚本
```

---

## 数据模型 (images.json)

```json
{
  "full": "143518930_p0.jpg",
  "thumbnail": "thumbs/143518930_p0_thumb.webp",
  "artistId": "113703823",
  "tags": ["denia", "fanart"],
  "createdAt": "2026-04-28"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `full` | string | ✓ | 原图文件名 (`public/images/full/`) |
| `thumbnail` | string | ✓ | 缩略图文件名 (`public/images/thumbs/`) |
| `artistId` | string | ✗ | Pixiv 用户 ID → 自动链接至 `https://www.pixiv.net/users/{id}` |
| `tags` | array | ✓ | 必须包含 "denia" + 分类标签 |
| `createdAt` | string | ✓ | ISO 日期 (YYYY-MM-DD) |

### 图片分类标签

| 标签 | 说明 | 文件名特征 |
|------|------|------------|
| `official` | 官方图片 | 哈希命名 (如 `682188dfe9267daf644e4488cb7aeb03572486169.png`)、HEVHeR 前缀 |
| `fanart` | Pixiv 同人 | 数字 + `_p` 开头，如 `143518930_p0.jpg` |
| `others` | 其他来源 | X 平台 (H 开头)、其他来源图片 |
| `SD` | 低清缩放 | 标记需要排在末尾的图片 |

### Pixiv ID 自动识别

系统从文件名提取 Pixiv 作品 ID：
- **数字前缀** (`143518930_p0.jpg`) → 提取 Pixiv ID，构建 `https://www.pixiv.net/artworks/{id}`
- **字母前缀** (`HEVHeRObYAwI-OI.jpg`) → 视为官方/其他（无 Pixiv ID）

---

## 组件架构

### App.jsx
根组件，包含：
- `NavBar` — 顶部导航（高亮当前路由）
- 路由：`/` → `Gallery`，`/profile` → `Profile`
- 使用 `HashRouter` 适配 GitHub Pages

### Gallery.jsx
画廊主页面，核心功能：

| 功能 | 说明 |
|------|------|
| **筛选** | 按 Pixiv ID/标签搜索，标签芯片筛选 |
| **排序** | 默认/日期/Pixiv ID（升/降序切换） |
| **分页** | 每页 30 张 |
| **拖拽卡片** | 鼠标拖拽重排，localStorage 持久化 |
| **灯箱** | 键盘导航（方向键、ESC）、可缩放图片 |
| **i18n** | 中英切换，localStorage 持久化 |

核心函数：
- `extractPixivId(filename)` — 提取 Pixiv ID
- `buildPixivUrl(pixivId)` — 构建作品 URL
- `buildPixivUserUrl(artistId)` — 构建用户 URL
- `fallbackSvg(name)` — 生成 SVG 占位图
- `ZoomableImage` — 支持捏合缩放图片的组件

### Profile.jsx
角色资料页：
- **i18n**: 中英双语切换 (组件级 `t` 对象)
- **Sections**: 属性、技能、背景故事、养成建议

---

## 主题变量 (styles.css)

```css
:root {
  --bg-ink: #0d0a14;           /* 深色背景 */
  --bg-panel: #15101f;         /* 面板背景 */
  --paper: #e8e0f0;            /* 主文字色 */
  --paper-soft: #c9bfd6;       /* 柔和文字 */
  --gold: #b78a4b;             /* 金色强调 */
  --gold-bright: #d8b175;      /* 亮金色 */
  --teal: #6b4a8a;             /* 青紫色 */
  --teal-soft: #9b6fb8;        /* 柔和青紫 */
  --purple: #8b5cf6;           /* 紫色 */
  --purple-bright: #a78bfa;    /* 亮紫色 */
  --line: rgba(183, 138, 75, 0.25);  /* 分割线 */
  --text-muted: #b8aec9;       /* 弱化文字 */
}
```

---

## 开发指南

### 添加新图片

1. 将原图放入 `public/images/full/`
2. 运行 `npm run thumbs` 生成缩略图
3. 在 `public/data/images.json` 添加条目

### 排序逻辑

默认排序（`sortMode: 'default'`）：
1. **非 SD 图片优先** — SD 标签排最后
2. **类别顺序** — 官图 → 同人 → 其他
3. **同类内** — 按 `createdAt` 升序，SD 在同类末尾

### 背景图片

页面背景设置于 `styles.css` → `body`，使用相对路径：
```css
background: url('../public/images/full/HEVHeRObYAwI-OI.jpg');
```

---

## 注意事项

### 路径规范（重要）

**所有资源路径必须使用相对路径**，以确保 GitHub Pages 部署正确：

1. **JavaScript/JSX 文件**：使用 `import.meta.env.BASE_URL` 获取基础路径
   ```javascript
   const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
   // 使用时：`${BASE_PATH}/images/full/image.jpg`
   ```

2. **CSS 文件**：使用相对路径，不要用绝对路径（`/` 开头）或完整的子目录路径
   ```css
   /* 正确 */
   background: url('../public/images/full/image.jpg');
   
   /* 错误 - Vite 无法处理 */
   background: url('/WutheringWaves-Denia-Gallery/images/full/image.jpg');
   ```

3. **HTML 文件**：入口脚本使用相对路径
   ```html
   <!-- 正确 -->
   <script type="module" src="./src/main.jsx"></script>
   
   <!-- 错误 - 会导致 404 -->
   <script type="module" src="/src/main.jsx"></script>
   ```

### GitHub Pages 部署

- **基础路径配置**：`vite.config.js` 中设置 `base: '/WutheringWaves-Denia-Gallery/'`
- **路由**：必须使用 `HashRouter`（不能用 `BrowserRouter`）
- **部署流程**：push 到 `main` 分支 → GitHub Actions 自动构建并部署
- **本地测试**：运行 `npm run build` 后用 `npm run preview` 预览生产构建

### 其他注意事项

- 拖拽位置按图片 key 持久化至 localStorage (`denia-drag-positions`)
- 语言偏好持久化至 localStorage (`denia-lang`)
- 缺失图片会 fallback 到 SVG 占位图
- 触摸设备：滚动启用，拖拽禁用（仅鼠标支持拖拽）
- 缩略图生成使用 Sharp，400px 宽度，WebP 格式，quality 80

---

## 版权说明

所有作品版权归原作者所有。本项目为非盈利性质的个人同人项目。
