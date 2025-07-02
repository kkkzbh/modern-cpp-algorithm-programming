import React from 'react';
import DocSidebarItem from '@theme-original/DocSidebarItem';
import styles from './styles.module.css';

export default function DocSidebarItemWrapper(props) {
  // 为侧边栏项目添加自定义包装，修复点击问题
  return (
    <div className={styles.sidebarItemWrapper}>
      <DocSidebarItem {...props} />
    </div>
  );
} 