import { Brand } from "./Brand";

export type StudentId = Brand<string, "StudentId">;

export function createStudentId(value: string): StudentId | Error {
  if (!/^STU\d{6}$/.test(value)) {
    return new Error("Invalid StudentId format");
  }
  return value as StudentId;
}
