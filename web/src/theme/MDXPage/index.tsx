import React from 'react';
import MDXPage from '@theme-original/MDXPage';
import './styles.css';

export default function MDXPageWrapper(props) {
  return (
    <MDXPage {...props} className="mdx-content-transition" />
  );
} 