import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Gallery from './Gallery';
import Profile from './Profile';
import './styles.css';

const t = {
  navGallery: 'Gallery',
  navProfile: 'Profile',
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
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          {t.navProfile}
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
