import React from 'react';
import DocItem from '@theme-original/DocItem';
import './styles.css';

export default function DocItemWrapper(props) {
  return (
    <DocItem {...props} className="doc-content-transition" />
  );
} 