"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseClient";
import { apiFetch } from "@/lib/apiClient";

import { ensureProfile } from "@/lib/ensureProfile";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const onEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await ensureProfile(cred.user);
      window.location.href = "/account";
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const onGoogleLogin = async () => {
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureProfile(cred.user);
      window.location.href = "/account";
    } catch (err) {
      setError(err?.message || "Google login failed");
    } finally {
      setBusy(false);
    }
  };

  const onForgotPassword = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email first, then click ‘Forgot password’.");
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset email sent (check your inbox).");
    } catch (err) {
      setError(err?.message || "Could not send reset email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card card-pad" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="stack-14">
        <div className="kicker">Welcome back</div>
        <h1 className="h2" style={{ marginBottom: 0 }}>
          Log in
        </h1>
        <p className="small" style={{ marginTop: 0 }}>
          Log in to comment, review products, and manage your account.
        </p>

        <button className="btn" onClick={onGoogleLogin} disabled={busy}>
          Continue with Google
        </button>

        <div className="divider" />

        <form className="stack-14" onSubmit={onEmailLogin}>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          {error ? <div className="error">{error}</div> : null}
          {info ? <div className="help">{info}</div> : null}

          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Signing in..." : "Log in"}
            </button>

            <button className="btn btn-ghost" type="button" onClick={onForgotPassword} disabled={busy}>
              Forgot password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
