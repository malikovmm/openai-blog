import React from 'react';
import { AppProps } from 'next/app';
import MainLayout from '../layouts/Main';
import './../global/styles.scss';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
};

export default App;
