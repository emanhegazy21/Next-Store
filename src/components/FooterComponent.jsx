import React from 'react';

const FooterComponent = () => {
    return (
        <footer className="bg-white border-top py-4 mt-auto">
            <div className="container text-center">
                <p className="text-muted mb-0" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
                    &copy; {new Date().getFullYear()} <span className="text-dark fw-bold ms-1">EMAN STORE</span>. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterComponent;