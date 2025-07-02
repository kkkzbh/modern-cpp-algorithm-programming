import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import './TransitionManager.css';
import '../css/no-separators.css'; // 导入移除分隔线的样式
import '../css/dark-theme.css'; // 导入低对比度深色主题

// 定义导航请求的类型
interface NavigationRequest {
  to: string;
  replace: boolean;
  isLeftSidebar: boolean;
}

// Root组件包装整个应用程序，添加页面过渡效果
export default function Root({ children }) {
  const history = useHistory();
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigatingRef = useRef(false); // 用于跟踪导航状态
  const pendingNavigationRef = useRef<NavigationRequest | null>(null); // 存储待处理的导航请求
  
  // 执行实际导航操作的函数
  const executeNavigation = (to: string, replace = false, isLeftSidebar = false) => {
    // 标记导航开始
    navigatingRef.current = true;
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 如果是左侧边栏导航，使用淡入淡出效果
    if (isLeftSidebar) {
      // 为内容区域添加淡出效果
      const mainContent = document.querySelector('.main-wrapper');
      const contentElements = document.querySelectorAll('.docItemContainer, .docMainContainer, main > .container, article');
      
      // 应用淡出效果
      if (mainContent) {
        mainContent.classList.add('content-fading');
      }
      
      contentElements.forEach(el => {
        el.classList.add('fade-out');
        el.classList.remove('fade-in');
      });
      
      // 短暂延迟后执行导航
      timeoutRef.current = setTimeout(() => {
        // 执行实际导航
        if (replace) {
          history.replace(to);
        } else {
          history.push(to);
        }
        
        // 更新当前显示的位置
        setDisplayLocation(location);
        
        // 滚动到顶部 (使用auto避免与淡入淡出动画冲突)
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
        
        // 给新内容添加淡入效果
        setTimeout(() => {
          if (mainContent) {
            mainContent.classList.remove('content-fading');
          }
          
          contentElements.forEach(el => {
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
          });
          
          // 动画完成后重置导航状态
          timeoutRef.current = setTimeout(() => {
            navigatingRef.current = false;
            
            // 检查是否有待处理的导航
            if (pendingNavigationRef.current) {
              const { to, replace, isLeftSidebar } = pendingNavigationRef.current;
              pendingNavigationRef.current = null;
              executeNavigation(to, replace, isLeftSidebar);
            }
          }, 500);
        }, 50);
      }, 300);
    } else {
      // 执行导航
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
      
      // 平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // 更新当前显示的位置
      setDisplayLocation(location);
      
      // 重置导航状态
      timeoutRef.current = setTimeout(() => {
        navigatingRef.current = false;
        
        // 检查是否有待处理的导航
        if (pendingNavigationRef.current) {
          const { to, replace, isLeftSidebar } = pendingNavigationRef.current;
          pendingNavigationRef.current = null;
          executeNavigation(to, replace, isLeftSidebar);
        }
      }, 300);
    }
  };
  
  // 页面导航处理 - 集中管理导航逻辑
  const navigate = (to: string, replace = false, isLeftSidebar = false) => {
    // 如果当前正在导航中，将此次导航存储为待处理
    if (navigatingRef.current) {
      // 存储最新的导航请求，覆盖之前可能存在的待处理请求
      pendingNavigationRef.current = { to, replace, isLeftSidebar };
      return;
    }
    
    // 直接执行导航
    executeNavigation(to, replace, isLeftSidebar);
  };
  
  // 处理页面加载和URL变化
  useEffect(() => {
    if (!isBrowser) return;
    
    // 首次加载时不应用动画
    if (isInitialRender) {
      setIsInitialRender(false);
      setDisplayLocation(location);
      return;
    }

    // 如果位置变化但不是由我们的导航函数触发的（比如浏览器前进/后退）
    if (location !== displayLocation && !navigatingRef.current) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation, isBrowser, isInitialRender]);

  // 清理任何超时
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 监听浏览器前进/后退按钮事件
  useEffect(() => {
    if (!isBrowser) return;

    const handlePopState = () => {
      if (navigatingRef.current) return;
      navigate(location.pathname, true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBrowser, location]);

  // 拦截链接点击，添加过渡效果
  useEffect(() => {
    if (!isBrowser) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      // 检查是否是内部链接
      if (link && 
          link.href && 
          link.href.startsWith(window.location.origin) && 
          !link.hasAttribute('target') && 
          !link.hasAttribute('download') && 
          !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        
        // 检查链接是否在左侧侧边栏菜单中
        const isInLeftSidebar = Boolean(
          link.closest('.theme-doc-sidebar-menu') || 
          (link.closest('.menu__list') &&
          !link.closest('.menu__list--collapsed'))
        );
        
        // 阻止默认导航行为
        e.preventDefault();
        
        // 使用我们的导航函数，为左侧边栏链接使用特殊处理
        navigate(link.href.replace(window.location.origin, ''), false, isInLeftSidebar);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [isBrowser, history]);

  // 应用深色模式样式
  useEffect(() => {
    if (!isBrowser) return;
    
    // 检查当前主题模式
    const applyDarkStyles = () => {
      const isDarkTheme = document.documentElement.dataset.theme === 'dark';
      
      if (isDarkTheme) {
        // 强制设置根元素和body的背景色
        document.documentElement.style.setProperty('--ifm-background-color', '#0D1118', 'important');
        document.documentElement.style.setProperty('--ifm-background-surface-color', '#0D1118', 'important');
        document.documentElement.style.setProperty('--ifm-navbar-background-color', '#0D1118', 'important');
        document.documentElement.style.setProperty('--ifm-sidebar-background-color', '#0D1118', 'important');
        document.documentElement.style.backgroundColor = '#0D1118';
        document.body.style.backgroundColor = '#0D1118';
        
        // 查找并修复可能具有旧背景色的元素
        const elementsToFix = document.querySelectorAll('.navbar, .main-wrapper, .docs-wrapper, [class*="docSidebarContainer"], [class*="docItemContainer"]');
        elementsToFix.forEach(el => {
          (el as HTMLElement).style.backgroundColor = '#0D1118';
        });
        
        // 强制刷新卡片组件样式
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          (card as HTMLElement).style.backgroundColor = '#161b24';
          (card as HTMLElement).style.color = '#cdd6f4';
          (card as HTMLElement).style.border = '1px solid #313244'; // mocha surface0
          
          // 处理卡片标题
          const cardHeader = card.querySelector('.card__header h3');
          if (cardHeader) {
            (cardHeader as HTMLElement).style.color = '#cdd6f4';
          }
        });
      } else {
        // 浅色主题下强制刷新卡片组件样式
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          (card as HTMLElement).style.backgroundColor = '#e6edf3';
          (card as HTMLElement).style.color = '#4c4f69';
          (card as HTMLElement).style.border = '1px solid #ccd0da'; // latte surface0
          
          // 处理卡片标题
          const cardHeader = card.querySelector('.card__header h3');
          if (cardHeader) {
            (cardHeader as HTMLElement).style.color = '#4c4f69';
          }
        });
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
  }, [isBrowser]);

  if (!isBrowser) {
    return <>{children}</>;
  }

  return (
    <div className="page-transition-container">
      {children}
    </div>
  );
} 