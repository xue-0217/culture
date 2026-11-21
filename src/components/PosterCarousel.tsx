import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { useReducedMotion } from 'motion/react';

const photos = [
  {
    src: '/images/home-loom.webp',
    subject: '织丝',
    alt: '木梭停在织机上，暖光照亮了成排的丝线',
    position: '45% center',
  },
  {
    src: '/images/home-indigo.webp',
    subject: '蓝染',
    alt: '白花纹蓝染布挂在木杆上，旁边是一口染缸',
    position: '37% center',
  },
  {
    src: '/images/home-embroidery.webp',
    subject: '苏绣',
    alt: '竹绣绷上绣着两朵浅粉色玉兰，一根细针搁在绣面上',
    position: '36% center',
  },
  {
    src: '/images/home-thread-installation.webp',
    subject: '丝线装置',
    alt: '朱红丝线在展厅中交叠成悬空的曲面，光线在地面拉出细密的影子',
    position: '39% center',
  },
  {
    src: '/images/home-bamboo.webp',
    subject: '竹编',
    alt: '一位手艺人将竹篾穿入尚未收口的圆竹盘',
    position: '42% center',
  },
  {
    src: '/images/home-paper-landscape.webp',
    subject: '纸构山水',
    alt: '染有青蓝色的宣纸折成层叠的山峰，立在蓝灰展台上',
    position: '34% center',
  },
];

const slideDuration = 5500;

export default function PosterCarousel() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [mouseOver, setMouseOver] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const rotating = !reducedMotion && !mouseOver && !keyboardFocus && pageVisible;
  const active = photos[index];

  useEffect(() => {
    function updateVisibility() {
      setPageVisible(!document.hidden);
    }
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % photos.length), slideDuration);
    return () => window.clearTimeout(timer);
  }, [rotating, index]);

  function goTo(target: number) {
    setIndex((target + photos.length) % photos.length);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    const end = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !end) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) {
      goTo(index + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <div
      className="poster-stage"
      role="region"
      aria-label="首页工艺照片轮播"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
      }}
    >
      <div
        className="poster-photos"
        onTouchStart={event => {
          const touch = event.touches[0];
          touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        {photos.map((photo, photoIndex) => (
          <div
            className="poster-slide"
            key={photo.src}
            data-active={photoIndex === index}
            aria-hidden={photoIndex !== index}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              fetchPriority={photoIndex === 0 ? 'high' : 'low'}
              style={{ objectPosition: photo.position }}
            />
          </div>
        ))}
      </div>

      <div className="poster-veil" aria-hidden="true" />
      <p className="poster-tagline">
        <span><strong className="poster-tagline-emphasis">经纬</strong>有来处</span>
        <span><strong className="poster-tagline-emphasis">万象</strong>从手生</span>
      </p>

      <div
        className="poster-controls"
        role="group"
        aria-label="轮播控制"
        onFocusCapture={event => setKeyboardFocus(event.target.matches(':focus-visible'))}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
        }}
      >
        {photos.map((photo, photoIndex) => (
          <button
            key={photo.src}
            type="button"
            className="poster-dot"
            aria-label={`第 ${photoIndex + 1} 张：${photo.subject}`}
            aria-current={photoIndex === index ? 'true' : undefined}
            onClick={() => goTo(photoIndex)}
          />
        ))}
      </div>
      <span className="sr-only" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">
        第 {index + 1} 张，共 {photos.length} 张。{active.subject}
      </span>
    </div>
  );
}
