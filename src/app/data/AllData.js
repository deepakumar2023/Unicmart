const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apex-dev-api.aitechustel.com/api/';

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    // ✅ Add Next.js specific caching instruction
    next: {
      cache: options.cache || 'force-cache',  // ✅ Default to static build friendly
      revalidate: options.revalidate || undefined, // optional for ISR
    },
  };

  try {
    const res = await fetch(url, config);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fetch error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw err;
  }
}