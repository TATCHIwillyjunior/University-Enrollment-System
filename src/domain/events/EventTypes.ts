import { EnrollmentId } from "../value-objects/EnrollmentId";
import { StudentId } from "../value-objects/StudentId";
import { CourseCode } from "../value-objects/CourseCode";

export const EVENT_STUDENT_ENROLLED = "StudentEnrolled";
export const EVENT_ENROLLMENT_CANCELLED = "EnrollmentCancelled";
export const EVENT_COURSE_CAPACITY_REACHED = "CourseCapacityReached";
export const EVENT_COURSE_FULL = "CourseFull";

export type StudentEnrolledEvent = {
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
};

export type EnrollmentCancelledEvent = {
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
};

export type CourseCapacityReachedEvent = {
  courseCode: CourseCode;
  enrolledCount: number;
  capacity: number;
};

export type CourseFullEvent = {
  courseCode: CourseCode;
  enrolledCount: number;
  capacity: number;
};
