import React, { useEffect, useState } from 'react';
import CursorDot from './CursorDot';
import CursorRing from './CursorRing';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <CursorDot 
        mousePosition={mousePosition} 
        size={isHovering ? 12 : 8} 
        color="bg-blue-500"
      />
      <CursorRing 
        mousePosition={mousePosition} 
        size={isHovering ? 40 : 32} 
        delay={0.1}
        borderColor="border-purple-500"
      />
      <CursorRing 
        mousePosition={mousePosition} 
        size={isHovering ? 60 : 48} 
        delay={0.2}
        borderColor="border-blue-500"
      />
    </>
  );
};

export default CustomCursor;