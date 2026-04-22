import Head from "next/head";
import { useEffect, useRef } from "react";
import { toastNews } from "@/data/toastNews";

export default function NewsPage({ featuredNews, generatedAt, digest }) {
  const toastRef = useRef(null);

  useEffect(() => {
    let toastInstance;

    async function showToast() {
      const bootstrapModule = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
      const Toast = bootstrapModule.Toast;

      if (toastRef.current) {
        toastInstance = new Toast(toastRef.current, { autohide: false });
        toastInstance.show();
      }
    }

    showToast();

    return () => {
      toastInstance?.dispose?.();
    };
  }, [featuredNews.title]);

  return (
    <>
      <Head>
        <title>Toast News | Eman Store</title>
      </Head>

      <div className="container py-5 position-relative">
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div
            ref={toastRef}
            className="toast border-0 shadow-lg"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-dark text-white">
              <strong className="me-auto">{featuredNews.tone} Toast</strong>
              <small>{new Date(generatedAt).toLocaleTimeString()}</small>
            </div>
            <div className="toast-body">
              <div className="fw-bold mb-2">{featuredNews.title}</div>
              <div className="text-muted">{featuredNews.summary}</div>
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-7">
            <span className="badge text-bg-dark rounded-pill px-3 py-2 mb-3">
              SSR Request-Time Page
            </span>
            <h1 className="display-4 fw-bold mb-3">Store news, served fresh on every request</h1>
            <p className="lead text-muted mb-4">
              This page uses server-side rendering to pick a random toast headline each time the
              route is requested.
            </p>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="small text-uppercase text-muted fw-bold mb-2">Featured headline</div>
              <h2 className="h3 fw-bold mb-3">{featuredNews.title}</h2>
              <p className="text-muted mb-0">{featuredNews.summary}</p>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-bold mb-0">News Digest</h3>
                <span className="small text-muted">
                  {new Date(generatedAt).toLocaleString()}
                </span>
              </div>
              <div className="list-group list-group-flush">
                {digest.map((item) => (
                  <div key={item.title} className="list-group-item px-0 py-3 border-bottom">
                    <div className="small text-uppercase text-muted fw-bold mb-1">{item.tone}</div>
                    <div className="fw-semibold mb-1">{item.title}</div>
                    <div className="text-muted small">{item.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ res }) {
  const randomIndex = Math.floor(Math.random() * toastNews.length);
  const featuredNews = toastNews[randomIndex];

  res.setHeader("Cache-Control", "no-store");

  return {
    props: {
      featuredNews,
      generatedAt: new Date().toISOString(),
      digest: toastNews,
    },
  };
}
