import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
});

// Global Auth & Error Interceptor
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = localStorage.getItem("access_token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      // Handle logout/redirect
      console.warn("Session expired. Redirecting...");
    }
    return response;
  },
};

api.use(authMiddleware);