import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import './styles.css';

export default function DocSidebarWrapper(props) {
  // 添加自定义处理以确保左侧线条不会干扰点击
  return (
    <div className="doc-sidebar-wrapper">
      <DocSidebar {...props} />
      {/* 将垂直线替换为不会干扰点击的元素 */}
      <div className="sidebar-divider" aria-hidden="true"></div>
    </div>
  );
} 