"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "crochet", label: "Crochet" },
  { value: "beanie", label: "Beanies" },
  { value: "blanket", label: "Blankets" },
  { value: "candle", label: "Candles" },
  { value: "diffuser", label: "Diffusers" },
  { value: "soap", label: "Soap" },
  { value: "fragrance", label: "Fragrance" },
  { value: "painting", label: "Paintings" },
  { value: "software", label: "Software" },
  { value: "other", label: "Other" },
];

function buildQuery(params, patch) {
  const next = new URLSearchParams(params.toString());
  Object.entries(patch).forEach(([k, v]) => {
    if (v === "" || v === null || typeof v === "undefined") next.delete(k);
    else next.set(k, String(v));
  });
  return next.toString();
}

export default function ProductsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const inStock = params.get("inStock") || "";
  const sort = params.get("sort") || "new";

  const apiUrl = useMemo(() => {
    const sp = new URLSearchParams(params.toString());
    if (!sp.get("limit")) sp.set("limit", "24");
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?${sp.toString()}`;
  }, [params]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load products");
        if (!alive) return;
        setItems(data.items || []);
        setMeta({ total: data.total, page: data.page, pages: data.pages });
      } catch (e) {
        if (!alive) return;
        setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => { alive = false; };
  }, [apiUrl]);

  const setFilter = (patch) => {
    const next = buildQuery(params, { ...patch, page: "1" });
    router.push(`/products?${next}`);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="stack-18">
          <div className="stack-6">
            <div className="kicker">Products</div>
            <h1 className="h2" style={{ margin: 0 }}>Catalog</h1>
            <div className="small">Filter and explore handcrafted goods and projects.</div>
          </div>

          <div className="card card-pad">
            <div className="row" style={{ alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="field" style={{ flex: "1 1 220px" }}>
                <div className="label">Search</div>
                <input
                  className="input"
                  value={q}
                  onChange={(e) => setFilter({ q: e.target.value })}
                  placeholder="candles, beanies, cedar, etc."
                />
              </div>

              <div className="field" style={{ flex: "1 1 180px" }}>
                <div className="label">Category</div>
                <select
                  className="select"
                  value={category}
                  onChange={(e) => setFilter({ category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ width: 130 }}>
                <div className="label">Min $</div>
                <input
                  className="input"
                  value={minPrice}
                  onChange={(e) => setFilter({ minPrice: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="field" style={{ width: 130 }}>
                <div className="label">Max $</div>
                <input
                  className="input"
                  value={maxPrice}
                  onChange={(e) => setFilter({ maxPrice: e.target.value })}
                  placeholder="250"
                />
              </div>

              <div className="field" style={{ flex: "0 0 160px" }}>
                <div className="label">In stock</div>
                <select
                  className="select"
                  value={inStock}
                  onChange={(e) => setFilter({ inStock: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="true">In stock</option>
                  <option value="false">Out of stock</option>
                </select>
              </div>

              <div className="field" style={{ flex: "0 0 170px" }}>
                <div className="label">Sort</div>
                <select
                  className="select"
                  value={sort}
                  onChange={(e) => setFilter({ sort: e.target.value })}
                >
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>

            <div className="divider" />

            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div className="small">
                {loading ? "Loading…" : `${meta.total} items`}
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => router.push("/products")}
              >
                Clear filters
              </button>
            </div>
          </div>

          {error ? <div className="error">{error}</div> : null}

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {items.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>

          {!loading && items.length === 0 ? (
            <div className="small">No products match those filters.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
