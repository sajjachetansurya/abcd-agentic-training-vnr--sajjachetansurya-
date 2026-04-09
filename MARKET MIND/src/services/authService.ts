interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    createdAt: string;
  };
}

const apiFetch = async (path: string, options: RequestInit = {}, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error((body && body.error) || response.statusText || 'Request failed');
  }

  return response.json();
};

export async function login(username: string, password: string) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }) as Promise<AuthResponse>;
}

export async function register(username: string, password: string) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }) as Promise<AuthResponse>;
}

export async function fetchMe(token: string) {
  return apiFetch('/api/auth/me', {
    method: 'GET',
  }, token) as Promise<{ user: { id: number; username: string; createdAt: string } }>;
}

export async function logout(token: string) {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
  }, token);
}

export async function fetchHistory(token: string) {
  return apiFetch('/api/history', {
    method: 'GET',
  }, token) as Promise<{ history: Array<{ id: number; topic: string; summary: string; createdAt: string }> }>;
}

export async function saveHistory(token: string, topic: string, summary: string) {
  return apiFetch('/api/history', {
    method: 'POST',
    body: JSON.stringify({ topic, summary }),
  }, token);
}
