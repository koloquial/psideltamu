"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function ProductDetailPage({ params }) {
  const { slug } = params;

  const { user, loading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avg: 0, count: 0 });

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const productUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${slug}`,
    [slug]
  );

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setError("");
      setInfo("");
      try {
        const res = await fetch(productUrl);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load product");
        if (!alive) return;

        setProduct(data);

        // load reviews
        const rr = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${data._id}/reviews`);
        const rd = await rr.json();
        if (!rr.ok) throw new Error(rd?.error || "Failed to load reviews");

        if (!alive) return;
        setReviews(rd.reviews || []);
        setStats({ avg: rd.avg || 0, count: rd.count || 0 });
      } catch (e) {
        if (!alive) return;
        setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => { alive = false; };
  }, [productUrl]);

  const submitReview = async () => {
    if (!user || !product) return;
    setPosting(true);
    setError("");
    setInfo("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${product._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit review");

      setInfo("Review submitted.");
      setText("");
      // refresh reviews
      const rr = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${product._id}/reviews`);
      const rd = await rr.json();
      setReviews(rd.reviews || []);
      setStats({ avg: rd.avg || 0, count: rd.count || 0 });
    } catch (e) {
      setError(e.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="small">Loading…</div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="section">
        <div className="container">
          {error ? <div className="error">{error}</div> : <div className="small">Not found.</div>}
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="stack-18">
          <div className="row" style={{ alignItems: "stretch", gap: 18, flexWrap: "wrap" }}>
            <div className="card" style={{ flex: "1 1 360px", overflow: "hidden" }}>
              <div style={{ height: 360, background: "rgba(244,245,247,0.03)" }}>
                {product.heroImage ? (
                  <div
                    style={{
                      height: "100%",
                      backgroundImage: `url("${product.heroImage}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : null}
              </div>
            </div>

            <div className="card card-pad" style={{ flex: "1 1 360px" }}>
              <div className="stack-14">
                <div className="kicker">{product.category}</div>
                <h1 className="h2" style={{ margin: 0 }}>{product.title}</h1>
                {product.subtitle ? <div className="small">{product.subtitle}</div> : null}

                <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div style={{ fontSize: 18, color: "var(--paper)" }}>${Number(product.price).toFixed(2)}</div>
                  <div className="small">{product.inStock ? "In stock" : "Out of stock"}</div>
                </div>

                <div className="small">
                  Rating: <span style={{ color: "var(--paper)" }}>{stats.avg}</span> ({stats.count})
                </div>

                {product.description ? <p className="small">{product.description}</p> : null}

                {Array.isArray(product.details) && product.details.length ? (
                  <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
                    {product.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="divider" />

                <div className="stack-10">
                  <div className="kicker">Transparency</div>
                  <div className="small">
                    Materials: ${Number(product.transparency?.materialsCost || 0).toFixed(2)} •
                    Time: {Number(product.transparency?.laborHours || 0)}h •
                    Donation: {Number(product.transparency?.donationPercent || 0)}%
                  </div>
                  {product.transparency?.whereMoneyGoes ? (
                    <div className="small">{product.transparency.whereMoneyGoes}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="stack-14">
              <h2 className="h3" style={{ margin: 0 }}>Reviews</h2>

              {error ? <div className="error">{error}</div> : null}
              {info ? <div className="help">{info}</div> : null}

              {!authLoading && user ? (
                <div className="card card-pad">
                  <div className="stack-14">
                    <div className="kicker">Leave a review</div>

                    <div className="field" style={{ maxWidth: 180 }}>
                      <div className="label">Rating (1–5)</div>
                      <select
                        className="select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        disabled={posting}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <div className="label">Review</div>
                      <textarea
                        className="textarea"
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={posting}
                        placeholder="Write a short review…"
                      />
                    </div>

                    <button className="btn btn-primary" onClick={submitReview} disabled={posting}>
                      {posting ? "Submitting…" : "Submit review"}
                    </button>

                    <div className="small">
                      One review per item (edit flow can come next).
                    </div>
                  </div>
                </div>
              ) : (
                <div className="small">
                  Log in to write a review.
                </div>
              )}

              <div className="divider" />

              {reviews.length ? (
                <div className="stack-14">
                  {reviews.map((r) => (
                    <div key={r._id} className="card card-pad">
                      <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                        <div style={{ color: "var(--paper)" }}>{r.alias}</div>
                        <div className="small">Rating: {r.rating}/5</div>
                      </div>
                      {r.text ? <div className="small" style={{ marginTop: 8 }}>{r.text}</div> : null}
                      <div className="small" style={{ marginTop: 8, color: "var(--subtle)" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="small">No reviews yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
