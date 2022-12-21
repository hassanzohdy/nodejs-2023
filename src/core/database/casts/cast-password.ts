import Password from "@mongez/password";

export default function castPassword(value: any) {
  return Password.generate(value, 15);
}
