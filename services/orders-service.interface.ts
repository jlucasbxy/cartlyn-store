import type { CreditCardPayload, OrderDTO } from "@/dtos";

export interface OrdersService {
  getOrders(userId: string): Promise<OrderDTO[]>;
  checkout(userId: string, card: CreditCardPayload): Promise<OrderDTO>;
}
