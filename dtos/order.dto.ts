export type OrderItemProductDTO = {
  id: string;
  name: string;
  imageUrl: string;
};

export type OrderItemDTO = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  product: OrderItemProductDTO;
};

export type OrderDTO = {
  id: string;
  userId: string;
  total: number;
  paymentId: string | null;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: Date;
  items: OrderItemDTO[];
};
