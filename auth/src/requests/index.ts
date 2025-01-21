const BASE_URL = "http://backend-fiap.duckdns.org:3000";

const getAuthToken = (): string => {
  return localStorage.getItem("authToken") || "";
};

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

const api = {
  get: async <T>(endpoint: string): Promise<T> =>
    request<T>(endpoint, {
      method: "GET",
    }),

  post: async <T>(endpoint: string, payload: unknown): Promise<T> =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  put: async <T>(endpoint: string, payload: unknown): Promise<T> =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: async <T>(endpoint: string): Promise<T> =>
    request<T>(endpoint, {
      method: "DELETE",
    }),
};

export default api;
