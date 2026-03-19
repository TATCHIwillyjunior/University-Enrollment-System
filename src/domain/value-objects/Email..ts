import { Brand } from "./Brand";

export type Email = Brand<string, "Email">;

export function createEmail(value: string): Email | Error {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return new Error("Invalid Email format");
  }
  return value as Email;
}
