import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuracoes - Cartlyn Store",
  description: "Configuracoes da conta"
};

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
