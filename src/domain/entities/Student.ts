import { StudentId } from "../value-objects/StudentId";
import { Email } from "../value-objects/Email.";
import { Credits } from "../value-objects/Credits";

export type Student = {
  id: StudentId;
  name: string;
  email: Email;
  enrolledCredits: number;
};

export function createStudent(
  id: StudentId,
  name: string,
  email: Email
): Student {
  return {
    id,
    name,
    email,
    enrolledCredits: 0
  };
}

export function canAddCredits(student: Student, credits: Credits): boolean {
  return student.enrolledCredits + credits <= 18;
}

export function addCredits(student: Student, credits: Credits): Student {
  return {
    ...student,
    enrolledCredits: student.enrolledCredits + credits
  };
}

export function removeCredits(student: Student, credits: Credits): Student {
  return {
    ...student,
    enrolledCredits: Math.max(0, student.enrolledCredits - credits)
  };
}
