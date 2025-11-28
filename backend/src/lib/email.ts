import fs from "fs";
import path from "path";
import { Resend } from "resend";
import { Prisma } from "../generated/prisma";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: { user: true; items: true };
}>;

const resend =  new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({ to, subject, html, from, replyTo, bcc }: { to: string; subject: string; html: string; from: string; replyTo?: string; bcc?: string; }) {
  try {
    if (!resend) {
      console.warn("Resend API key not set. Email not sent to:", to);
      return;
    }
    await resend.emails.send({ from, to, subject, html, replyTo, bcc });
  } catch (error: any) {
    console.error("Erreur sur l'envoi du mail :", error);
  }

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
          <td>${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const replacements: Record<string, string> = {
    userName: order.user.name ?? "",
    orderDate: order.createdAt.toLocaleDateString("fr-FR") ?? "",
    orderId: String(order.id) ?? "",
    email: order.user.email ?? "",
    phone: order.phone ?? "",
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
    from: `"Sacs à Bonheurs" <${process.env.MAIL_BOUTIQUE}>`,
    replyTo: "sacsabonheurs@gmail.com"
  });
}

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  const template = fs.readFileSync(
    path.join(process.cwd(), "public/templates/reset-password-email.html"),
    "utf8"
  );

  if (!template.includes("{{resetUrl}}")) {
    throw new Error("Le template d’email est invalide ou incomplet.");
  }

  const replacements: Record<string, string> = {
    resetUrl: resetUrl
  };

  const html = Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
    template
  );

  await sendEmail({
    to: email,
    subject: `Réinitialisation de votre mot de passe`,
    html,
    from: `"Sacs à Bonheurs" <${process.env.MAIL_BOUTIQUE}>`,
    replyTo: "sacsabonheurs@gmail.com"
  });
}

export async function sendPasswordChangedEmail(email: string) {
  const template = fs.readFileSync(
    path.join(process.cwd(), "public/templates/password-changed-email.html"),
    "utf8"
  );

  await sendEmail({
    to: email,
    subject: `Modification de votre mot de passe`,
    html: template,
    from: `"Sacs à Bonheurs" <${process.env.MAIL_BOUTIQUE}>`,
    replyTo: "sacsabonheurs@gmail.com"
  });
}

export async function sendContactConfirmationEmail(email: string, name: string, order: string, message: string) {
  const template = fs.readFileSync(
    path.join(process.cwd(), "public/templates/contact-confirmation-email.html"),
    "utf8"
  );

  const replacements: Record<string, string> = {
    name: name,
    email: email,
    order: order,
    message: message
  };

  const html = Object.entries(replacements).reduce(
    (acc, [key, value]) =>
      acc.replace(`{{${key}}}`, value ? String(value) : "Non précisé"),
    template
  );

  await sendEmail({
    to: email,
    subject: `Demande de contact reçue`,
    html: html,
    from: `"Sacs à Bonheurs" <${process.env.MAIL_BOUTIQUE}>`,
    bcc: `${process.env.MAIL_OWNER}`
  });
}