import React, { useEffect, useRef, useState } from 'react';

const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const slides = ['Profile2.jpg', 'Profile3.jpg', 'Profile4.jpg'];

const text = {
  zh: {
    viewProfile: '查看档案',
    title: '达妮娅 Profile',
    source: '信息来源',
    bilibili: 'Bilibili',
    kurobbs: '库街区',
    prevHint: '上一张',
    nextHint: '下一张',
  },
  en: {
    viewProfile: 'View Profile',
    title: 'Denia Profile',
    source: 'Sources',
    bilibili: 'Bilibili',
    kurobbs: 'Kurobbs',
    prevHint: 'Previous',
    nextHint: 'Next',
  },
};

export default function Profile() {
  const [index, setIndex] = useState(0);
  const [showFinalHero, setShowFinalHero] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('denia-lang') || 'zh');
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef(null);
  const scrolledRef = useRef(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  function nextSlide() {
    setIndex((prev) => (prev + 1) % slides.length);
  }

  function prevSlide() {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function scrollToGalleryOnce() {
    if (scrolledRef.current) return;
    scrolledRef.current = true;
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function onStageTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onStageTouchMove(event) {
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
  }

  function onStageTouchEnd() {
    const threshold = 50;
    if (touchDeltaX.current <= -threshold) nextSlide();
    if (touchDeltaX.current >= threshold) prevSlide();
  }

  useEffect(() => {
    localStorage.setItem('denia-lang', lang);
  }, [lang]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const apply = () => setIsMobile(media.matches);
    apply();

    const onChange = () => apply();
    if (media.addEventListener) {
      media.addEventListener('change', onChange);
    } else {
      media.addListener(onChange);
    }

    const autoScrollTimer = setTimeout(() => {
      scrollToGalleryOnce();
    }, 10000);

    let fadeTimer;
    if (!media.matches) {
      fadeTimer = setTimeout(() => {
        setShowFinalHero(true);
      }, 5000);
    } else {
      setShowFinalHero(true);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', onChange);
      } else {
        media.removeListener(onChange);
      }
      if (fadeTimer) clearTimeout(fadeTimer);
      clearTimeout(autoScrollTimer);
    };
  }, []);

  const i18n = text[lang] || text.zh;
  return (
    <div className="profile-page profile-v5">
      <button className="lang-switch-btn profile-lang" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
        {lang === 'zh' ? 'English' : '中文'}
      </button>

      <section
        className="profile-hero-full"
        onClick={scrollToGalleryOnce}
        onTouchStart={scrollToGalleryOnce}
        onWheel={scrollToGalleryOnce}
      >
        {!isMobile && (
          <>
            <img
              src={`${BASE_PATH}/data/OriginProfile1.jpg`}
              alt="Denia Profile Opening"
              loading="eager"
              className={`hero-layer hero-origin ${showFinalHero ? 'fade-out' : ''}`}
            />
            <img
              src={`${BASE_PATH}/data/Profile1.jpg`}
              alt="Denia Profile Hero"
              loading="eager"
              className={`hero-layer hero-final ${showFinalHero ? 'fade-in' : ''}`}
            />
          </>
        )}

        {isMobile && (
          <img
            src={`${BASE_PATH}/data/Profile9.jpg`}
            alt="Denia Profile Hero Mobile"
            loading="eager"
            className="hero-layer hero-mobile"
          />
        )}

        <button className="hero-enter-btn" onClick={scrollToGalleryOnce}>{i18n.viewProfile}</button>
      </section>

      <section className="profile-showcase" ref={galleryRef}>
        <h2 className="profile-carousel-title">{i18n.title}</h2>

        <div className="profile-rotary" role="region" aria-label="Denia Profile Carousel">
          <button className="carousel-btn left" onClick={prevSlide} aria-label="Previous Slide">‹</button>

          <div className="side-hint side-hint-left" onClick={prevSlide}>
            <span>{i18n.prevHint}</span>
          </div>

          <div className="profile-slide-stage">
            <img
              key={slides[index]}
              src={`${BASE_PATH}/data/${slides[index]}`}
              alt={`Denia ${slides[index]}`}
              className="profile-stage-image"
              loading="lazy"
              onTouchStart={onStageTouchStart}
              onTouchMove={onStageTouchMove}
              onTouchEnd={onStageTouchEnd}
            />
          </div>

          <div className="side-hint side-hint-right" onClick={nextSlide}>
            <span>{i18n.nextHint}</span>
          </div>

          <button className="carousel-btn right" onClick={nextSlide} aria-label="Next Slide">›</button>
        </div>

        <div className="carousel-dots" aria-hidden="true">
          {slides.map((name, i) => (
            <button
              key={name}
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <section className="profile-sources profile-sources-inline">
          <h3>{i18n.source}</h3>
          <div className="source-links-row">
            <a href="https://www.bilibili.com/opus/1202857169563680835" target="_blank" rel="noreferrer">{i18n.bilibili}</a>
            <span className="source-sep">|</span>
            <a href="https://www.kurobbs.com/mc/post/1504923530928095232" target="_blank" rel="noreferrer">{i18n.kurobbs}</a>
          </div>
        </section>
      </section>
    </div>
  );
}
