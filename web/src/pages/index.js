import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Home() {
  // Redirect to the docs root where homepage.md (slug '/') is served
  return <Redirect to={useBaseUrl('/docs')} />;
}

export default Home; 