"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const CATEGORIES = ["crochet", "beanie", "blanket", "candle", "diffuser", "soap", "fragrance", "painting", "software", "other"];

export default function AdminPage() {
  const { user, loading } = useAuth();

  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // create form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("candle");
  const [price, setPrice] = useState("28");
  const [published, setPublished] = useState(true);

  const load = async () => {
    if (!user) return;
    setError("");
    try {
      const token = await user.getIdToken(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load admin products");
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createProduct = async () => {
    if (!user) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const token = await user.getIdToken(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          price: Number(price),
          published,
          inStock: true,
          inventory: 0,
          transparency: { donationPercent: 0 },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create product");
      setInfo("Created.");
      setTitle("");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="section">
        <div className="container"><div className="small">Loading…</div></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="section">
        <div className="container">
          <div className="card card-pad" style={{ maxWidth: 820 }}>
            <h1 className="h2">Admin</h1>
            <div className="small">Log in with your admin account.</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="stack-18">
          <div className="stack-6">
            <div className="kicker">Admin</div>
            <h1 className="h2" style={{ margin: 0 }}>Products</h1>
            <div className="small">Create and manage products (including transparency fields).</div>
          </div>

          {error ? <div className="error">{error}</div> : null}
          {info ? <div className="help">{info}</div> : null}

          <div className="card card-pad">
            <div className="stack-14">
              <div className="kicker">Create product</div>

              <div className="row" style={{ alignItems: "flex-end", flexWrap: "wrap" }}>
                <div className="field" style={{ flex: "1 1 260px" }}>
                  <div className="label">Title</div>
                  <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="field" style={{ width: 200 }}>
                  <div className="label">Category</div>
                  <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="field" style={{ width: 140 }}>
                  <div className="label">Price</div>
                  <input className="input" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className="field" style={{ width: 160 }}>
                  <div className="label">Published</div>
                  <select
                    className="select"
                    value={published ? "true" : "false"}
                    onChange={(e) => setPublished(e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <button className="btn btn-primary" onClick={createProduct} disabled={busy || !title.trim()}>
                  {busy ? "Creating…" : "Create"}
                </button>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div className="kicker">All products</div>
              <button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button>
            </div>

            <div className="divider" />

            <div className="stack-10">
              {items.map((p) => (
                <Link
                  key={p._id}
                  href={`/admin/products/${p._id}`}
                  className="card card-pad"
                  style={{ textDecoration: "none" }}
                >
                  <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                    <div className="stack-6">
                      <div style={{ color: "var(--paper)", fontSize: 16 }}>{p.title}</div>
                      <div className="small">{p.category} • {p.published ? "published" : "draft"}</div>
                    </div>
                    <div className="small">${Number(p.price).toFixed(2)}</div>
                  </div>
                </Link>
              ))}
              {!items.length ? <div className="small">No products yet.</div> : null}
            </div>
          </div>

          <div className="small">
            Note: If you see “Admin only”, your token doesn’t have the admin claim yet—log out/in after setting it.
          </div>
        </div>
      </div>
    </main>
  );
}
