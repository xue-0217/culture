import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass, Users, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: '首页', path: '/', icon: <Compass className="w-4 h-4" /> },
    { name: 'AI共创', path: '/create', icon: <Sparkles className="w-4 h-4" /> },
    { name: '社区', path: '/community', icon: <Users className="w-4 h-4" /> },
    { name: '专题', path: '/explore', icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-rice/80 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group interactive">
          <div className="w-8 h-8 bg-ink text-rice flex items-center justify-center rounded-sm font-serif font-bold text-xl group-hover:bg-china-red transition-colors">
            文
          </div>
          <span className="font-serif font-bold text-xl tracking-widest">文织万象</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm tracking-widest transition-colors ${
                location.pathname === item.path
                  ? 'text-china-red font-medium'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center hover:border-china-red hover:text-china-red transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-rice border-b border-ink/5 shadow-lg"
          >
            <div className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-china-red/5 text-china-red'
                      : 'text-ink hover:bg-ink/5'
                  }`}
                >
                  {item.icon}
                  <span className="tracking-widest">{item.name}</span>
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-ink hover:bg-ink/5"
              >
                <User className="w-4 h-4" />
                <span className="tracking-widest">个人主页</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
