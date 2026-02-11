"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseClient";
import { apiFetch } from "@/lib/apiClient";

import { ensureProfile } from "@/lib/ensureProfile";


export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await ensureProfile(cred.user);
      window.location.href = "/account";
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  const onGoogleSignup = async () => {
    setError("");
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureProfile(cred.user);
      window.location.href = "/account";
    } catch (err) {
      setError(err?.message || "Google signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card card-pad" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="stack-14">
        <div className="kicker">Create account</div>
        <h1 className="h2" style={{ marginBottom: 0 }}>
          Sign up
        </h1>
        <p className="small" style={{ marginTop: 0 }}>
          Your account will be assigned a unique alias automatically. You can change it later in your account settings.
        </p>

        <button className="btn" onClick={onGoogleSignup} disabled={busy}>
          Continue with Google
        </button>

        <div className="divider" />

        <form className="stack-14" onSubmit={onEmailSignup}>
          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={busy}
            />
            <div className="help">Minimum 6 characters.</div>
          </div>

          {error ? <div className="error">{error}</div> : null}

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
