import nodemailer from "nodemailer";
import type { ReactElement } from "react";
import { render } from "@react-email/render";
import { env } from "@/config/env.config";

type SendEmailOptions = {
  to: string;
  subject: string;
  template: ReactElement;
};

type Deps = {
  createTransport: typeof nodemailer.createTransport;
};

export function createEmailProvider(deps: Deps) {
  const transporter = deps.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    },
    tls: {
      rejectUnauthorized: env.nodeEnv === "production"
    }
  });

  async function sendEmail({ to, subject, template }: SendEmailOptions) {
    const html = await render(template);

    await transporter.sendMail({
      from: env.emailFrom,
      to,
      subject,
      html
    });
  }

  return { sendEmail };
}

export const emailProvider = createEmailProvider({
  createTransport: nodemailer.createTransport
});
