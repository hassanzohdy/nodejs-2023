import { response } from "core/http";
import { sendMail } from "core/mail";

export default async function send() {
  const output = await sendMail({
    to: "hassanzohdy@gmail.com",
    subject: "Hello, World",
    html: "<h1>Hello, World</h1>",
  });

  return response.send({
    output,
  });
}
