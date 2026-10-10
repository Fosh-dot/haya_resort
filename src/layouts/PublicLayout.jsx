import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import "./PublicLayout.css";

function PublicLayout() {
  return (
    <div className="site">
      <Navbar />

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-content">
          <div className="site-footer-socials">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>

          <a className="site-footer-contact" href="tel:09338287166">
            +639756637195
          </a>

          <a className="site-footer-contact" href="mailto:hello@hayaresort.com">
            hayaresortzambales@outlook.com
          </a>

          <p className="site-footer-address">
            Lot 7409, CAD. 614-D, Botolan, 2202 Zambales, Philippines
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
