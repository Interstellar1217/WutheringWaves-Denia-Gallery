import React, { useEffect, useMemo, useRef, useState } from 'react';

const DRAG_POSITIONS_KEY = 'denia-drag-positions';

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function fallbackSvg(name) {
  const label = name || 'Denia';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#0f6b74"/><stop offset="100%" stop-color="#b85a16"/></linearGradient></defs><rect fill="url(#g)" width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="34" font-family="Segoe UI">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      padding: '4rem 2rem',
      minHeight: '300px'
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '3px solid rgba(183, 138, 75, 0.2)',
          borderRadius: '50%',
          borderTopColor: 'var(--gold)',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          inset: '10px',
          border: '3px solid rgba(78, 127, 128, 0.2)',
          borderRadius: '50%',
          borderTopColor: 'var(--teal)',
          animation: 'spin 1.5s linear infinite reverse'
        }} />
      </div>
      <p style={{
        marginTop: '1.5rem',
        color: 'var(--paper-soft)',
        fontSize: '0.9rem',
        letterSpacing: '0.1em'
      }}>LOADING GALLERY...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function extractPixivId(filename) {
  const match = filename.match(/^(\d+)_/);
  return match ? match[1] : null;
}

function buildPixivUrl(pixivId) {
  return pixivId ? `https://www.pixiv.net/artworks/${pixivId}` : '';
}

function buildPixivUserUrl(artistId) {
  return artistId ? `https://www.pixiv.net/users/${artistId}` : '';
}

function getItemKey(item) {
  return `${item.full}::${item.pixivId}`;
}

function ZoomableImage({ src, alt, onError }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPinchRef = useRef({ distance: 0, scale: 1 });
  const startDragRef = useRef({ x: 0, y: 0 });

  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handlePointerDown(e) {
    if (e.pointerType === 'touch' && e.buttons === 0) return;
    setIsDragging(true);
    startDragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startDragRef.current.x, y: e.clientY - startDragRef.current.y });
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      startPinchRef.current = { distance, scale };
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      const nextScale = Math.min(Math.max((distance / startPinchRef.current.distance) * startPinchRef.current.scale, 1), 5);
      setScale(nextScale);
    }
  }

  function handleTouchEnd() {
    if (scale < 1.1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }

  return (
    <div
      className="zoomable-image-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)` }}
    >
      <img src={src} alt={alt} onError={onError} draggable={false} />
      {scale > 1 && (
        <button className="zoom-reset" onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }}>
          Reset Zoom
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortMode, setSortMode] = useState('default');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dragOffsets, setDragOffsets] = useState({});
  const [lang, setLang] = useState(() => localStorage.getItem('denia-lang') || 'en');
  const dragRef = useRef(null);
  const recentDragRef = useRef({ key: '', time: 0 });
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    localStorage.setItem('denia-lang', lang);
  }, [lang]);

  const t = {
    eyebrow: 'Wuthering Waves Fan Site',
    title: 'DENIA GALLERY',
    disclaimer: lang === 'zh' ? '本网站为非盈利性质的个人爱好项目。' : 'This is a non-profit personal fan project.',
    copyright: lang === 'zh'
      ? '所有作品版权归原作者所有。如需版权协商或下架请求，请联系：'
      : 'All artworks © their respective creators. For copyright inquiries or takedown requests, contact:',
    search: lang === 'zh' ? '搜索 Pixiv ID、标签' : 'Search by Pixiv ID, tag',
    sortDefault: lang === 'zh' ? '默认排序' : 'Default',
    sortDate: lang === 'zh' ? '按日期排序' : 'Sort by Date',
    sortPixiv: lang === 'zh' ? '按 PixivID 排序' : 'Sort by Pixiv ID',
    allTags: lang === 'zh' ? '全部标签' : 'All Tags',
    summary: (count, total) => lang === 'zh' ? `${count} / ${total} 张图片` : `${count} / ${total} images`,
    noMatch: lang === 'zh' ? '没有匹配结果，请尝试其他筛选条件。' : 'No matches. Try other filters.',
    downloading: lang === 'zh' ? '下载' : 'Download',
    source: lang === 'zh' ? '来源' : 'Source',
    artist: 'Artist',
    artwork: lang === 'zh' ? 'Pixiv' : 'Pixiv',
    file: lang === 'zh' ? '文件' : 'File',
    langSwitch: lang === 'zh' ? 'English' : '中文',
  };

  useEffect(() => {
    const saved = localStorage.getItem(DRAG_POSITIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setDragOffsets(parsed);
      } catch { setDragOffsets({}); }
    }
  }, []);

  useEffect(() => {
    const clean = {};
    Object.entries(dragOffsets).forEach(([key, pos]) => {
      if (pos.x !== 0 || pos.y !== 0) clean[key] = pos;
    });
    localStorage.setItem(DRAG_POSITIONS_KEY, JSON.stringify(clean));
  }, [dragOffsets]);

  useEffect(() => {
    let alive = true;
    async function loadData() {
      try {
        const res = await fetch('./data/images.json');
        const data = await res.json();
        if (!alive) return;
        const normalized = safeArray(data).map((item, index) => {
          const pixivId = extractPixivId(item.full);
          const artistId = item.artistId || '';
          const artistUrl = artistId ? buildPixivUserUrl(artistId) : '';
          return {
            id: index,
            full: item.full,
            thumbnail: item.thumbnail,
            artistId,
            artistUrl,
            pixivId: pixivId || '',
            address: item.address || buildPixivUrl(pixivId),
            tags: safeArray(item.tags),
            createdAt: item.createdAt || '1970-01-01',
            sourceOrder: index,
          };
        });
        setImages(normalized);
      } catch { setImages([]); }
      finally { if (alive) setLoading(false); }
    }
    loadData();
    return () => { alive = false; };
  }, []);

  const tags = useMemo(() => ['all', ...new Set(images.flatMap((item) => item.tags))], [images]);

  const displayImages = useMemo(() => {
    let output = images.filter((item) => {
      const search = searchTerm.trim().toLowerCase();
      const tagsText = item.tags.join(' ').toLowerCase();
      const matchSearch = search.length === 0 || item.artistId.toLowerCase().includes(search) || item.pixivId.includes(search) || tagsText.includes(search);
      const matchTag = tagFilter === 'all' || item.tags.includes(tagFilter);
      return matchSearch && matchTag;
    });

    const direction = sortOrder === 'desc' ? -1 : 1;
    switch (sortMode) {
      case 'date': output = output.sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)) * direction); break;
      case 'pixiv': output = output.sort((a, b) => (parseInt(b.pixivId || '0') - parseInt(a.pixivId || '0')) * direction); break;
      default:
        output = output.sort((a, b) => {
          const aIsOfficial = a.tags.includes('official');
          const bIsOfficial = b.tags.includes('official');
          if (aIsOfficial && !bIsOfficial) return -1;
          if (!aIsOfficial && bIsOfficial) return 1;
          return a.sourceOrder - b.sourceOrder;
        });
    }
    return output;
  }, [images, searchTerm, tagFilter, sortMode, sortOrder]);

  useEffect(() => {
    function onKeyDown(event) {
      if (lightboxIndex < 0 || displayImages.length === 0) return;
      if (event.key === 'Escape') setLightboxIndex(-1);
      if (event.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % displayImages.length);
      if (event.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, displayImages.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex >= 0 ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex >= displayImages.length) setLightboxIndex(displayImages.length ? 0 : -1);
  }, [displayImages, lightboxIndex]);

  const currentLightboxImage = lightboxIndex >= 0 ? displayImages[lightboxIndex] : null;

  function onCardPointerDown(event, itemKey) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const current = dragOffsets[itemKey] || { x: 0, y: 0 };
    dragRef.current = { key: itemKey, startX: event.clientX, startY: event.clientY, originX: current.x, originY: current.y, moved: false, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.closest('.gallery-card')?.classList.add('dragging');
  }

  function onCardPointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    setDragOffsets((prev) => ({ ...prev, [drag.key]: { x: Math.round(drag.originX + dx), y: Math.round(drag.originY + dy) } }));
  }

  function onCardPointerUp(event) {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.moved) recentDragRef.current = { key: drag.key, time: Date.now() };
    try { event.currentTarget.releasePointerCapture(drag.pointerId); } catch {}
    dragRef.current = null;
    event.currentTarget.closest('.gallery-card')?.classList.remove('dragging');
  }

  function openLightbox(itemKey) {
    const recent = recentDragRef.current;
    if (recent.key === itemKey && Date.now() - recent.time < 250) return;
    const index = displayImages.findIndex((item) => getItemKey(item) === itemKey);
    if (index >= 0) setLightboxIndex(index);
  }

  function handleDownload(filename) {
    const link = document.createElement('a');
    link.href = `./images/full/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function resetCardPosition(key) {
    setDragOffsets((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <button className="lang-switch-btn" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
          {t.langSwitch}
        </button>
        <div className="hero-top">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="subtitle">
              <span style={{ color: 'var(--teal-soft)', fontSize: '0.85rem' }}>{t.disclaimer}</span>
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t.copyright}{" "}
              <a href="https://github.com/Interstellar1217" target="_blank" rel="noreferrer" style={{ color: 'var(--teal-soft)' }}>github.com/Interstellar1217</a>
            </p>
          </div>
        </div>
      </header>

      <section className="page-block">
        <section className="toolbar">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t.search} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} style={{ cursor: 'pointer', border: '1px solid rgba(125, 166, 167, 0.35)', background: 'rgba(16, 24, 25, 0.8)', color: 'var(--paper)', borderRadius: '10px', padding: '0.62rem 0.75rem', fontSize: '0.95rem', flex: 1 }}>
              <option value="default">{t.sortDefault}</option>
              <option value="date">{t.sortDate}</option>
              <option value="pixiv">{t.sortPixiv}</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} style={{ cursor: 'pointer', border: '1px solid rgba(125, 166, 167, 0.35)', background: 'rgba(16, 24, 25, 0.8)', color: 'var(--paper)', borderRadius: '10px', padding: '0.62rem 0.75rem', fontSize: '0.95rem', minWidth: '80px' }}>
              {sortOrder === 'desc' ? '降序' : '升序'}
            </button>
          </div>
        </section>

        <section className="chip-row">
          {tags.map((tag) => (
            <button key={tag} className={`chip ${tagFilter === tag ? 'active' : ''}`} onClick={() => setTagFilter(tag)}>
              {tag === 'all' ? t.allTags : `#${tag}`}
            </button>
          ))}
        </section>

        <p className="summary">{t.summary(displayImages.length, images.length)}</p>

        {loading ? <LoadingSpinner /> : null}
        {!loading && displayImages.length === 0 ? <div className="status-box">{t.noMatch}</div> : null}

        <section className="gallery">
          {displayImages.map((item, idx) => {
            const key = getItemKey(item);
            const offset = dragOffsets[key] || { x: 0, y: 0 };
            return (
              <div
                className="gallery-card"
                key={key}
              >
                <div
                  className="card"
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
                  onPointerDown={(e) => onCardPointerDown(e, key)}
                  onPointerMove={onCardPointerMove}
                  onPointerUp={onCardPointerUp}
                  onPointerCancel={onCardPointerUp}
                  onClick={() => openLightbox(key)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={item.thumbnail ? `./images/${item.thumbnail}` : `./images/full/${item.full}`} alt={item.artistId || 'Denia'} loading="lazy" onError={(e) => { if (!e.currentTarget.dataset.fallbackAttempted) { e.currentTarget.dataset.fallbackAttempted = 'true'; e.currentTarget.src = `./images/full/${item.full}`; } else { e.currentTarget.src = fallbackSvg('Denia'); } }} />
                  <div className="card-info">
                    {item.artistId && (
                      <p className="artist">
                        <a href={item.artistUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--teal-soft)', textDecoration: 'none' }}>{item.artistId}</a>
                      </p>
                    )}
                    {item.pixivId && (
                      <p className="pixiv-id">
                        <span className="pixiv-badge">Pixiv</span>
                        <span className="pixiv-number">{item.pixivId}</span>
                      </p>
                    )}
                    <p className="tag-line">{item.tags.slice(0, 3).map((tag) => `#${tag}`).join(' ')}</p>
                  </div>
                </div>
                {offset.x !== 0 || offset.y !== 0 ? (
                  <button onClick={(e) => { e.stopPropagation(); resetCardPosition(key); }} style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '4px', padding: '0.2rem 0.4rem', fontSize: '0.7rem', cursor: 'pointer', zIndex: 5 }}>
                    {lang === 'zh' ? '重置' : 'Reset'}
                  </button>
                ) : null}
              </div>
            );
          })}
        </section>
      </section>

      <div className={`lightbox ${lightboxIndex >= 0 ? 'open' : ''}`} onClick={() => setLightboxIndex(-1)}>
        {currentLightboxImage ? (
          <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setLightboxIndex(-1)}>✕</button>
            <button className="nav prev" onClick={() => setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}>‹</button>
            <ZoomableImage src={`./images/full/${currentLightboxImage.full}`} alt={currentLightboxImage.artistId || 'Denia'} onError={(e) => { e.currentTarget.src = fallbackSvg(currentLightboxImage.artistId || 'Denia'); }} />
            <button className="nav next" onClick={() => setLightboxIndex((prev) => (prev + 1) % displayImages.length)}>›</button>
            <div className="lightbox-info">
              {currentLightboxImage.artistId ? (
                <p><strong>{t.artist}:</strong> <a href={currentLightboxImage.artistUrl} target="_blank" rel="noreferrer">{currentLightboxImage.artistId}</a></p>
              ) : (
                <p><strong>{t.artist}:</strong> -</p>
              )}
              {currentLightboxImage.pixivId && (
                <p><strong>{t.artwork}:</strong> <a href={`https://www.pixiv.net/artworks/${currentLightboxImage.pixivId}`} target="_blank" rel="noreferrer">{currentLightboxImage.pixivId}</a></p>
              )}
              <p><strong>{t.file}:</strong> {currentLightboxImage.full}</p>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button className="download-btn" onClick={() => handleDownload(currentLightboxImage.full)}>⬇ {t.downloading}</button>
                {currentLightboxImage.address && (
                  <a href={currentLightboxImage.address} target="_blank" rel="noreferrer" className="source-btn">🔗 {t.source}</a>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
