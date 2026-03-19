import { EnrollmentId } from "../value-objects/EnrollmentId";
import { StudentId } from "../value-objects/StudentId";
import { CourseCode } from "../value-objects/CourseCode";
import { Semester } from "../value-objects/Semester";

export type EnrollmentStatus = "active" | "cancelled";

export type Enrollment = {
  id: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
  semester: Semester;
  status: EnrollmentStatus;
};

export function createEnrollment(
  id: EnrollmentId,
  studentId: StudentId,
  courseCode: CourseCode,
  semester: Semester
): Enrollment {
  return {
    id,
    studentId,
    courseCode,
    semester,
    status: "active"
  };
}

export function isActive(enrollment: Enrollment): boolean {
  return enrollment.status === "active";
}

export function cancelEnrollment(enrollment: Enrollment): Enrollment {
  if (!isActive(enrollment)) {
    throw new Error("Only active enrollments can be cancelled");
  }

  return {
    ...enrollment,
    status: "cancelled"
  };
}
