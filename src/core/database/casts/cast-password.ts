import Password from "@mongez/password";

export default function castPassword(column: string, value: any) {
  return Password.generate(value, 15);
}
