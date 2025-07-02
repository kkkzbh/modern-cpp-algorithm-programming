/**
 * 修复Docusaurus中PrismJS行号显示问题
 * 这个脚本会在页面加载和窗口调整大小时重新计算行号高度
 */

(function() {
  // 检查是否在浏览器环境中，避免SSR错误
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  // 行号高度调整函数
  function adjustLineNumbersHeight() {
    // 获取所有带行号的代码块
    const codeBlocks = document.querySelectorAll('pre.line-numbers, pre.prism-code.line-numbers');
    
    if (!codeBlocks || codeBlocks.length === 0) {
      return;
    }
    
    // 处理每个代码块
    codeBlocks.forEach(pre => {
      // 获取代码元素和行号容器
      const code = pre.querySelector('code');
      let lineNumbersWrapper = pre.querySelector('.line-numbers-rows');
      
      if (!code) {
        return;
      }
      
      // 如果没有行号容器，创建一个
      if (!lineNumbersWrapper) {
        lineNumbersWrapper = document.createElement('span');
        lineNumbersWrapper.className = 'line-numbers-rows';
        lineNumbersWrapper.setAttribute('aria-hidden', 'true');
        pre.appendChild(lineNumbersWrapper);
      }
      
      // 获取代码行
      const codeLines = code.querySelectorAll('.token-line');
      const lineCount = codeLines.length || 1;
      
      // 确保行号容器有正确数量的行
      let lineNumbersHTML = '';
      for (let i = 0; i < lineCount; i++) {
        lineNumbersHTML += '<span></span>';
      }
      lineNumbersWrapper.innerHTML = lineNumbersHTML;
      
      // 获取所有行号元素
      const lineNumberElements = lineNumbersWrapper.children;
      
      // 调整每行的高度
      for (let i = 0; i < codeLines.length; i++) {
        if (i < lineNumberElements.length) {
          const lineHeight = codeLines[i].offsetHeight;
          lineNumberElements[i].style.height = lineHeight + 'px';
        }
      }
      
      // 确保行号容器样式正确
      lineNumbersWrapper.style.position = 'absolute';
      lineNumbersWrapper.style.top = '0';
      lineNumbersWrapper.style.left = '0';
      lineNumbersWrapper.style.height = '100%';
      lineNumbersWrapper.style.paddingTop = '1em';
      lineNumbersWrapper.style.paddingBottom = '1em';
      lineNumbersWrapper.style.marginTop = '-1em';
      lineNumbersWrapper.style.marginBottom = '-1em';
      
      // 确保代码块有相对定位，以便行号容器正确定位
      if (getComputedStyle(pre).position !== 'relative') {
        pre.style.position = 'relative';
      }
      
      // 确保代码块有足够的左内边距以容纳行号
      if (parseFloat(getComputedStyle(pre).paddingLeft) < 3.8) {
        pre.style.paddingLeft = '3.8em';
      }
    });
  }
  
  // 在DOM加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    // 初始调整
    setTimeout(adjustLineNumbersHeight, 100);
    
    // 监听窗口大小变化
    window.addEventListener('resize', adjustLineNumbersHeight);
    
    // 监听主题切换
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-theme') {
          setTimeout(adjustLineNumbersHeight, 100);
        }
      });
    });
    
    // 监视HTML元素的data-theme属性变化
    const html = document.documentElement;
    observer.observe(html, { attributes: true });
    
    // 监听页面内容变化（对于SPA路由变化）
    const contentObserver = new MutationObserver(function() {
      setTimeout(adjustLineNumbersHeight, 100);
    });
    
    // 监视主内容区域的变化
    const mainContent = document.querySelector('main');
    if (mainContent) {
      contentObserver.observe(mainContent, { 
        childList: true,
        subtree: true
      });
    }
    
    // 监听代码块的变化
    const codeObserver = new MutationObserver(function() {
      setTimeout(adjustLineNumbersHeight, 100);
    });
    
    // 查找并监视所有代码块容器
    const codeContainers = document.querySelectorAll('.theme-code-block');
    codeContainers.forEach(container => {
      codeObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    });
  });
})(); 