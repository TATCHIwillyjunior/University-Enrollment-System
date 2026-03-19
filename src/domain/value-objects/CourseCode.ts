import { Brand } from "./Brand";

export type CourseCode = Brand<string, "CourseCode">;

export function createCourseCode(value: string): CourseCode | Error {
  if (!/^[A-Za-z]{2,4}\d{3}$/.test(value)) {
    return new Error("Invalid CourseCode format");
  }
  return value as CourseCode;
}
