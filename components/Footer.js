import Link from "next/link";

function SocialLink({ href, label }) {
  return (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="section">
      <div className="container">
        <div className="card card-pad">
          <div className="stack-14">
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div className="stack-6">
                <div className="kicker">Psi Delta Mu</div>
                <div className="small">
                  Minimal, handcrafted goods + writings — built with clarity, restraint, and craft.
                </div>
              </div>

              <div className="row" style={{ flexWrap: "wrap" }}>
                <Link className="link" href="/products">Products</Link>
                <Link className="link" href="/blog">Blog</Link>
                <Link className="link" href="/library">Library</Link>
                <Link className="link" href="/contact">Contact</Link>
                <Link className="link" href="/privacy">Privacy</Link>
                <Link className="link" href="/transparency">Transparency</Link>
              </div>
            </div>

            <div className="divider" />

            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div className="small">© {new Date().getFullYear()} Psi Delta Mu. All rights reserved.</div>

              <div className="row" style={{ flexWrap: "wrap" }}>
                <SocialLink href="https://www.reddit.com" label="Reddit" />
                <SocialLink href="https://www.facebook.com" label="Facebook" />
                <SocialLink href="https://www.instagram.com" label="Instagram" />
                <SocialLink href="https://www.tiktok.com" label="TikTok" />
                <SocialLink href="https://x.com" label="X" />
                <SocialLink href="https://www.youtube.com" label="YouTube" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
