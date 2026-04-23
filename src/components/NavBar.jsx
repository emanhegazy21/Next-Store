import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Eman Store
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/products">
                Products
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" href="/products/add">
                  Add Product
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" href="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/news">
                News
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/users">
                Users
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {status === "loading" ? (
              <span className="small text-muted">Checking session...</span>
            ) : isAuthenticated ? (
              <>
                <span className="small text-muted">
                  {session.user?.name || session.user?.email}
                </span>
                <button className="btn btn-outline-dark btn-sm" onClick={() => signOut()}>
                  Sign Out
                </button>
              </>
            ) : (
              <button className="btn btn-dark btn-sm" onClick={() => signIn()}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
