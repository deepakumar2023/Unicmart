const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'unicmart.inderapi.online/api/';

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const isFormData = options.body instanceof FormData;

  const config = {
    method: options.method || 'GET',
    headers: isFormData
      ? options.headers || {} // ⛔ Don't set Content-Type for FormData
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
    next: {
      cache: options.cache || 'force-cache',
      revalidate: options.revalidate || undefined,
    },
  };

  try {
    const res = await fetch(url, config);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fetch error: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    return contentType?.includes("application/json") ? res.json() : res.text();
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw err;
  }
}
