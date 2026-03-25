export type CreditCardPayload = {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
};

export type PaymentResult = {
  paymentId: string;
  status: "PAID" | "FAILED";
  failureReason?: string;
};
