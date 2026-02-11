"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const CATEGORIES = ["crochet", "beanie", "blanket", "candle", "diffuser", "soap", "fragrance", "painting", "software", "other"];

export default function AdminEditProductPage({ params }) {
  const { id } = params;
  const { user, loading } = useAuth();

  const [p, setP] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const load = async () => {
    if (!user) return;
    setError("");
    setInfo("");
    try {
      const token = await user.getIdToken(true);
      // we can reuse public endpoint by slug, but here we need by id. Quick: fetch list and find.
      // Better later: create admin GET /admin/products/:id.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      const found = (data.items || []).find((x) => x._id === id);
      if (!found) throw new Error("Not found.");
      // fetch full product by slug from public route
      const full = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${found.slug}`);
      const fd = await full.json();
      if (!full.ok) throw new Error(fd?.error || "Failed to load product detail");
      setP(fd);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const patch = async (update) => {
    if (!user) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const token = await user.getIdToken(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setP(data.product);
      setInfo("Saved.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    if (!confirm("Delete this product?")) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const token = await user.getIdToken(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      window.location.href = "/admin";
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  if (loading) {
    return <main className="section"><div className="container"><div className="small">Loading…</div></div></main>;
  }
  if (!user) {
    return <main className="section"><div className="container"><div className="small">Log in.</div></div></main>;
  }
  if (!p) {
    return <main className="section"><div className="container">{error ? <div className="error">{error}</div> : <div className="small">Loading…</div>}</div></main>;
  }

  return (
    <main className="section">
      <div className="container">
        <div className="stack-18">
          <div className="stack-6">
            <div className="kicker">Admin</div>
            <h1 className="h2" style={{ margin: 0 }}>Edit Product</h1>
            <div className="small">{p.title}</div>
          </div>

          {error ? <div className="error">{error}</div> : null}
          {info ? <div className="help">{info}</div> : null}

          <div className="card card-pad">
            <div className="stack-14">
              <div className="kicker">Core</div>

              <div className="row" style={{ alignItems: "flex-end", flexWrap: "wrap" }}>
                <div className="field" style={{ flex: "1 1 320px" }}>
                  <div className="label">Title</div>
                  <input className="input" value={p.title || ""} onChange={(e) => setP({ ...p, title: e.target.value })} />
                </div>

                <div className="field" style={{ width: 220 }}>
                  <div className="label">Slug</div>
                  <input className="input" value={p.slug || ""} onChange={(e) => setP({ ...p, slug: e.target.value })} />
                </div>

                <div className="field" style={{ width: 200 }}>
                  <div className="label">Category</div>
                  <select className="select" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="row" style={{ alignItems: "flex-end", flexWrap: "wrap" }}>
                <div className="field" style={{ width: 160 }}>
                  <div className="label">Price</div>
                  <input className="input" value={String(p.price ?? "")} onChange={(e) => setP({ ...p, price: e.target.value })} />
                </div>

                <div className="field" style={{ width: 180 }}>
                  <div className="label">Inventory</div>
                  <input className="input" value={String(p.inventory ?? 0)} onChange={(e) => setP({ ...p, inventory: e.target.value })} />
                </div>

                <div className="field" style={{ width: 180 }}>
                  <div className="label">In stock</div>
                  <select className="select" value={p.inStock ? "true" : "false"} onChange={(e) => setP({ ...p, inStock: e.target.value === "true" })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="field" style={{ width: 180 }}>
                  <div className="label">Published</div>
                  <select className="select" value={p.published ? "true" : "false"} onChange={(e) => setP({ ...p, published: e.target.value === "true" })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="label">Hero Image URL</div>
                <input className="input" value={p.heroImage || ""} onChange={(e) => setP({ ...p, heroImage: e.target.value })} />
              </div>

              <div className="field">
                <div className="label">Subtitle</div>
                <input className="input" value={p.subtitle || ""} onChange={(e) => setP({ ...p, subtitle: e.target.value })} />
              </div>

              <div className="field">
                <div className="label">Description</div>
                <textarea className="textarea" rows={4} value={p.description || ""} onChange={(e) => setP({ ...p, description: e.target.value })} />
              </div>

              <div className="field">
                <div className="label">Tags (comma separated)</div>
                <input
                  className="input"
                  value={(p.tags || []).join(", ")}
                  onChange={(e) => setP({ ...p, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={() =>
                  patch({
                    title: p.title,
                    slug: p.slug,
                    subtitle: p.subtitle,
                    category: p.category,
                    price: Number(p.price),
                    inventory: Number(p.inventory),
                    inStock: p.inStock,
                    published: p.published,
                    heroImage: p.heroImage,
                    description: p.description,
                    tags: p.tags,
                  })
                }
                disabled={busy}
              >
                {busy ? "Saving…" : "Save core"}
              </button>
            </div>
          </div>

          <div className="card card-pad">
            <div className="stack-14">
              <div className="kicker">Transparency</div>

              {/** Keep transparency object safe */}
              <div className="row" style={{ flexWrap: "wrap", alignItems: "flex-end" }}>
                {["materialsCost", "laborHours", "laborValue", "overheadCost", "packagingCost", "donationPercent"].map((k) => (
                  <div key={k} className="field" style={{ width: 200 }}>
                    <div className="label">{k}</div>
                    <input
                      className="input"
                      value={String(p.transparency?.[k] ?? "")}
                      onChange={(e) =>
                        setP({
                          ...p,
                          transparency: { ...(p.transparency || {}), [k]: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="field">
                <div className="label">Where money goes</div>
                <textarea
                  className="textarea"
                  rows={3}
                  value={p.transparency?.whereMoneyGoes || ""}
                  onChange={(e) =>
                    setP({
                      ...p,
                      transparency: { ...(p.transparency || {}), whereMoneyGoes: e.target.value },
                    })
                  }
                />
              </div>

              <div className="field">
                <div className="label">Notes</div>
                <textarea
                  className="textarea"
                  rows={3}
                  value={p.transparency?.notes || ""}
                  onChange={(e) =>
                    setP({
                      ...p,
                      transparency: { ...(p.transparency || {}), notes: e.target.value },
                    })
                  }
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={() =>
                  patch({
                    transparency: {
                      ...(p.transparency || {}),
                      materialsCost: Number(p.transparency?.materialsCost || 0),
                      laborHours: Number(p.transparency?.laborHours || 0),
                      laborValue: Number(p.transparency?.laborValue || 0),
                      overheadCost: Number(p.transparency?.overheadCost || 0),
                      packagingCost: Number(p.transparency?.packagingCost || 0),
                      donationPercent: Number(p.transparency?.donationPercent || 0),
                      whereMoneyGoes: String(p.transparency?.whereMoneyGoes || ""),
                      notes: String(p.transparency?.notes || ""),
                    },
                  })
                }
                disabled={busy}
              >
                {busy ? "Saving…" : "Save transparency"}
              </button>
            </div>
          </div>

          <div className="card card-pad">
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div className="kicker">Danger zone</div>
              <button className="btn" onClick={remove} disabled={busy}>
                Delete product
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
