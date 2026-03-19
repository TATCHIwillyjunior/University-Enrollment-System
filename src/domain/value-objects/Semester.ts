import { Brand } from "./Brand";

export type Semester = Brand<string, "Semester">;

export function createSemester(value: string): Semester | Error {
  if (!/^(Fall|Spring|Summer)\d{4}$/.test(value)) {
    return new Error("Invalid Semester format");
  }
  return value as Semester;
}
