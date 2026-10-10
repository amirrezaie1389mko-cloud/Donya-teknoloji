export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  category_id: number | null;
  category_name?: string;
  category_slug?: string;
  inventory: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_published: boolean;
  rating: number;
  review_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Kit {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  is_published: boolean;
  sort_order: number;
}

export interface Editorial {
  id: number;
  category_label: string;
  title: string;
  image_url: string;
  read_time: string;
  is_published: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  avatar_url: string;
  is_published: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'OWNER' | 'AUTHORIZED_ADMIN' | 'CUSTOMER';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
