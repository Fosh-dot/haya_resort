const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://haya-resort.onrender.com"
).replace(/\/+$/, "");

const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const TOKEN_KEY = "haya_admin_token";
const ADMIN_KEY = "haya_admin";

export async function loginAdmin(email, password) {
  let response;

  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch (error) {
    throw new Error(
      "Unable to connect to the Haya Resort server. Please try again.",
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Unable to log in.");
  }

  if (!data.token) {
    throw new Error("Login succeeded without a valid authentication token.");
  }

  localStorage.setItem(TOKEN_KEY, data.token);

  if (data.admin) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
  }

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
