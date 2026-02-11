"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";

function MobileMenu({ open, onClose, user, loading, logout }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Escape closes + focus trap for Tab
  useEffect(() => {
    if (!open) return;

    const getFocusable = () => {
      const root = panelRef.current;
      if (!root) return [];
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");
      return Array.from(root.querySelectorAll(selectors))
        .filter((el) => el.offsetParent !== null); // visible only
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = getFocusable();
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      // If focus somehow left the dialog, bring it back
      if (!panelRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey) {
        // Shift+Tab: wrap to last
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: wrap to first
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Click outside closes (works even if backdrop isn't clicked directly)
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (!panel.contains(e.target)) onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // Focus close button on open
  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const NavItem = ({ href, title, sub }) => (
    <Link className="menu-link" href={href} onClick={onClose}>
      <div className="stack-6">
        <div style={{ letterSpacing: "1.6px", textTransform: "uppercase", fontSize: 13 }}>
          {title}
        </div>
        {sub ? <div className="menu-sub">{sub}</div> : null}
      </div>
      <div style={{ color: "var(--gilt)", fontSize: 18, lineHeight: 1 }}>›</div>
    </Link>
  );

  return (
    <>
      {/* Keep backdrop for visuals; click-outside logic is handled via document listener */}
      <div className="menu-backdrop" aria-hidden="true" />

      <div
        ref={panelRef}
        className="menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="menu-head">
          <div className="menu-title">psi delta mu</div>
          <button
            ref={closeBtnRef}
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <div className="menu-body">
          <div className="menu-links">
            <NavItem href="/products" title="Products" sub="Handmade goods & projects" />
            <NavItem href="/blog" title="Blog" sub="Updates, launches, process" />
            <NavItem href="/library" title="Library" sub="Longform essays & articles" />
            <NavItem href="/transparency" title="Transparency" sub="Costs, time, donation %" />
            <NavItem href="/contact" title="Contact" sub="Get in touch" />
          </div>

          <div className="menu-actions">
            {loading ? null : user ? (
              <>
                <Link className="btn btn-sm" href="/account" onClick={onClose}>
                  Account
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm" href="/login" onClick={onClose}>
                  Log in
                </Link>
                <Link className="btn btn-primary btn-sm" href="/signup" onClick={onClose}>
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="divider" />

          <div className="row" style={{ flexWrap: "wrap" }}>
            <a className="link" href="https://www.reddit.com" target="_blank" rel="noreferrer">
              Reddit
            </a>
            <a className="link" href="https://www.facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a className="link" href="https://www.instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="link" href="https://www.tiktok.com" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a className="link" href="https://x.com" target="_blank" rel="noreferrer">
              X
            </a>
            <a className="link" href="https://www.youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>

          <div className="small" style={{ marginTop: 10 }}>
            Press <span style={{ color: "var(--paper)" }}>Esc</span> to close.
          </div>
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Psi Delta Mu Home">
          <div className="brand-mark" />
          <div className="brand-name">psi delta mu</div>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/library">Library</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/transparency">Transparency</Link>
        </nav>

        <div className="nav-actions">
          <button
            className="btn btn-ghost nav-toggle"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            Menu
          </button>

          {loading ? null : user ? (
            <>
              <Link className="btn btn-sm" href="/account">
                Account
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm" href="/login">
                Log in
              </Link>
              <Link className="btn btn-primary btn-sm" href="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        loading={loading}
        logout={logout}
      />
    </header>
  );
}
