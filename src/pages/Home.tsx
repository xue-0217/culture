import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { homeThemes } from '../data/exhibition';
import PosterCarousel from '../components/PosterCarousel';

export default function Home() {
  return (
    <>
      <section className="poster-section" aria-labelledby="poster-title">
        <div className="poster">
          <div className="poster-name">
            <h1 id="poster-title" className="poster-wordmark" aria-label="文织万象">
              <span>文</span><span>织</span><span>万</span><span>象</span>
            </h1>
          </div>

          <PosterCarousel />

          <div className="poster-actions">
            <Link to="/create" className="button-ink">
              开始创作 <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link to="/explore" className="text-link">
              浏览专题 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-collection" aria-labelledby="collection-title">
        <div className="wrap">
          <header className="section-heading">
            <h2 id="collection-title">精选主题</h2>
            <Link to="/exhibitions" className="text-link">
              进入展览 <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </header>

          <div className="selection-grid">
            {homeThemes.map(item => (
              <article className="selection-item" key={item.section}>
                <Link to={`/exhibitions#${item.section}`} className="selection-link">
                  <div className="selection-image">
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                  </div>
                  <h3>{item.title}</h3>
                </Link>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
