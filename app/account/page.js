"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/apiClient";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [alias, setAlias] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const canSave = useMemo(() => {
    if (!profile) return false;
    const next = alias.trim();
    return next.length >= 3 && next !== profile.alias;
  }, [alias, profile]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      setError("");
      setInfo("");
      try {
        const token = await user.getIdToken();
        const me = await apiFetch("/users/me", { token });
        setProfile(me);
        setAlias(me.alias || "");
      } catch (e) {
        setError(e.message);
      }
    };
    run();
  }, [user]);

  const onSaveAlias = async () => {
    if (!user || !canSave) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const token = await user.getIdToken();
      const res = await apiFetch("/users/me", {
        method: "PATCH",
        token,
        body: { alias },
      });

      // res.user.alias
      const token2 = await user.getIdToken(true);
      void token2;

      setProfile((p) => ({ ...p, alias: res.user.alias }));
      setAlias(res.user.alias);
      setInfo("Alias updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
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

  if (!user) {
    return (
      <main className="section">
        <div className="container">
          <div className="card card-pad" style={{ maxWidth: 720 }}>
            <h1 className="h2">Account</h1>
            <p className="small">You’re not logged in.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card card-pad" style={{ maxWidth: 720 }}>
          <div className="stack-18">
            <div className="stack-6">
              <div className="kicker">Account</div>
              <h1 className="h2" style={{ margin: 0 }}>Manage</h1>
              <div className="small">Signed in as {user.email || "Google user"}</div>
            </div>

            <div className="divider" />

            <div className="stack-14">
              <div className="kicker">Alias</div>
              <div className="small" style={{ marginTop: -6 }}>
                Your alias is public on reviews and comments. Use lowercase letters, numbers, and dashes.
              </div>

              <div className="field">
                <div className="label">Alias</div>
                <input
                  className="input"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  disabled={!profile || busy}
                  placeholder="member-1234"
                />
                <div className="help">
                  Current: <span style={{ color: "var(--paper)" }}>{profile?.alias || "…"}</span>
                </div>
              </div>

              {error ? <div className="error">{error}</div> : null}
              {info ? <div className="help">{info}</div> : null}

              <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={onSaveAlias}
                  disabled={!canSave || busy}
                >
                  {busy ? "Saving..." : "Save alias"}
                </button>

                <button className="btn btn-ghost" type="button" onClick={logout} disabled={busy}>
                  Log out
                </button>
              </div>
            </div>

            <div className="divider" />

            <div className="small">
              Next: orders, reviews, comment history, and counters (“life tracker”) can live here.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
