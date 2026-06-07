async function fetchData(url) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(`${url} Response:`, data);
    } else {
      const text = await response.text();
      console.log(`${url} returned non-JSON response:\n`, text);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

// Health check
fetchData("http://localhost:5000/api/health");

// Example API
fetchData("http://localhost:5000/api/users");
