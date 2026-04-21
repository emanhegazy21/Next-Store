import React from 'react';
import Link from 'next/link';

const HomeComponent = () => {
    return (
        <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-4 bg-white">
            <h1 className="display-3 fw-bolder mb-3 text-dark">
                WELCOME TO EMAN STORE
            </h1>
            
            <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                Clean, Simple, and High Quality Products curated just for you.
            </p>
            
            <div className="d-flex flex-column flex-sm-row gap-3">
                <Link href="/products" className="btn btn-dark btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm">
                    Shop Now
                </Link>
                
                <Link href="/products/add" className="btn btn-outline-dark btn-lg px-5 py-3 fw-bold rounded-3">
                    Add Product
                </Link>
            </div>
        </div>
    );
};

export default HomeComponent;