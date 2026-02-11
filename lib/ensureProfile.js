import { apiFetch } from "@/lib/apiClient";

export async function ensureProfile(firebaseUser) {
  const token = await firebaseUser.getIdToken(true);
  return apiFetch("/users/ensure", { method: "POST", token });
}
