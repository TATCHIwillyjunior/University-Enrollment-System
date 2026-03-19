import { EnrollmentId } from "../value-objects/EnrollmentId";
import { StudentId } from "../value-objects/StudentId";
import { CourseCode } from "../value-objects/CourseCode";

export const EVENT_STUDENT_ENROLLED = "StudentEnrolled";
export const EVENT_ENROLLMENT_CANCELLED = "EnrollmentCancelled";
export const EVENT_COURSE_CAPACITY_REACHED = "CourseCapacityReached";
export const EVENT_COURSE_FULL = "CourseFull";

export interface StudentEnrolledEvent {
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
}

export interface EnrollmentCancelledEvent {
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
}

export interface CourseCapacityReachedEvent {
  courseCode: CourseCode;
  enrolledCount: number;
  capacity: number;
}

export interface CourseFullEvent {
  courseCode: CourseCode;
  enrolledCount: number;
  capacity: number;
}
