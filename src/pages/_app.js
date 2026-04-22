import "@/styles/globals.css";
import NavBar from "@/components/NavBar";
import FooterComponent from "@/components/FooterComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.min.js");
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  return (
    <>
      <NavBar />
      <div className="d-flex flex-column min-vh-100">
        <Component {...pageProps} />
        <FooterComponent />
      </div>
    </>
  );
}
