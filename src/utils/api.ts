const VITE_BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

const fetchWithAuth = async <T>(
  endpoint: string,
  method: string = "GET",
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

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
};

export default fetchWithAuth;
