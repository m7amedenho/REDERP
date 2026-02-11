// import axios from "axios";
// import { getCookie, setCookie, deleteCookie } from "cookies-next";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7000/api";

// export const api = axios.create({
//   baseURL: API_URL,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   const token = getCookie("accessToken");
//   const orgUnitId = getCookie("orgUnitId");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   if (orgUnitId) config.headers["X-OrgUnitId"] = orgUnitId;
//   config.headers["X-Correlation-Id"] = crypto.randomUUID();

//   return config;
// });

// // Refresh on 401 مرة واحدة
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config;
//     if (error?.response?.status === 401 && !original?._retry) {
//       original._retry = true;
//       try {
//         const refreshToken = getCookie("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token");

//         const r = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
//         const { accessToken, refreshToken: newRt } = r.data;

//         setCookie("accessToken", accessToken, { maxAge: 60 * 60 * 24 * 7 });
//         if (newRt)
//           setCookie("refreshToken", newRt, { maxAge: 60 * 60 * 24 * 14 });

//         original.headers.Authorization = `Bearer ${accessToken}`;
//         return api.request(original);
//       } catch {
//         deleteCookie("accessToken");
//         deleteCookie("refreshToken");
//       }
//     }
//     return Promise.reject(error);
//   },
// );


import axios, { AxiosError } from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE}/api`;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function safeUUID() {
  try {
    // في المتصفح
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {}
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  const orgUnitId = getCookie("orgUnitId");

  config.headers = config.headers || {};

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (orgUnitId) config.headers["X-OrgUnitId"] = orgUnitId;

  // Correlation for audit/debug
  config.headers["X-Correlation-Id"] = safeUUID();

  return config;
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function runQueue(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

async function refreshAccessToken() {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  // IMPORTANT: use plain axios (no interceptors)
  const r = await axios.post(
    `${API_URL}/auth/refresh`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } }
  );

  const { accessToken, refreshToken: newRt } = r.data || {};
  if (!accessToken) throw new Error("Refresh response missing accessToken");

  const COOKIE_OPTS = {
  path: "/",
  sameSite: "lax" as const,
  secure: false, // لأنك مش HTTPS
};

setCookie("accessToken", accessToken, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 7 });
if (newRt) setCookie("refreshToken", newRt, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 14 });

  return accessToken as string;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config;

    if (error?.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      // لو فيه refresh شغال، نستنى دوره
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (!token) return reject(error);
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api.request(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        runQueue(newToken);

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;

        return api.request(original);
      } catch (e) {
        runQueue(null);
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        // رجّع المستخدم للوجين
        if (typeof window !== "undefined") window.location.href = "/sign-in";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
