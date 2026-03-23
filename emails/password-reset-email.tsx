import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";

type PasswordResetEmailProps = {
  resetUrl: string;
  userName: string;
};

export function PasswordResetEmail({
  resetUrl,
  userName
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Redefinição de senha - Cartlyn</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Cartlyn</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Redefinição de senha</Heading>
            <Text style={text}>Olá, {userName}!</Text>
            <Text style={text}>
              Recebemos uma solicitação para redefinir a senha da sua conta.
              Clique no botão abaixo para criar uma nova senha.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Redefinir senha
              </Button>
            </Section>

            <Text style={text}>
              Este link expira em <strong>1 hora</strong>. Se você não solicitou
              a redefinição de senha, ignore este email — sua senha permanece a
              mesma.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Se o botão não funcionar, copie e cole este link no navegador:{" "}
              <br />
              {resetUrl}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "560px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
};

const header = {
  backgroundColor: "#1ec067",
  padding: "24px 40px"
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0"
};

const content = {
  padding: "40px"
};

const h1 = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 16px"
};

const text = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px"
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0"
};

const button = {
  backgroundColor: "#1ec067",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 32px",
  textDecoration: "none",
  display: "inline-block"
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0"
};

const footer = {
  color: "#9ca3af",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
  wordBreak: "break-all" as const
};
