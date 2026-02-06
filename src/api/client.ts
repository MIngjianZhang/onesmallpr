export const apiClient = {
  async get(endpoint: string) {
    const res = await fetch(`/api${endpoint}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${res.statusText}`);
    }
    return res.json();
  },
  
  async post(endpoint: string, body: any) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${res.statusText}`);
    }
    return res.json();
  }
};
