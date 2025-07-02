// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '现代C++算法编程教程',
  tagline: 'Modern C++ Algorithm Programming',
  favicon: 'img/favicon.ico',
  url: 'https://kkkzbh.github.io',
  baseUrl: '/modern-cpp-algorithm-programming/',
  organizationName: 'your-org',
  projectName: 'modern-cpp-algorithm-programming',
  
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  
  // Even if you don't use internationalization, this is required
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-org/modern-cpp-algorithm-programming/edit/main/web/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/your-org/modern-cpp-algorithm-programming/edit/main/web/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/code-blocks.css'),
          ],
        },
      }),
    ],
  ],
  
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.jpg',
      navbar: {
        title: '现代C++算法编程教程',
        logo: {
          alt: 'Modern C++ Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '教程',
          },
          {
            href: 'https://github.com/your-org/modern-cpp-algorithm-programming',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // 添加最小化的页脚，满足验证要求
      footer: {
        style: 'dark',
        links: [],
        copyright: '© ' + new Date().getFullYear(),
      },
      prism: {
        // 使用内置主题作为基础，我们会在CSS中覆盖它们
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
        defaultLanguage: 'cpp',
        additionalLanguages: [
          'cpp', 
          'cmake', 
          'bash', 
          'csharp', 
          'python', 
          'javascript', 
          'typescript', 
          'json', 
          'markdown'
        ],
        // 全局禁用行号
        showLineNumbers: false,
        // 禁用斜体
        respectStyleSettings: false,
        // 支持高亮行
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: {start: 'highlight-start', end: 'highlight-end'},
          },
        ],
      },
      colorMode: {
        // 默认为暗色模式
        defaultMode: 'dark',
        // 允许用户切换主题
        disableSwitch: false,
        // 尊重用户系统偏好设置
        respectPrefersColorScheme: true,
      },
      // 添加全文搜索功能
      algolia: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_API_KEY',
        indexName: 'YOUR_INDEX_NAME',
        contextualSearch: true,
      },
    }),
    
  // 注释掉行号修复相关的客户端模块
  /* clientModules: [
    require.resolve('./src/js/prism-line-numbers-fix.js'),
  ], */
  
  // 注释掉行号相关脚本
  /* scripts: [
    {
      src: '/js/prism-line-numbers.js',
      async: true,
      defer: true,
    },
  ], */
  
  // 注释掉行号相关样式表
  /* stylesheets: [
    {
      href: '/css/prism-line-numbers.css',
      type: 'text/css',
    },
  ], */
};

module.exports = config; 