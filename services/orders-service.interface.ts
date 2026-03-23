import type { OrderDTO } from "@/dtos";

export interface OrdersService {
  getOrders(userId: string): Promise<OrderDTO[]>;
  checkout(userId: string): Promise<OrderDTO>;
}
