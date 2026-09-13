import axios from 'axios';

export interface CartItem {
  _id: string;
  userId: string;
  itemId: string;
  category: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AddToCartPayload {
  itemId: string;
  category: string;
  title: string;
  price: number;
  image: string;
}

export interface ShowCartResponse {
  cartItems: CartItem[];
  totalPrice: number;
}

export interface CartItemCountResponse {
  count: number;
}

export async function addToCart(payload: AddToCartPayload) {
  const res = await axios.post("/api/Addtocarts", payload);
  return res.data;
}

export async function showCart(): Promise<ShowCartResponse> {
  const res = await axios.get<ShowCartResponse>("/api/ShowCart");
  return res.data;
}

export async function countCartItems(): Promise<number> {
  const res = await axios.get<CartItemCountResponse>("/api/countCartItems");
  return res.data.count;
}

export async function removeFromCart(itemTitle: string) {
  const res = await axios.delete(`/RemoveFromCart/${encodeURIComponent(itemTitle)}`);
  return res.data;
}
