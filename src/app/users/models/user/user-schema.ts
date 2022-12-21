import { CollectionDocument } from "core/database";

export type UserDocument = CollectionDocument<{
  name: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  gender: "male" | "female";
}>;
