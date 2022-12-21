import config from "@mongez/config";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

export default async function sendMail(options: Options) {
  const transporter = nodemailer.createTransport({
    host: config.get("mail.host"),
    port: config.get("mail.port"),
    secure: config.get("mail.secure"),
    requireTLS: true,
    auth: {
      user: config.get("mail.username"),
      pass: config.get("mail.password"),
    },
    logger: false,
  });

  return await transporter.sendMail({
    from: `"${config.get("mail.from.name")}" <${config.get(
      "mail.from.address",
    )}>`,
    ...options,
  });
}
