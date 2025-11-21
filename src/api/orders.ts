// src/api/orders.ts
import { post } from "./client";
import type { Order, OrderCreate } from "./type";

export function createOrder(order: OrderCreate) {
  return post<Order>("/orders", order);
}
