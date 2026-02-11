import Link from "next/link";

export default function ProductCard({ p }) {
  return (
    <Link href={`/products/${p.slug}`} className="card card-pad" style={{ textDecoration: "none" }}>
      <div className="stack-10">
        <div
          style={{
            borderRadius: "14px",
            border: "1px solid rgba(244,245,247,0.10)",
            background: "rgba(244,245,247,0.03)",
            height: 180,
            overflow: "hidden",
          }}
        >
          {p.heroImage ? (
            <div
              style={{
                height: "100%",
                backgroundImage: `url("${p.heroImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(0.95) contrast(1.02)",
              }}
            />
          ) : null}
        </div>

        <div className="stack-6">
          <div className="kicker">{p.category}</div>
          <div style={{ fontSize: 18, color: "var(--paper)" }}>{p.title}</div>
          {p.subtitle ? <div className="small">{p.subtitle}</div> : null}
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <div style={{ color: "var(--paper)" }}>${p.price.toFixed(2)}</div>
          <div className="small">{p.inStock ? "In stock" : "Out of stock"}</div>
        </div>
      </div>
    </Link>
  );
}
