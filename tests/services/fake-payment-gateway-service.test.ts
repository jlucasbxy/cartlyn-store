import { createFakePaymentGatewayService } from "@/services/fake-payment-gateway-service";

const baseCard = {
  cardNumber: "1234567890123456",
  cardHolderName: "Test User",
  expiryMonth: 12,
  expiryYear: 2030,
  cvv: "123"
};

describe("createFakePaymentGatewayService", () => {
  it("returns PAID with a paymentId by default", async () => {
    const gateway = createFakePaymentGatewayService();
    const result = await gateway.charge(baseCard, 1000);

    expect(result.status).toBe("PAID");
    expect(result.paymentId).toBeTruthy();
    expect(result.failureReason).toBeUndefined();
  });

  it("returns FAILED when alwaysFail is true", async () => {
    const gateway = createFakePaymentGatewayService({ alwaysFail: true });
    const result = await gateway.charge(baseCard, 1000);

    expect(result.status).toBe("FAILED");
    expect(result.failureReason).toBeTruthy();
  });

  it("returns FAILED for a card in declinedCardNumbers", async () => {
    const gateway = createFakePaymentGatewayService({
      declinedCardNumbers: new Set(["0000000000000000"])
    });
    const result = await gateway.charge(
      { ...baseCard, cardNumber: "0000000000000000" },
      1000
    );

    expect(result.status).toBe("FAILED");
  });

  it("returns PAID for a card not in declinedCardNumbers", async () => {
    const gateway = createFakePaymentGatewayService({
      declinedCardNumbers: new Set(["0000000000000000"])
    });
    const result = await gateway.charge(baseCard, 1000);

    expect(result.status).toBe("PAID");
  });

  it("returns a unique paymentId on each call", async () => {
    const gateway = createFakePaymentGatewayService();
    const [r1, r2] = await Promise.all([
      gateway.charge(baseCard, 1000),
      gateway.charge(baseCard, 1000)
    ]);

    expect(r1.paymentId).not.toBe(r2.paymentId);
  });
});
