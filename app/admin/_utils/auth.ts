// Helper para los headers de autenticación de las llamadas al backend del admin.
// Antes cada fetch repetía `{ Authorization: ` + "`Bearer ${session.access_token}`" + ` }`.
// Pasa `json: true` cuando el request lleva body JSON (POST/PUT/PATCH).

export const authHeaders = (
  token: string,
  json: boolean = false,
): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
  ...(json ? { "Content-Type": "application/json" } : {}),
});
