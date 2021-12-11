import React from 'react';

interface Props {
    isLoading: boolean
}

const Loader: React.FC<Props> = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }

    return (
        <div className="position-absolute top-50 start-50 translate-middle">
            <p className="spinner-border" role="status" />
        </div>
    );
};

export default Loader;
