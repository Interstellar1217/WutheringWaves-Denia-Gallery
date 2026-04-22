# Denia Photo Wall

《鸣潮》达尼娅（Denia）高清图片展 - 一个基于纯前端技术的照片墙项目。

## 🎨 项目介绍

这是一个为《鸣潮》角色达尼娅（Denia）创建的高清图片展示网站，收集了Pixiv上收藏数超过1000的优质二次创作作品。

## 🚀 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub Pages (部署平台)

## 📁 项目结构

```
denia-photo-wall/
├── index.html                # 主页面入口
├── README.md                 # 项目说明
├── .gitignore                # Git忽略文件
│
├── assets/                   # 静态资源目录
│   ├── css/
│   │   ├── style.css         # 全局样式
│   │   └── gallery.css       # 照片墙专属样式
│   ├── js/
│   │   ├── main.js           # 主逻辑
│   │   ├── gallery.js        # 图片加载与瀑布流逻辑
│   │   └── music.js          # 音乐播放器控制
│   ├── images/               # 图片存储
│   │   ├── thumbnails/       # 缩略图
│   │   └── full/             # 原图
│   └── data/
│       └── images.json       # 图片元数据
│
└── CNAME                     # 自定义域名配置（可选）
```

## 📖 使用说明

1. 点击页面顶部的「播放背景音乐」按钮开始播放音乐
2. 浏览图片墙，点击任意图片查看高清大图
3. 使用左右箭头键在大图模式下切换图片
4. 点击关闭按钮或按ESC键退出大图模式

## 🎵 背景音乐

项目集成了QQ音乐/网易云音乐播放器，用户需要手动点击播放以符合现代浏览器的自动播放策略。

## 📷 图片来源

所有图片均来自Pixiv，已筛选收藏数超过1000的优质作品。

### 版权声明

- 所有图片版权归原画师所有
- 本项目仅用于学习交流，不用于商业用途
- 如有侵权，请联系删除

### 画师致谢

图片信息（包括画师ID和Pixiv链接）存储在`assets/data/images.json`文件中。

## 🚀 部署

1. Fork本仓库
2. 在GitHub仓库设置中开启GitHub Pages
3. 选择`main`分支作为源
4. 访问分配的GitHub Pages URL

## 🔧 本地开发

直接在浏览器中打开`index.html`文件即可本地预览。

## 📝 开发计划

- [x] 基础页面结构搭建
- [x] 音乐播放器集成
- [ ] 图片墙瀑布流布局
- [ ] 图片懒加载优化
- [ ] 大图查看功能
- [ ] 移动端适配
- [ ] GitHub Pages部署

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 📄 License

MIT License

## 🌟 鸣谢

感谢所有为达尼娅创作优秀作品的Pixiv画师们！