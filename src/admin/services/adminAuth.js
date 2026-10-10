const API_URL = "http://localhost:5000/api";

const TOKEN_KEY = "haya_admin_token";
const ADMIN_KEY = "haya_admin";

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to log in.");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));

  return data;
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdmin() {
  const admin = localStorage.getItem(ADMIN_KEY);

  if (!admin) {
    return null;
  }

  try {
    return JSON.parse(admin);
  } catch {
    return null;
  }
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}
