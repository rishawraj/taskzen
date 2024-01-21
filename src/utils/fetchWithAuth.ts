const VITE_BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const fetchWithAuth = async <T>(
  endpoint: string,
  method: Methods = Methods.GET,
  body?: any
): Promise<T> => {
  try {
    const jwtToken = localStorage.getItem("jwtToken") || "";

    const headers: HeadersInit = {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
      body,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}${endpoint}`,
      options
    );

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
};

export { fetchWithAuth };
