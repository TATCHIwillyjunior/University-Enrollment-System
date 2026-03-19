import { Brand } from "./Brand";

export type EnrollmentId = Brand<string, "EnrollmentId">;

export function createEnrollmentId(value: string): EnrollmentId | Error {
  if (!/^ENR.+/.test(value)) {
    return new Error("Invalid EnrollmentId format");
  }
  return value as EnrollmentId;
}
