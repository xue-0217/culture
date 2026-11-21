/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Link, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Create from './pages/Create';
import Exhibitions, { ExhibitDetail } from './pages/Exhibitions';
import Atlas, { CraftDetail } from './pages/Atlas';
import Topics from './pages/Topics';
import { findExhibit, formerExhibitDestinations } from './data/exhibition';

function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
    if (state?.focusContent) document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname, hash, state]);

  return null;
}

function LegacyExhibit() {
  const { postId } = useParams();
  const work = findExhibit(postId);
  const destination = work ? `/exhibitions/${work.id}` : formerExhibitDestinations.get(postId ?? '') ?? '/exhibitions';
  return <Navigate to={destination} replace />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <ScrollToTop />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
            <Route path="/exhibitions/:workId" element={<ExhibitDetail />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/atlas/:craftId" element={<CraftDetail />} />
            <Route path="/community" element={<Navigate to="/exhibitions" replace />} />
            <Route path="/explore" element={<Topics />} />
            <Route path="/profile" element={<Navigate to="/exhibitions" replace />} />
            <Route path="/post/:postId" element={<LegacyExhibit />} />
            <Route path="*" element={<div className="wrap page-shell page-intro"><h1>未找到此页</h1><Link to="/" className="text-link">回到首页</Link></div>} />
          </Routes>
        </main>
      </Router>
    </MotionConfig>
  );
}
