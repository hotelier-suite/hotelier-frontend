import { authCookies } from "../auth-cookies";

// For server-side requests (SSR), use internal Docker service name
// For client-side requests, use the public URL accessible from browser
export const getAPIBaseURL = () => {
  // Check if we're on the server (Node.js environment)
  if (typeof window === "undefined") {
    // Server-side: use internal Docker service name
    const internalUrl = process.env.INTERNAL_API_URL;
    if (!internalUrl) {
      console.warn("INTERNAL_API_URL not set, falling back to default");
      return "http://backend:3001/api";
    }
    return internalUrl;
  }

  // Client-side: detect environment and use appropriate URL
  // Check if we're in GitHub Codespaces
  const hostname = window.location.hostname;
  if (hostname.includes("app.github.dev")) {
    // We're in Codespaces - construct the API URL
    const codespaceUrl = hostname.replace("-3000.", "-3001.");
    return `https://${codespaceUrl}/api`;
  }

  // Otherwise use the environment variable or localhost
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!publicUrl) {
    console.warn("NEXT_PUBLIC_API_URL not set, falling back to localhost");
    return "http://localhost:3001/api";
  }
  return publicUrl;
};

// Don't cache the URL - evaluate it each time
export interface RequestOptions extends RequestInit {
  body?: string;
  responseType?: "json" | "blob" | "text";
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = authCookies.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${getAPIBaseURL()}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      // Update stored tokens
      authCookies.setTokens(data.accessToken, data.refreshToken);

      return data.accessToken;
    } catch {
      // Clear invalid tokens
      authCookies.clearAll();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${getAPIBaseURL()}${endpoint}`;
  const isAuthEndpoint =
    endpoint.includes("/auth/login") || endpoint.includes("/auth/register");

  // Get the access token using the authCookies helper
  let authHeader = {};
  const token = authCookies.getAccessToken();
  if (token) {
    authHeader = { Authorization: `Bearer ${token}` };
  }

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // If we get a 401, try to refresh the token
      if (
        response.status === 401 &&
        !endpoint.includes("/auth/refresh") &&
        !isAuthEndpoint
      ) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the original request with the new token
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };

          const retryResponse = await fetch(url, retryConfig);
          if (retryResponse.ok) {
            // Handle empty responses
            if (
              retryResponse.status === 204 ||
              retryResponse.headers.get("content-length") === "0"
            ) {
              return {} as T;
            }
            return await retryResponse.json();
          }
        }

        // If refresh failed or retry failed, let the UI decide how to handle it
      }

      // Intentionally avoid console.error here to prevent Next/Turbopack overlay noise.
      // Errors are surfaced to the UI via thrown exceptions and handled by callers.
      if (![401, 409, 422].includes(response.status) && !isAuthEndpoint) {
        console.debug(`API request failed:`, {
          url,
          method: config.method || "GET",
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }

      // Try to get error details from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();

        // Try to parse as JSON to get structured error
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch {
          // If not JSON, use the text as is
          if (errorText.trim()) {
            errorMessage = errorText;
          }
        }
      } catch {
        console.debug("Could not read error response body");
      }

      // Add specific error messages for common HTTP status codes
      if (response.status === 403) {
        errorMessage =
          "Access denied. You don't have permission to perform this action.";
      } else if (response.status === 401 && !isAuthEndpoint) {
        errorMessage = "Authentication required. Please login again.";
      } else if (response.status === 404) {
        errorMessage = "The requested resource was not found.";
      }

      throw new Error(errorMessage);
    }

    // Handle empty responses (like DELETE requests)
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    // Handle different response types
    if (options.responseType === "blob") {
      return response.blob() as Promise<T>;
    } else if (options.responseType === "text") {
      return response.text() as Promise<T>;
    }
    return response.json();
  } catch (error: unknown) {
    // Avoid console noise for expected auth failures (e.g. wrong credentials)
    if (!isAuthEndpoint) {
      if (
        !(error instanceof Error) ||
        (!error.message?.includes("not available") &&
          !error.message?.includes("validation failed"))
      ) {
        console.debug(`API request failed for ${endpoint}:`, error);
      }
    }
    throw error;
  }
}

export function createApiEndpoints<
  T,
  CreateT = Omit<T, "id" | "createdAt" | "updatedAt">,
  UpdateT = Partial<CreateT>,
>(basePath: string) {
  return {
    getAll: (): Promise<T[]> => apiRequest(`${basePath}`),
    getById: (id: number): Promise<T> => apiRequest(`${basePath}/${id}`),
    create: (data: CreateT): Promise<T> =>
      apiRequest(`${basePath}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: UpdateT): Promise<T> =>
      apiRequest(`${basePath}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: number): Promise<void> =>
      apiRequest(`${basePath}/${id}`, { method: "DELETE" }),
  };
}
