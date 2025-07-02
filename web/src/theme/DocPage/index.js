import React from 'react';
import DocPage from '@theme-original/DocPage';
import './styles.css';

export default function DocPageWrapper(props) {
  return (
    // 添加自定义类名以便更精确地控制样式
    <div className="doc-page-no-separator">
      <DocPage {...props} />
    </div>
  );
} 