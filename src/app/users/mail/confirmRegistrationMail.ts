import { sendMail } from "core/mail";
import { User } from "../models/user";

export default async function confirmRegistrationMail(user: User) {
  await sendMail({
    to: user.get("email"),
    subject: "Create Account Verification",
    html: `
    <h3>Hello, ${user.get("name")}</h3>

    <p>Thank you for creating an account with us.</p>

    <p>Your activation code is: <strong>${user.get(
      "activationCode",
    )}</strong></p>
    `,
  });
}
