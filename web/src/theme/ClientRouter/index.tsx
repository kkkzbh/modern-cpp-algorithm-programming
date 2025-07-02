import React from 'react';
import ClientRouterOriginal from '@theme-original/ClientRouter';

// 简化ClientRouter，使用Root中的全局过渡系统
export default function ClientRouterProvider(props) {
  return <ClientRouterOriginal {...props} />;
} 