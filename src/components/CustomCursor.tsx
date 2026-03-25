import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring physics for the cursor
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovering ? 72 : 12,
        height: isHovering ? 72 : 12,
        backgroundColor: isHovering ? '#F9F9F6' : '#C83C23', // rice to china-red
        borderRadius: isHovering ? '50%' : '2px',
        rotate: isHovering ? 0 : 45,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.span 
        className="text-xs font-serif font-bold text-ink tracking-widest"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isHovering ? 1 : 0, 
          scale: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.2, delay: isHovering ? 0.1 : 0 }}
      >
        探索
      </motion.span>
    </motion.div>
  );
}
