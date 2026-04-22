// Music Player Control
class MusicPlayer {
    constructor() {
        this.playerContainer = document.getElementById('music-player');
        this.playButton = document.getElementById('play-music-btn');
        this.isPlaying = false;
        this.playerIframe = null;
        
        this.init();
    }
    
    init() {
        this.playButton.addEventListener('click', () => this.toggleMusic());
        
        // 监听页面交互事件，允许播放音乐
        document.addEventListener('click', () => this.enableMusic(), { once: true });
        document.addEventListener('touchstart', () => this.enableMusic(), { once: true });
        document.addEventListener('keydown', () => this.enableMusic(), { once: true });
    }
    
    enableMusic() {
        // 用户交互后，移除提示
        this.playButton.textContent = '🎵 播放背景音乐';
    }
    
    toggleMusic() {
        if (!this.isPlaying) {
            this.playMusic();
        } else {
            this.pauseMusic();
        }
    }
    
    playMusic() {
        if (!this.playerIframe) {
            // 创建音乐播放器iframe
            // 这里使用网易云音乐的示例，实际使用时需要替换为自己的外链
            const musicUrl = 'https://music.163.com/outchain/player?type=0&id=7572554588&auto=1&height=66';
            
            this.playerIframe = document.createElement('iframe');
            this.playerIframe.src = musicUrl;
            this.playerIframe.width = '100%';
            this.playerIframe.height = '86';
            this.playerIframe.frameBorder = 'no';
            this.playerIframe.allow = 'autoplay';
            this.playerIframe.allowTransparency = 'true';
            
            this.playerContainer.appendChild(this.playerIframe);
        }
        
        this.isPlaying = true;
        this.playButton.textContent = '⏸️ 暂停背景音乐';
        this.playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    pauseMusic() {
        if (this.playerIframe) {
            // 移除iframe来暂停音乐
            this.playerContainer.removeChild(this.playerIframe);
            this.playerIframe = null;
        }
        
        this.isPlaying = false;
        this.playButton.textContent = '🎵 播放背景音乐';
        this.playButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }
}

// 导出MusicPlayer类
window.MusicPlayer = MusicPlayer;