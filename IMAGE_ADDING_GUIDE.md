# 图片添加指南

## 快速开始

### 1. 下载图片
- 从 Pixiv/其他来源下载原图
- 保存到 `public/images/full/` 目录

### 2. 生成缩略图
```bash
# 安装 sharp (首次运行需要)
npm install sharp

# 批量生成缩略图
npm run thumbs
```

### 3. 更新 images.json
在 `public/data/images.json` 添加新条目：

```json
{
  "full": "143518930_p0.jpg",
  "thumbnail": "thumbs/143518930_p0_thumb.webp",
  "artistId": "113703823",
  "tags": ["denia", "fanart"],
  "createdAt": "2026-04-28"
}
```

### 4. 测试
- 刷新浏览器查看是否显示正常
- 点击卡片测试 Lightbox

---

## 数据格式详解

### full (必填)
- 图片文件名（放在 `public/images/full/` 目录）
- 支持 `.jpg`、`.jpeg`、`.png`、`.webp`、`.gif` 格式
- **命名规则**:
  - **Pixiv 作品**: 使用 Pixiv ID 开头，如 `143518930_p0.jpg`
    - 系统会自动提取 `143518930` 作为 Pixiv 作品 ID
    - 自动生成作品链接：`https://www.pixiv.net/artworks/143518930`
  - **官方图/其他**: 使用字母开头名称，如 `HEVHeRObYAwI-OI.jpg`
    - 系统会识别为非 Pixiv 作品（无 Pixiv ID）

### artistId (可选)
- Pixiv 用户 ID（一串数字）
- 系统会自动拼接成用户链接：`https://www.pixiv.net/users/{artistId}`
- 如果不填：
  - Pixiv 作品：不显示画师信息
  - 官方图：不显示画师信息

### thumbnail (必填)
- 缩略图文件名（放在 `public/images/thumbs/` 目录）
- 命名规则：`原文件名_thumb.webp`
- 由 `npm run thumbs` 自动生成

### tags (数组，必填)
- 必须包含：`"denia"`
- 常用标签：
  - `"fanart"` - 同人图（Pixiv 等）
  - `"official"` - 官方图
  - `"cosplay"` - Cosplay
  - `"merchandise"` - 周边
  - `"background"` - 背景图

### createdAt
- ISO 日期格式：`"2026-04-28"`
- 记录收录日期

---

## 自动识别规则

系统根据文件名自动识别：

| 文件名格式 | 类型 | Pixiv 作品 ID |
|-----------|------|--------------|
| `143518930_p0.jpg` | Pixiv | `143518930` |
| `143518930_p0_master.jpg` | Pixiv | `143518930` |
| `HETiW5pbMAAATau.jpg` | 官方/其他 | - |

**规则**: 文件名以**数字开头** → Pixiv 作品；以**字母开头** → 官方图/其他

---

## 缩略图生成

```bash
# 安装依赖
npm install sharp

# 运行生成
npm run thumbs
```

输出示例：
```
Found 25 images to process

[SKIP] 143518930_p0.jpg (thumbnail exists)
[OK] 143989764_p0.png -> 143989764_p0_thumb.webp

--- Summary ---
Generated: 10
Skipped: 16
Errors: 0
```

---

## 工作流程示例

### 从 Pixiv 添加图片

1. **下载原图**
   - 从 Pixiv 下载图片
   - 重命名为 `143518930_p0.jpg`（包含 Pixiv ID）
   - 保存到 `public/images/full/`

2. **生成缩略图**
   ```bash
   npm run thumbs
   ```

3. **更新 JSON**
   ```json
   {
     "full": "143518930_p0.jpg",
     "thumbnail": "thumbs/143518930_p0_thumb.webp",
     "artistId": "113703823",
     "tags": ["denia", "fanart"],
     "createdAt": "2026-04-28"
   }
   ```

4. **完成** - 系统会自动：
   - 提取 Pixiv 作品 ID: `143518930`
   - 生成作品链接
   - 生成用户链接：`https://www.pixiv.net/users/113703823`
   - 显示 Pixiv 徽章

### 添加官方图片

1. **下载原图**
   - 从 PlayStation Blog 下载
   - 保存为 `psblog-denia-visual1.jpg`
   - 保存到 `public/images/full/`

2. **生成缩略图**
   ```bash
   npm run thumbs
   ```

3. **更新 JSON**
   ```json
   {
     "full": "psblog-denia-visual1.jpg",
     "thumbnail": "thumbs/psblog-denia-visual1_thumb.webp",
     "tags": ["denia", "official"],
     "createdAt": "2026-04-28"
   }
   ```

---

## 批量导入模板

```json
[
  {
    "full": "123456_p0.jpg",
    "thumbnail": "thumbs/123456_p0_thumb.webp",
    "artistId": "113703823",
    "tags": ["denia", "fanart"],
    "createdAt": "2026-04-28"
  },
  {
    "full": "official-visual1.jpg",
    "thumbnail": "thumbs/official-visual1_thumb.webp",
    "tags": ["denia", "official"],
    "createdAt": "2026-04-28"
  }
]
```

---

## 检查清单

添加新图片前请确认：

- [ ] 原图已放入 `public/images/full/`
- [ ] 缩略图已生成到 `public/images/thumbs/`
- [ ] `images.json` 已更新
- [ ] `full` 和 `thumbnail` 文件名匹配
- [ ] Pixiv 作品文件名包含数字 ID
- [ ] tags 包含 "denia"
- [ ] 刷新浏览器后图片正常显示

---

## 常见问题

### Q: 缩略图生成失败？
A: 确保已运行 `npm install sharp` 安装依赖

### Q: 图片不显示？
A: 检查文件名是否正确，路径是否匹配

### Q: 如何重新生成缩略图？
A: 删除 `public/images/thumbs/` 目录下的文件，再运行 `npm run thumbs`

### Q: 如何修改 Pixiv 链接？
A: Pixiv 链接由文件名自动推算，修改文件名中的数字 ID 即可
