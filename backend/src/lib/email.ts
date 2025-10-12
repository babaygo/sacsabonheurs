import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { Prisma } from "@prisma/client";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: { user: true; items: true };
}>;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = `"Sacs à Bonheurs" <${process.env.MAIL_DEV}>`,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) {
  await transporter.sendMail({ from, to, subject, text, html });
}

export async function sendOrderConfirmationEmail(order: OrderWithDetails) {
  const template = fs.readFileSync(
    path.join(process.cwd(), "public/templates/order-confirmation.html"),
    "utf8"
  );

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td><img src="${item.imageUrl}" alt="${item.name}" width="50" /></td>
          <td>${item.name}</td>
          <td>${item.price.toFixed(2)} €</td>
        </tr>`
    )
    .join("");

  const replacements: Record<string, string> = {
    userName: order.user.name,
    orderDate: order.createdAt.toLocaleDateString("fr-FR"),
    orderId: String(order.id),
    email: order.user.email,
    relayName: order.relayName ?? "",
    relayAddress: order.relayAddress ?? "",
    billingAddress: order.billingAddress ?? "",
    detailsBillingAddress: order.detailsBillingAddress ?? "",
    codePostal: order.postalCode ?? "",
    city: order.city ?? "",
    country: order.country ?? "",
    prixTotal: `${order.total.toFixed(2)} €`,
    datePaiement: order.createdAt.toLocaleString("fr-FR"),
    subtotal: `${order.subtotal?.toFixed(2) ?? ""} €`,
    taxes: `${order.taxes?.toFixed(2) ?? ""} €`,
    shippingCost: `${order.shippingCost?.toFixed(2) ?? ""} €`,
    total: `${order.total.toFixed(2)} €`,
    storeName: "Sacs à bonheurs",
    itemRows,
  };

  const html = Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
    template
  );

  await sendEmail({
    to: order.user.email,
    subject: `Confirmation de votre commande #${order.id}`,
    html,
  });
}
