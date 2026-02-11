import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7000";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function getTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_tokens");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

function setTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_tokens", JSON.stringify(tokens));
}

function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_tokens");
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// attach access token
http.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function refreshAccessToken() {
  const tokens = getTokens();
  if (!tokens?.refreshToken) throw new Error("No refresh token");

  // IMPORTANT: use a plain axios without interceptors to avoid loop
  const res = await axios.post(
    `${API_BASE_URL}/api/auth/refresh`,
    { refreshToken: tokens.refreshToken },
    { headers: { "Content-Type": "application/json" } }
  );

  // توقع شكل الرد: { accessToken, refreshToken }
  const newTokens = res.data as AuthTokens;
  setTokens(newTokens);
  return newTokens.accessToken;
}

// response interceptor: refresh on 401 once
http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as any;

    if (err.response?.status === 401 && !original?._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) return reject(err);
            original.headers.Authorization = `Bearer ${token}`;
            resolve(http(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        processQueue(token);
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      } catch (e) {
       
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export function apiErrorMessage(e: any) {
  if (axios.isAxiosError(e)) {
    const msg =
      (e.response?.data as any)?.message ||
      (e.response?.data as any)?.error ||
      e.message;
    return msg || "حدث خطأ";
  }
  return e?.message || "حدث خطأ";
}

export { getTokens, setTokens, clearTokens };
