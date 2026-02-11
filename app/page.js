import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        {/* Replace this URL with your own image later (local public/hero.jpg, etc.) */}
        <div
          className="hero-media"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1526402463720-2fc1df8f4b14?auto=format&fit=crop&w=2400&q=80")',
          }}
          aria-hidden="true"
        />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="container hero-content">
          <div className="stack-18" style={{ maxWidth: 720 }}>
            <div className="badge">Craft • Clarity • Discipline</div>

            <h1 className="h1">Psi Delta Mu</h1>

            <p style={{ color: "var(--muted)", fontSize: 18, margin: 0 }}>
              Minimal objects. Honest materials. Quiet intent. Goods and writings built with a
              statue-like permanence.
            </p>

            <div className="row" style={{ marginTop: 14, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/products">
                Shop Products
              </Link>
              <Link className="btn" href="/library">
                Read the Library
              </Link>
              <Link className="btn btn-ghost" href="/blog">
                Visit the Blog
              </Link>
            </div>

            <div className="small" style={{ marginTop: 8 }}>
              Sign in to review products, comment on posts, and manage your account.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stack-18">
            <div className="card card-pad">
              <h2 className="h2">What you’ll find here</h2>
              <div className="row" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
                <div className="card card-pad" style={{ flex: "1 1 260px" }}>
                  <h3 className="h3">Products</h3>
                  <p className="small">
                    Crochet beanies, blankets, candles, diffuser oils, fragrance, soap, paintings,
                    and limited projects.
                  </p>
                </div>
                <div className="card card-pad" style={{ flex: "1 1 260px" }}>
                  <h3 className="h3">Blog</h3>
                  <p className="small">
                    Updates, launches, philosophy, build logs, and behind-the-scenes process.
                  </p>
                </div>
                <div className="card card-pad" style={{ flex: "1 1 260px" }}>
                  <h3 className="h3">Library</h3>
                  <p className="small">
                    Longer essays and articles—organized, searchable, built to last.
                  </p>
                </div>
              </div>
            </div>

            <div className="card card-pad">
              <h2 className="h2">Transparency</h2>
              <p className="small">
                See materials, time, cost breakdown, donation percentage, and where the money goes—
                product by product.
              </p>
              <Link className="btn btn-sm" href="/transparency">
                View Transparency
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
