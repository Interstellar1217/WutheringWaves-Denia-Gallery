# CLAUDE.md

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
| `official` | 官方图片 | 你明确指定的官图（哈希命名带时间戳、HEVHeR 前缀等） |
| `fanart` | Pixiv 同人 | 数字 + `_p` 开头，如 `143518930_p0.jpg` |
| `others` | 其他来源 | X 平台、其他来源图片 |

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
画廊主页面：
- **筛选**: 按 Pixiv ID/标签搜索，标签芯片筛选
- **排序**: 默认（官图→同人→日期，SD 标签排最后）、日期、Pixiv ID（升/降序切换）
- **分页**: 每页 30 张
- **拖拽卡片**: 鼠标拖拽，localStorage 持久化
- **灯箱**: 键盘导航（方向键、ESC）、可缩放图片
- **i18n**: 中英切换，localStorage 持久化

核心函数：
- `extractPixivId(filename)` — 提取 Pixiv ID
- `buildPixivUrl(pixivId)` — 构建作品 URL
- `buildPixivUserUrl(artistId)` — 构建用户 URL
- `fallbackSvg(name)` — 生成 SVG 占位图
- `ZoomableImage` — 支持捏合缩放图片的组件

### Profile.jsx
角色资料页：
- **i18n**: 中英双语切换
- **Sections**: 属性、技能、背景故事、养成建议
- 内容存储在组件级 `t` 对象 (zh/en 翻译)

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
1. **SD 标签图片** - 排到最后
2. **官图** (`official` 标签) - 非 SD 在前
3. **同人** (`fanart` 标签) - 非 SD 在前
4. **其他** (`others` 标签) - 非 SD 在前
5. 同类内按 `createdAt` 升序排列，SD 标签同类型内排末尾

### 背景图片

页面背景设置于 `styles.css` → `body`：
```css
background: url('/WutheringWaves-Denia-Gallery/images/full/HEVHeRObYAwI-OI.jpg')
```

---

## 注意事项

- `BASE_PATH = '/WutheringWaves-Denia-Gallery/'` 在 Gallery.jsx 中用于 GitHub Pages 资源加载
- 拖拽位置按图片 key 持久化至 localStorage (`denia-drag-positions`)
- 语言偏好持久化至 localStorage (`denia-lang`)
- 缺失图片会 fallback 到 SVG 占位图
- 触摸设备：滚动启用，拖拽禁用（仅鼠标支持拖拽）

---

## 版权说明

所有作品版权归原作者所有。本项目为非盈利性质的个人同人项目。
