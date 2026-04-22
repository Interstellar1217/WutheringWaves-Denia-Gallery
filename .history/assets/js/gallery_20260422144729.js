// Gallery Functionality
class Gallery {
    constructor() {
        this.container = document.getElementById('gallery-container');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.querySelector('.lightbox-image');
        this.lightboxArtist = document.querySelector('.lightbox-info .artist');
        this.lightboxPixivLink = document.querySelector('.lightbox-info .pixiv-link');
        this.closeBtn = document.querySelector('.close');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        
        this.images = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.loadImages();
        this.setupEventListeners();
    }
    
    async loadImages() {
        try {
            this.showLoading();
            
            // 加载图片数据
            const response = await fetch('assets/data/images.json');
            this.images = await response.json();
            
            this.renderGallery();
            this.setupLazyLoading();
        } catch (error) {
            console.error('Failed to load images:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }
    
    renderGallery() {
        this.container.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.index = index;
            
            const img = document.createElement('img');
            img.className = 'lazy';
            img.dataset.src = `assets/images/thumbnails/${image.thumbnail}`;
            img.alt = `Denia artwork by ${image.artist}`;
            
            const itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';
            itemInfo.innerHTML = `
                <div class="artist-name">${image.artist}</div>
                <div class="pixiv-id">Pixiv: ${image.pixivId}</div>
            `;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(itemInfo);
            
            // 点击事件
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            
            this.container.appendChild(galleryItem);
        });
    }
    
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy');
        
        const lazyLoad = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        };
        
        const observer = new IntersectionObserver(lazyLoad, {
            rootMargin: '0px 0px 200px 0px'
        });
        
        lazyImages.forEach(img => {
            observer.observe(img);
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightbox();
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    updateLightbox() {
        const image = this.images[this.currentIndex];
        
        this.lightboxImage.src = `assets/images/full/${image.full}`;
        this.lightboxImage.alt = `Denia artwork by ${image.artist}`;
        
        this.lightboxArtist.textContent = `画师: ${image.artist}`;
        this.lightboxPixivLink.innerHTML = `Pixiv: <a href="https://www.pixiv.net/artworks/${image.pixivId}" target="_blank" rel="noopener noreferrer">https://www.pixiv.net/artworks/${image.pixivId}</a>`;
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightbox();
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightbox();
    }
    
    setupEventListeners() {
        // 关闭按钮
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        
        // 导航按钮
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'block') {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
        
        // 点击空白处关闭
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
    }
    
    showLoading() {
        this.container.innerHTML = '<div class="loading">加载图片中...</div>';
    }
    
    hideLoading() {
        const loading = this.container.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }
    
    showError() {
        this.container.innerHTML = '<div class="loading" style="color: #ff4444;">加载失败，请刷新页面重试</div>';
    }
}

// 导出Gallery类
window.Gallery = Gallery;