import React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <ToastContainer />
            <Component { ...pageProps } />
        </>
    );
}

export default MyApp;
