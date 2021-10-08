import React from 'react';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'reactjs-popup/dist/index.css';
import '../styles/globals.scss';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Head>
                <title>Tempo Sync</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <ToastContainer 
              position="bottom-right"
              newestOnTop
            />
            <Component { ...pageProps } />
        </>
    );
}

export default MyApp;
