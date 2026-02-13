// // src/lib/wp.js
// const API_URL = import.meta.env.WORDPRESS_API_URL;

// export async function fetchWordPress(query) {
//   const res = await fetch(API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ query }),
//   });
//   return await res.json();
// }

const wpCache = new Map();
export async function queryWordPress(query, variables = {}) {
  const endpoint = import.meta.env.WORDPRESS_API_URL || "http://my-astro-backend.local/graphql";
  const cacheKey = JSON.stringify({ query, variables });
  if (wpCache.has(cacheKey)) {
    return wpCache.get(cacheKey);
  }
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Astro-SSR-Bot)",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    
    if (json.errors) {
      return null;
    }
    wpCache.set(cacheKey, json.data);
    return json.data;
  } catch (error) {
    return null;
  }
}