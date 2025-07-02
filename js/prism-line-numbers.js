/**
 * Prism Line Numbers 插件
 * 用于确保代码块中的行号正确显示
 * 
 * 修改自官方 Prism Line Numbers 插件
 * https://prismjs.com/plugins/line-numbers/
 */

(function () {
  // 检查是否在浏览器环境中，避免SSR错误
  if (typeof Prism === 'undefined' || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  /**
   * 插件名称
   * @type {string}
   */
  var PLUGIN_NAME = 'line-numbers';

  /**
   * 正则表达式用于匹配换行符
   * @type {RegExp}
   */
  var NEW_LINE_EXP = /\n(?!$)/g;

  /**
   * 全局扩展 Prism.plugins
   * @type {Object}
   */
  var config = Prism.plugins.lineNumbers = {
    /**
     * 获取代码块行数
     * @param {Element} element 代码块元素
     * @returns {number} 行数
     */
    getLine: function (element) {
      if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
        return -1;
      }

      var lineNumberRows = element.querySelector('.line-numbers-rows');
      if (!lineNumberRows) {
        return -1;
      }
      var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
      var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

      if (lineNumber < lineNumberStart) {
        return -1;
      }
      if (lineNumber > lineNumberEnd) {
        return -1;
      }

      var lineIndex = lineNumber - lineNumberStart;
      return lineNumberRows.children[lineIndex];
    },

    /**
     * 调整行号高度以匹配代码行
     * @param {Element} element 代码块元素
     */
    resizeLineNumbers: function (element) {
      // 只处理带有line-numbers类的pre元素
      if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
        return;
      }

      // 获取代码元素和行号容器
      var codeElement = element.querySelector('code');
      var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
      if (!codeElement) {
        return;
      }

      // 如果没有行号容器，创建一个
      if (!lineNumbersWrapper) {
        lineNumbersWrapper = document.createElement('span');
        lineNumbersWrapper.className = 'line-numbers-rows';
        lineNumbersWrapper.setAttribute('aria-hidden', 'true');
        element.appendChild(lineNumbersWrapper);
      }

      // 获取代码行 - 支持Docusaurus的token-line类
      var tokenLines = codeElement.querySelectorAll('.token-line');
      var lineCount;

      if (tokenLines && tokenLines.length > 0) {
        // Docusaurus使用token-line类
        lineCount = tokenLines.length;
      } else {
        // 回退到传统的文本分割
        var codeLines = codeElement.textContent.split(NEW_LINE_EXP);
        if (codeLines[codeLines.length - 1] === '') {
          codeLines.pop();
        }
        lineCount = codeLines.length;
      }

      // 确保行号容器有正确数量的行
      var lineNumbersHTML = '';
      for (var i = 0; i < lineCount; i++) {
        lineNumbersHTML += '<span></span>';
      }
      lineNumbersWrapper.innerHTML = lineNumbersHTML;

      // 调整每行的高度
      if (tokenLines && tokenLines.length > 0) {
        var lineNumberElements = lineNumbersWrapper.children;
        for (var i = 0; i < tokenLines.length; i++) {
          if (i < lineNumberElements.length) {
            var lineHeight = tokenLines[i].offsetHeight;
            lineNumberElements[i].style.height = lineHeight + 'px';
          }
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
      if (getComputedStyle(element).position !== 'relative') {
        element.style.position = 'relative';
      }
      
      // 确保代码块有足够的左内边距以容纳行号
      if (parseFloat(getComputedStyle(element).paddingLeft) < 3.8) {
        element.style.paddingLeft = '3.8em';
      }
    }
  };

  /**
   * 初始化行号功能
   */
  function initLineNumbers() {
    // 为所有带有line-numbers类的pre元素和Docusaurus的prism-code类添加行号
    var elements = document.querySelectorAll('pre.line-numbers, pre.prism-code');
    for (var i = 0, element; element = elements[i++];) {
      // 如果没有line-numbers类，则添加
      if (!element.classList.contains('line-numbers')) {
        element.classList.add('line-numbers');
      }

      // 调整行号
      config.resizeLineNumbers(element);
    }
  }

  /**
   * 初始化插件
   */
  function init() {
    // 初始化所有现有的代码块
    initLineNumbers();

    // 监听DOM变化，为新添加的代码块添加行号
    if (typeof MutationObserver === 'function') {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === 'childList') {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
              var node = mutation.addedNodes[i];
              if (node.nodeType === 1) { // 元素节点
                if ((node.tagName === 'PRE' && 
                    (node.classList.contains('line-numbers') || node.classList.contains('prism-code'))) ||
                    node.querySelector('pre.line-numbers, pre.prism-code')) {
                  initLineNumbers();
                }
              }
            }
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // 监听窗口大小变化，重新调整行号高度
    window.addEventListener('resize', function () {
      var elements = document.querySelectorAll('pre.line-numbers, pre.prism-code');
      for (var i = 0, element; element = elements[i++];) {
        config.resizeLineNumbers(element);
      }
    });
  }

  // 当页面加载完成后初始化插件
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 为Prism添加钩子，在高亮完成后添加行号
  Prism.hooks.add('complete', function (env) {
    if (!env.code) {
      return;
    }

    var pre = env.element.parentNode;
    if (!pre || pre.tagName !== 'PRE') {
      return;
    }

    // 添加line-numbers类
    if (!pre.classList.contains('line-numbers')) {
      pre.classList.add('line-numbers');
    }

    // 调整行号
    config.resizeLineNumbers(pre);
  });

})(); 