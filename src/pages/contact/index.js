import React from 'react';

const ContactUs = () => {
    return (
        <div className="container-fluid bg-white min-vh-100 d-flex align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-lg-6">
                        <h1 className="display-4 fw-bold text-dark">Contact Us</h1>
                        <p className="lead text-secondary">We'd love to hear from you. Send us a message.</p>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8">
                        <div className="card border-0 shadow-sm p-4 rounded-4">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-muted">Full Name</label>
                                    <input type="text" className="form-control border-0 bg-light p-3 rounded-3" placeholder="John Doe" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                                    <input type="email" className="form-control border-0 bg-light p-3 rounded-3" placeholder="name@example.com" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-muted">Message</label>
                                    <textarea className="form-control border-0 bg-light p-3 rounded-3" rows="4" placeholder="How can we help?"></textarea>
                                </div>
                                <button type="submit" className="btn btn-dark w-100 py-3 fw-bold rounded-3 shadow-sm">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;