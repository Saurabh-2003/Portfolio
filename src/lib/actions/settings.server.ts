"use server";
import nodemailer from "nodemailer";

export async function sendSettingsUpdateEmail({ email, password }: { email: string; password: string }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM;
  const toEmail = process.env.ADMIN_BACKUP_EMAIL;

  if (!smtpUser || !smtpPass || !fromEmail || !toEmail) {
    throw new Error("Missing SMTP or backup email environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: "[Portfolio] Admin Email & Password Updated",
    text: `Admin credentials updated.\n\nEmail: ${email}\nPassword: ${password}`,
  };

  await transporter.sendMail(mailOptions);
}
