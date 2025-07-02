import React from 'react';
import Layout from '@theme-original/DocPage/Layout';
import './styles.css';

export default function LayoutWrapper(props) {
  // 自定义文档页面布局，移除垂直分隔线
  return (
    <div className="custom-doc-page-layout">
      <Layout {...props} />
    </div>
  );
} 