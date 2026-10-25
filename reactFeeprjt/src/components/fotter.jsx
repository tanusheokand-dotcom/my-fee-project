import { Link } from "react-router-dom";
import { Feather, ExternalLink, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">
            <Feather size={20} /> Ink<span>Space</span>
          </Link>
          <p className="muted">
            About: InkSpace is a demo blogging platform built with React for
            learning. Read, write and share ideas worth sharing.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/explore">All articles</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/bookmarks">Bookmarks</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:hello@inkspace.demo">
                <Mail size={14} /> hello@inkspace.demo
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub <ExternalLink size={13} />
              </a>
            </li>
            <li>
              <a href="https://x.com" target="_blank" rel="noreferrer">
                X / Twitter <ExternalLink size={13} />
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn <ExternalLink size={13} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom muted">
        © {new Date().getFullYear()} InkSpace. Demo project, not for production use.
      </div>
    </footer>
  );
}