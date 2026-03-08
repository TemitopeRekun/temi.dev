
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
  const url = data.url;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  return `${apiBaseUrl()}${url}`;
}
