const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('lumen_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...(options?.headers as Record<string, string>) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'خطای سرور');
  return data;
}

export const api = {
  // Products
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ products: any[] }>(`/products${qs}`);
  },
  getProduct: (id: string) => request<{ product: any }>(`/products/${id}`),
  createProduct: (data: any) => request<{ product: any }>(`/products`, { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request<{ product: any }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request<{ categories: any[] }>(`/categories`),
  createCategory: (data: any) => request<{ category: any }>(`/categories`, { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => request<{ category: any }>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<{ ok: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

  // Kits
  getKits: () => request<{ kits: any[] }>(`/kits`),
  createKit: (data: any) => request<{ kit: any }>(`/kits`, { method: 'POST', body: JSON.stringify(data) }),
  updateKit: (id: string, data: any) => request<{ kit: any }>(`/kits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteKit: (id: string) => request<{ ok: boolean }>(`/kits/${id}`, { method: 'DELETE' }),

  // Editorial
  getEditorial: () => request<{ editorial: any[] }>(`/editorial`),
  createEditorial: (data: any) => request<{ editorial: any }>(`/editorial`, { method: 'POST', body: JSON.stringify(data) }),
  updateEditorial: (id: string, data: any) => request<{ editorial: any }>(`/editorial/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEditorial: (id: string) => request<{ ok: boolean }>(`/editorial/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: () => request<{ testimonials: any[] }>(`/testimonials`),
  createTestimonial: (data: any) => request<{ testimonial: any }>(`/testimonials`, { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id: string, data: any) => request<{ testimonial: any }>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id: string) => request<{ ok: boolean }>(`/testimonials/${id}`, { method: 'DELETE' }),

  // Auth
  login: (email: string, password: string) => request<{ token: string; user: any }>(`/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request<{ user: any }>(`/auth/me`),

  // Settings
  getUsers: () => request<{ users: any[] }>(`/settings`),
  changePassword: (current_password: string, new_password: string) => request<{ ok: boolean }>(`/settings/password`, { method: 'PUT', body: JSON.stringify({ current_password, new_password }) }),
  addAdmin: (data: any) => request<{ user: any }>(`/settings/admins`, { method: 'POST', body: JSON.stringify(data) }),
  transferOwnership: (new_owner_email: string) => request<{ ok: boolean }>(`/settings/transfer-ownership`, { method: 'POST', body: JSON.stringify({ new_owner_email, confirm: 'TRANSFER_OWNERSHIP' }) }),
  revokeAdmin: (id: string) => request<{ ok: boolean }>(`/settings/admins/${id}`, { method: 'DELETE' }),

  // Newsletter
  subscribe: (email: string) => request<{ ok: boolean; message: string }>(`/newsletter/subscribe`, { method: 'POST', body: JSON.stringify({ email }) }),

  // Upload
  uploadImage: async (file: File): Promise<string> => {
    const token = localStorage.getItem('lumen_token');
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'خطا در آپلود');
    return data.url;
  },
};
