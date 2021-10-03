import React from 'react';
import type { NextPage } from 'next';
import Form from '../components/form';
import Header from '../components/header';
import Footer from '../components/footer';

const Home: NextPage = () => {
    return (
        <>
            <div className="wrapper">
                <Header />
                <Form />
            </div>
            <Footer />
        </>
    );
};

export default Home;
