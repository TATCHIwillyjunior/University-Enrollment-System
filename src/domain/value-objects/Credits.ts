import { Brand } from "./Brand";

export type Credits = Brand<number, "Credits">;

const allowed = [1, 2, 3, 4, 6];

export function createCredits(value: number): Credits | Error {
  if (!allowed.includes(value)) {
    return new Error("Invalid Credits value");
  }
  return value as Credits;
}
