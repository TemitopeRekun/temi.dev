
function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export async function uploadFile(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiBaseUrl()}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", res.status, errorText);
    throw new Error(`Failed to upload file: ${res.statusText} (${res.status})`);
  }

  const data = await res.json();
  // Ensure the URL is absolute or properly relative. 
  // The backend returns `/uploads/filename`.
  // If we want to display it, we might need the full URL if it's served from the API.
  // Since we set up static serving on the API, we can prepend the API base URL.
  return `${apiBaseUrl()}${data.url}`;
}
