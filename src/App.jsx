import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Gallery from './Gallery';
import './styles.css';

const t = {
  navGallery: 'Gallery',
};

function NavBar() {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">DENIA Fan Site</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' || location.pathname === '' ? 'active' : ''}>
          {t.navGallery}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Gallery />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
