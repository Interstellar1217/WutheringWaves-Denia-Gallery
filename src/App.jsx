import React, { useEffect, useMemo, useRef, useState } from 'react';

const DRAG_POSITIONS_KEY = 'denia-drag-positions';

const PAGE_ORDER = ['home', 'profile', 'story', 'gallery', 'official-art', 'sources'];

const OFFICIAL_INFO = {
  name: 'Denia',
  cnName: 'Da Ni Ya',
  rarity: '5-Star Resonator',
  element: 'Fusion',
  weapon: 'Rectifier',
  version: '3.3 Reverbs From the End of Galaxies',
  launchDate: '2026-04-30',
  storyDate: '2026-05-21',
  intro:
    'In official 3.3 material, Denia is shown as gentle in public while hiding a more unpredictable side.'
};

const PROFILE_ARCHIVE = {
  codename: 'Unknown',
  organization: 'Unknown',
  region: 'Unknown',
  birthday: 'Unknown',
  cv: 'Unknown',
  combatStyle: 'Unknown',
  frequency: 'Unknown',
  profileText:
    'Public profile for 3.3 is still limited. Detailed biography and combat archive fields will be filled after official in-game release.'
};

const OFFICIAL_ARTWORKS = [
  {
    id: 'denia-official-1',
    title: 'Version 3.3 Character Visual (PlayStation Blog image 68)',
    imageUrl: 'https://live.staticflickr.com/65535/55199634126_4946af5407_h.jpg',
    sourceUrl:
      'https://blog.playstation.com/2026/04/17/wuthering-waves-version-3-3-reverbs-from-the-end-of-galaxies-update-arrives-april-30/'
  },
  {
    id: 'denia-official-2',
    title: 'Version 3.3 Story Visual (PlayStation Blog image 66)',
    imageUrl: 'https://live.staticflickr.com/65535/55200039335_0eab3d67b3_h.jpg',
    sourceUrl:
      'https://blog.playstation.com/2026/04/17/wuthering-waves-version-3-3-reverbs-from-the-end-of-galaxies-update-arrives-april-30/'
  },
  {
    id: 'denia-official-3',
    title: 'Version 3.3 Promotion Visual',
    imageUrl: 'https://live.staticflickr.com/65535/55199882529_fca43ab474_h.jpg',
    sourceUrl:
      'https://blog.playstation.com/2026/04/17/wuthering-waves-version-3-3-reverbs-from-the-end-of-galaxies-update-arrives-april-30/'
  }
];

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function fallbackSvg(name) {
  const label = name || 'Denia';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#0f6b74"/><stop offset="100%" stop-color="#b85a16"/></linearGradient></defs><rect fill="url(#g)" width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="34" font-family="Segoe UI">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getItemKey(item) {
  return `${item.full || 'no-full'}::${item.pixivId || 'no-id'}::${item.artist || 'unknown'}`;
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
        <button
          className="zoom-reset"
          onClick={(e) => {
            e.stopPropagation();
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          Reset Zoom
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const [searchTerm, setSearchTerm] = useState('');
  const [artistFilter, setArtistFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortMode, setSortMode] = useState('default');

  const [dragOffsets, setDragOffsets] = useState({});
  const dragRef = useRef(null);
  const recentDragRef = useRef({ key: '', time: 0 });

  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [musicOn, setMusicOn] = useState(false);

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.replace('#', '');
      if (PAGE_ORDER.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    }

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  function goToPage(page) {
    window.location.hash = page;
  }

  useEffect(() => {
    const saved = localStorage.getItem(DRAG_POSITIONS_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') setDragOffsets(parsed);
    } catch {
      setDragOffsets({});
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
        const normalized = safeArray(data).map((item, index) => ({
          id: index,
          full: item.full,
          artist: item.artist || 'Unknown Artist',
          pixivId: String(item.pixivId || ''),
          tags: safeArray(item.tags),
          createdAt: item.createdAt || '1970-01-01',
          sourceOrder: index
        }));
        setImages(normalized);
      } catch {
        setImages([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadData();
    return () => {
      alive = false;
    };
  }, []);

  const artists = useMemo(() => ['all', ...new Set(images.map((item) => item.artist))], [images]);
  const tags = useMemo(() => ['all', ...new Set(images.flatMap((item) => item.tags))], [images]);

  const displayImages = useMemo(() => {
    let output = images.filter((item) => {
      const search = searchTerm.trim().toLowerCase();
      const tagsText = item.tags.join(' ').toLowerCase();

      const matchSearch =
        search.length === 0 ||
        item.artist.toLowerCase().includes(search) ||
        item.pixivId.includes(search) ||
        tagsText.includes(search);

      const matchArtist = artistFilter === 'all' || item.artist === artistFilter;
      const matchTag = tagFilter === 'all' || item.tags.includes(tagFilter);

      return matchSearch && matchArtist && matchTag;
    });

    switch (sortMode) {
      case 'artist-asc':
        output = output.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'pixiv-desc':
        output = output.sort((a, b) => Number(b.pixivId) - Number(a.pixivId));
        break;
      case 'date-desc':
        output = output.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        output = output.sort((a, b) => a.sourceOrder - b.sourceOrder);
    }

    return output;
  }, [images, searchTerm, artistFilter, tagFilter, sortMode]);

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
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex >= displayImages.length) setLightboxIndex(displayImages.length ? 0 : -1);
  }, [displayImages, lightboxIndex]);

  const currentLightboxImage = lightboxIndex >= 0 ? displayImages[lightboxIndex] : null;

  function onCardPointerDown(event, itemKey) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    const current = dragOffsets[itemKey] || { x: 0, y: 0 };
    dragRef.current = {
      key: itemKey,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      moved: false,
      pointerId: event.pointerId
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onCardPointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;

    setDragOffsets((prev) => ({
      ...prev,
      [drag.key]: { x: Math.round(drag.originX + dx), y: Math.round(drag.originY + dy) }
    }));
  }

  function onCardPointerUp(event) {
    const drag = dragRef.current;
    if (!drag) return;

    if (drag.moved) recentDragRef.current = { key: drag.key, time: Date.now() };

    try {
      event.currentTarget.releasePointerCapture(drag.pointerId);
    } catch {
      // no-op
    }

    dragRef.current = null;
  }

  function openLightbox(itemKey) {
    const recent = recentDragRef.current;
    if (recent.key === itemKey && Date.now() - recent.time < 250) return;

    const index = displayImages.findIndex((item) => getItemKey(item) === itemKey);
    if (index >= 0) setLightboxIndex(index);
  }

  function renderHome() {
    return (
      <section className="page-block">
        <h2>Welcome</h2>
        <p>
          This site is a Denia-focused personal fan archive. It combines official 3.3 references and your own collection from Pixiv / Kurobbs / Xiaohongshu and other sources.
        </p>
        <div className="info-grid">
          <article>
            <h3>Character Snapshot</h3>
            <p>{OFFICIAL_INFO.cnName} ({OFFICIAL_INFO.name}) is listed as a {OFFICIAL_INFO.rarity}.</p>
            <p>Element: {OFFICIAL_INFO.element} | Weapon: {OFFICIAL_INFO.weapon}</p>
          </article>
          <article>
            <h3>Version Milestones</h3>
            <p>Version 3.3 launch: {OFFICIAL_INFO.launchDate}</p>
            <p>Main Quest III Segue update: {OFFICIAL_INFO.storyDate}</p>
          </article>
          <article>
            <h3>Site Purpose</h3>
            <p>Not just a wall. This is a character-focused website with story, profile, official media, and collectible gallery.</p>
          </article>
        </div>

        <div className="home-media-grid">
          <article className="home-media-card">
            <h3>Version 3.3 Video</h3>
            <iframe
              title="Wuthering Waves Version 3.3"
              src="https://www.youtube.com/embed/SKLSDZGQHLQ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </article>
          <article className="home-media-card">
            <h3>Quick Entry</h3>
            <ul>
              <li>Go to <strong>Profile</strong> for archive-style character sheet.</li>
              <li>Use <strong>Gallery</strong> as your multi-source image vault.</li>
              <li>Use <strong>Official Art</strong> to maintain clean official references.</li>
              <li>Use <strong>Sources</strong> for all external links and maintenance.</li>
            </ul>
          </article>
        </div>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="page-block">
        <h2>Character Archive</h2>
        <p>{PROFILE_ARCHIVE.profileText}</p>

        <div className="profile-layout">
          <article className="profile-main-card">
            <img
              src={OFFICIAL_ARTWORKS[0].imageUrl}
              alt="Denia official portrait"
              onError={(e) => {
                e.currentTarget.src = fallbackSvg('Denia');
              }}
            />
            <div>
              <h3>{OFFICIAL_INFO.cnName} / {OFFICIAL_INFO.name}</h3>
              <p>{OFFICIAL_INFO.intro}</p>
            </div>
          </article>

          <article className="profile-sub-card">
            <table className="profile-table">
              <tbody>
                <tr><th>Rarity</th><td>{OFFICIAL_INFO.rarity}</td></tr>
                <tr><th>Element</th><td>{OFFICIAL_INFO.element}</td></tr>
                <tr><th>Weapon</th><td>{OFFICIAL_INFO.weapon}</td></tr>
                <tr><th>Codename</th><td>{PROFILE_ARCHIVE.codename}</td></tr>
                <tr><th>Organization</th><td>{PROFILE_ARCHIVE.organization}</td></tr>
                <tr><th>Region</th><td>{PROFILE_ARCHIVE.region}</td></tr>
                <tr><th>Birthday</th><td>{PROFILE_ARCHIVE.birthday}</td></tr>
                <tr><th>Combat Style</th><td>{PROFILE_ARCHIVE.combatStyle}</td></tr>
                <tr><th>Frequency Spectrum</th><td>{PROFILE_ARCHIVE.frequency}</td></tr>
                <tr><th>Voice Actor</th><td>{PROFILE_ARCHIVE.cv}</td></tr>
              </tbody>
            </table>
          </article>
        </div>
      </section>
    );
  }

  function renderStory() {
    return (
      <section className="page-block">
        <h2>Story Timeline (3.3)</h2>
        <ol className="timeline">
          <li>
            <strong>2026-04-30:</strong> Version 3.3 launch with new 5-star resonators including Denia.
          </li>
          <li>
            <strong>2026-05-21:</strong> Main Quest Chapter III Segue Beneath a Melting Night Sky opens, expanding Denia's role.
          </li>
          <li>
            <strong>Character tone:</strong> Official description highlights a soft public persona and a hidden, unpredictable side.
          </li>
        </ol>
      </section>
    );
  }

  function renderGallery() {
    return (
      <section className="page-block">
        <h2>Collection Gallery</h2>

        <section className="toolbar">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by artist, Pixiv ID, tag" />

          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="default">Default</option>
            <option value="artist-asc">Artist A-Z</option>
            <option value="pixiv-desc">Pixiv ID Desc</option>
            <option value="date-desc">Latest Date</option>
          </select>
        </section>

        <section className="chip-row">
          {artists.map((artist) => (
            <button key={artist} className={`chip ${artistFilter === artist ? 'active' : ''}`} onClick={() => setArtistFilter(artist)}>
              {artist === 'all' ? 'All Artists' : artist}
            </button>
          ))}
        </section>

        <section className="chip-row">
          {tags.map((tag) => (
            <button key={tag} className={`chip ${tagFilter === tag ? 'active' : ''}`} onClick={() => setTagFilter(tag)}>
              {tag === 'all' ? 'All Tags' : `#${tag}`}
            </button>
          ))}
        </section>

        <p className="summary">{displayImages.length} / {images.length} saved images</p>

        {loading ? <div className="status-box">Loading...</div> : null}
        {!loading && displayImages.length === 0 ? <div className="status-box">No matches. Try other filters.</div> : null}

        <section className="gallery" aria-label="Draggable floating gallery">
          {displayImages.map((item, idx) => {
            const key = getItemKey(item);
            const offset = dragOffsets[key] || { x: 0, y: 0 };
            const floatDuration = 8 + (idx % 5);
            const floatDelay = -(idx % 7);

            return (
              <div className="float-shell" key={key} style={{ animationDuration: `${floatDuration}s`, animationDelay: `${floatDelay}s` }}>
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
                  <img
                    src={`./images/full/${item.full}`}
                    alt={item.artist}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackSvg(item.artist);
                    }}
                  />
                  <div className="card-info">
                    <p className="artist">{item.artist}</p>
                    <p className="pixiv">Pixiv: {item.pixivId}</p>
                    <p className="tag-line">{item.tags.slice(0, 3).map((tag) => `#${tag}`).join(' ')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </section>
    );
  }

  function renderOfficialArt() {
    return (
      <section className="page-block">
        <h2>Official Artwork Board</h2>
        <p>These visuals are linked from official Version 3.3 news materials.</p>
        <div className="official-grid">
          {OFFICIAL_ARTWORKS.map((art) => (
            <article key={art.id} className="official-card">
              <img src={art.imageUrl} alt={art.title} onError={(e) => { e.currentTarget.src = fallbackSvg('Official Art'); }} />
              <h3>{art.title}</h3>
              <a href={art.sourceUrl} target="_blank" rel="noreferrer">Open source article</a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderSources() {
    return (
      <section className="page-block">
        <h2>Sources</h2>
        <ul className="sources-list">
          <li>
            <a href="https://blog.playstation.com/2026/04/17/wuthering-waves-version-3-3-reverbs-from-the-end-of-galaxies-update-arrives-april-30/" target="_blank" rel="noreferrer">
              PlayStation Blog - Wuthering Waves Version 3.3 update details (official publish partner, by Kuro Games global publishing lead)
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=SKLSDZGQHLQ" target="_blank" rel="noreferrer">
              Official 3.3 video link embedded in the PlayStation Blog article
            </a>
          </li>
          <li>
            <a href="https://wiki.kurobbs.com/mc/item/1478089902761410560" target="_blank" rel="noreferrer">
              Kurobbs Wiki character archive page (layout reference for Profile page)
            </a>
          </li>
          <li>
            Official Art links are maintained in <code>src/App.jsx</code> under <code>OFFICIAL_ARTWORKS</code>.
          </li>
        </ul>
      </section>
    );
  }

  function renderPage() {
    switch (currentPage) {
      case 'profile':
        return renderProfile();
      case 'story':
        return renderStory();
      case 'gallery':
        return renderGallery();
      case 'official-art':
        return renderOfficialArt();
      case 'sources':
        return renderSources();
      default:
        return renderHome();
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Wuthering Waves 3.3 Fan Site</p>
            <h1>Denia Personal Website</h1>
            <p className="subtitle">Profile, timeline, official media, and your own curated art archive.</p>
          </div>
          <button className="music-btn" onClick={() => setMusicOn((v) => !v)}>
            {musicOn ? 'Pause Music' : 'Play Music'}
          </button>
        </div>

        <nav className="top-nav" aria-label="Main navigation">
          <button className={currentPage === 'home' ? 'active' : ''} onClick={() => goToPage('home')}>Home</button>
          <button className={currentPage === 'profile' ? 'active' : ''} onClick={() => goToPage('profile')}>Profile</button>
          <button className={currentPage === 'story' ? 'active' : ''} onClick={() => goToPage('story')}>Story</button>
          <button className={currentPage === 'gallery' ? 'active' : ''} onClick={() => goToPage('gallery')}>Gallery</button>
          <button className={currentPage === 'official-art' ? 'active' : ''} onClick={() => goToPage('official-art')}>Official Art</button>
          <button className={currentPage === 'sources' ? 'active' : ''} onClick={() => goToPage('sources')}>Sources</button>
        </nav>
      </header>

      {musicOn ? (
        <section className="music-panel">
          <iframe
            title="music"
            src="https://music.163.com/outchain/player?type=0&id=7572554588&auto=1&height=86"
            width="100%"
            height="106"
            frameBorder="0"
            allow="autoplay"
          />
        </section>
      ) : null}

      {renderPage()}

      <div className={`lightbox ${lightboxIndex >= 0 ? 'open' : ''}`} onClick={() => setLightboxIndex(-1)}>
        {currentLightboxImage ? (
          <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setLightboxIndex(-1)}>X</button>
            <button className="nav prev" onClick={() => setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}>&lt;</button>
            <ZoomableImage
              src={`./images/full/${currentLightboxImage.full}`}
              alt={currentLightboxImage.artist}
              onError={(e) => { e.currentTarget.src = fallbackSvg(currentLightboxImage.artist); }}
            />
            <button className="nav next" onClick={() => setLightboxIndex((prev) => (prev + 1) % displayImages.length)}>&gt;</button>

            <div className="lightbox-info">
              <p>Artist: {currentLightboxImage.artist}</p>
              <p>
                Pixiv:{' '}
                <a href={`https://www.pixiv.net/artworks/${currentLightboxImage.pixivId}`} target="_blank" rel="noreferrer">
                  {currentLightboxImage.pixivId}
                </a>
              </p>
              <p>Tags: {currentLightboxImage.tags.join(', ') || 'untagged'}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
