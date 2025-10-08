import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { Prisma } from "@prisma/client";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: { user: true; items: true }
}>;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendOrderConfirmationEmail(order: OrderWithDetails) {
  const templatePath = path.join(process.cwd(), "./public/templates", "order-confirmation.html");
  let html = fs.readFileSync(templatePath, "utf8");

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

  html = html
    .replace("{{userName}}", order.user.name)
    .replace("{{orderDate}}", order.createdAt.toLocaleDateString("fr-FR"))
    .replace("{{orderId}}", String(order.id))
    .replace("{{email}}", order.user.email)
    .replace("{{relayName}}", order.relayName!)
    .replace("{{relayAddress}}", order.relayAddress!)
    .replace("{{billingAddress}}", order.billingAddress!)
    .replace("{{detailsBillingAddress}}", order.detailsBillingAddress ?? "")
    .replace("{{codePostal}}", order.postalCode!)
    .replace("{{city}}", order.city!)
    .replace("{{country}}", order.country!)
    .replace("{{prixTotal}}", `${order.total.toFixed(2)} €`)
    .replace("{{datePaiement}}", order.createdAt.toLocaleString("fr-FR"))
    .replace("{{subtotal}}", `${order.subtotal!.toFixed(2)} €`)
    .replace("{{shippingCost}}", `${order.shippingCost!.toFixed(2)} €`)
    .replace("{{total}}", `${order.total.toFixed(2)} €`)
    .replace("{{storeName}}", "Sacs à bonheurs")
    .replace("{{itemRows}}", itemRows);;

  await transporter.sendMail({
    from: process.env.MAIL_DEV,
    to: order.email,
    subject: `Confirmation de votre commande #${order.id}`,
    html,
  });
}