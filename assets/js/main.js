// Main Application Entry Point

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化音乐播放器
    const musicPlayer = new MusicPlayer();
    
    // 初始化照片墙
    const gallery = new Gallery();
    
    // 暴露到全局，方便调试
    window.app = {
        musicPlayer,
        gallery
    };
    
    console.log('Denia Photo Wall initialized successfully!');
});

// 添加页面加载动画
window.addEventListener('load', () => {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        body.style.opacity = '1';
    }, 100);
});