export async function getIsAdmin(user) {
  if (!user) return false;
  const token = await user.getIdTokenResult();
  return !!token.claims?.admin;
}
