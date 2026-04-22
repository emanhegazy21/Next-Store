import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const About = () => {
    return (
        <div className="container-fluid bg-white min-vh-100 d-flex align-items-center py-5">
            <div className="container">
                <div className="row align-items-center g-5">
                    
                    <div className="col-lg-6 col-md-12">
                        <Image 
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000" 
                            alt="Store" 
                            className="img-fluid rounded-4 shadow-sm"
                            width={1000}
                            height={700}
                        />
                    </div>

                    <div className="col-lg-6 col-md-12 text-center text-lg-start">
                        <h1 className="display-4 fw-bold mb-4 text-dark">
                            About Us.
                        </h1>
                        <p className="lead text-secondary mb-5 lh-lg">
                            We are a modern boutique store dedicated to bringing you the finest products with a focus on simplicity, quality, and timeless design. Our mission is to enhance your daily life through carefully selected items.
                        </p>
                        
                        <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                            <Link href="/products" className="btn btn-dark btn-lg px-4 py-2 rounded-3 fw-semibold shadow-sm">
                                Browse Shop
                            </Link>
                            <Link href="/" className="btn btn-outline-light border text-dark btn-lg px-4 py-2 rounded-3 fw-semibold">
                                Go Home
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
