import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-light bg-gradient">
            <div className="container w-100 p-4">
                <p className="text-center">(c) Niklāvs Katlaps</p>
                <p className="text-center">
                    Source code available { ' ' }
                    <a
                      href="https://github.com/niklavskatlaps/tempo-sync"
                      target="_blank"
                      className="link-primary" rel="noreferrer"
                    >
                        here
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
