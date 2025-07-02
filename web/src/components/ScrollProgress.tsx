import React, { useState, useEffect } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress(): JSX.Element {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollTop / scrollHeight;
      setWidth(scrollProgress * 100);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div 
      className={styles.scrollProgressBar} 
      style={{ width: `${width}%` }}
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
} 