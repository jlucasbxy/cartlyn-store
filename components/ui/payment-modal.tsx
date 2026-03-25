"use client";

import { useState } from "react";
import { Button } from "./button";
import { FormInput } from "./form-input";
import { Modal } from "./modal";

interface CardData {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (card: CardData) => void;
  total: number;
  loading?: boolean;
}

interface FormErrors {
  cardNumber?: string;
  cardHolderName?: string;
  expiry?: string;
  cvv?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  total,
  loading
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const rawCard = cardNumber.replace(/\s/g, "");

    if (!/^\d{16}$/.test(rawCard)) {
      newErrors.cardNumber = "Número de cartão inválido (16 dígitos)";
    }
    if (cardHolderName.trim().length < 2) {
      newErrors.cardHolderName = "Nome do titular inválido";
    }

    const [monthStr, yearStr] = expiry.split("/");
    const month = Number(monthStr);
    const year = Number(`20${yearStr}`);
    const now = new Date();
    if (
      !monthStr ||
      !yearStr ||
      yearStr.length !== 2 ||
      month < 1 ||
      month > 12 ||
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
      newErrors.expiry = "Data de validade inválida";
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = "CVV inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const [monthStr, yearStr] = expiry.split("/");
    onConfirm({
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardHolderName: cardHolderName.trim(),
      expiryMonth: Number(monthStr),
      expiryYear: Number(`20${yearStr}`),
      cvv
    });
  };

  const handleClose = () => {
    if (loading) return;
    setCardNumber("");
    setCardHolderName("");
    setExpiry("");
    setCvv("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Dados do Cartão"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            R$ {total.toFixed(2)}
          </span>
        </p>

        <FormInput
          id="cardNumber"
          label="Número do Cartão"
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          errorMsg={errors.cardNumber}
          disabled={loading}
          autoComplete="cc-number"
          inputMode="numeric"
        />

        <FormInput
          id="cardHolderName"
          label="Nome do Titular"
          placeholder="Como no cartão"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
          errorMsg={errors.cardHolderName}
          disabled={loading}
          autoComplete="cc-name"
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            id="expiry"
            label="Validade"
            placeholder="MM/AA"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            errorMsg={errors.expiry}
            disabled={loading}
            autoComplete="cc-exp"
            inputMode="numeric"
          />
          <FormInput
            id="cvv"
            label="CVV"
            placeholder="123"
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            errorMsg={errors.cvv}
            disabled={loading}
            autoComplete="cc-csc"
            inputMode="numeric"
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={loading}>
            {loading ? "Processando..." : "Pagar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
