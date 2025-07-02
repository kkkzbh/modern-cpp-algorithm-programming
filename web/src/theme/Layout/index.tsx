import React, { useEffect } from 'react';
import Layout from '@theme-original/Layout';
import type {Props as LayoutProps} from '@theme/Layout';
import ScrollProgress from '../../components/ScrollProgress';
import './styles.css';

export default function LayoutWrapper(props: LayoutProps): React.ReactElement {
  useEffect(() => {
    // 检查当前主题模式
    const applyDarkStyles = () => {
      const isDarkTheme = document.documentElement.dataset.theme === 'dark';
      
      if (isDarkTheme) {
        // Force dark background
        document.documentElement.style.setProperty('--ifm-background-color', '#0D1118', 'important');
        document.documentElement.style.setProperty('background-color', '#0D1118', 'important');
        document.body.style.setProperty('background-color', '#0D1118', 'important');
      }
    };

    // 初始应用
    applyDarkStyles();

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          applyDarkStyles();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    
    // 清理函数
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ScrollProgress />
      <Layout {...props} />
    </>
  );
} 