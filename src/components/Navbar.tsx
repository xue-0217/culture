import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  { name: '首页', path: '/' },
  { name: '展览', path: '/exhibitions' },
  { name: '创作工坊', path: '/create' },
  { name: '工艺图鉴', path: '/atlas' },
  { name: '文化专题', path: '/explore' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDialogElement>(null);
  const isPoster = pathname === '/';
  const isEditorial = pathname.startsWith('/exhibitions') || pathname.startsWith('/atlas') || pathname === '/explore';

  useEffect(() => {
    menuRef.current?.close();
    setIsOpen(false);
  }, [pathname]);

  if (pathname === '/create' || pathname === '/create/') return null;

  return (
    <header className={isPoster ? 'poster-header' : `site-header${isEditorial ? ' editorial-header' : ''}`}>
      <div className="wrap site-header-content">
        <a href="#main-content" className="skip-link">跳到正文</a>
        <Link to="/" className="site-wordmark" aria-label="文织万象首页">
          <img src="/images/brand/paper-cut-mark.webp" alt="" width={36} height={36} />
          <span>文织万象</span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className="site-nav-link">
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label="打开导航菜单"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="site-menu"
          onClick={() => {
            menuRef.current?.showModal();
            setIsOpen(true);
          }}
        >
          <span className="poster-menu-label">菜单</span>
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      <dialog
        id="site-menu"
        className="site-menu"
        ref={menuRef}
        aria-label="导航菜单"
        onClose={event => setIsOpen(event.currentTarget.open)}
      >
        <button
          type="button"
          className="site-menu-close"
          aria-label="关闭导航菜单"
          onClick={() => menuRef.current?.close()}
        >
          <span>关闭</span><X size={20} aria-hidden="true" />
        </button>
        <div className="site-menu-wordmark" aria-hidden="true">
          <span className="poster-wordmark">
            <span>文</span><span>织</span><span>万</span><span>象</span>
          </span>
        </div>
        <nav className="site-menu-links" aria-label="主导航">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              state={item.path === '/create' ? { returnTo: pathname } : undefined}
              onClick={() => menuRef.current?.close()}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
