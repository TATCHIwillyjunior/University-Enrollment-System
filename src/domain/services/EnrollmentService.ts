import { Student } from "../entities/Student";
import { Course } from "../entities/Course";
import { Enrollment } from "../entities/Enrollment";

import {
  addCredits,
  canAddCredits,
  removeCredits
} from "../entities/Student";

import {
  enrollOne,
  hasCapacity,
  isAtLeast80Percent,
  isFull,
  cancelOne
} from "../entities/Course";

import {
  createEnrollment,
  isActive,
  cancelEnrollment as cancelEntity
} from "../entities/Enrollment";

import { StudentId } from "../value-objects/StudentId";
import { CourseCode } from "../value-objects/CourseCode";
import { EnrollmentId } from "../value-objects/EnrollmentId";
import { Semester } from "../value-objects/Semester";

import { DomainEvents } from "../events/DomainEvents";


// ---------------------------------------------------------
// DOMAIN STATE
// ---------------------------------------------------------

export type DomainState = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
};


// ---------------------------------------------------------
// RESULT TYPE (Functional error handling)
// ---------------------------------------------------------

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };


// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

export function findStudent(state: DomainState, id: StudentId) {
  return state.students.find(s => s.id === id);
}

export function findCourse(state: DomainState, code: CourseCode) {
  return state.courses.find(c => c.code === code);
}

export function findEnrollment(state: DomainState, id: EnrollmentId) {
  return state.enrollments.find(e => e.id === id);
}

export function hasDuplicateEnrollment(
  state: DomainState,
  studentId: StudentId,
  courseCode: CourseCode,
  semester: Semester
) {
  return state.enrollments.some(
    e =>
      e.studentId === studentId &&
      e.courseCode === courseCode &&
      e.semester === semester &&
      isActive(e)
  );
}


// ---------------------------------------------------------
// ENROLL INPUT TYPE
// ---------------------------------------------------------

export type EnrollInput = {
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
  semester: Semester;
};


// ---------------------------------------------------------
// ENROLL FUNCTION (PURE, IMMUTABLE)
// ---------------------------------------------------------

export function enroll(
  state: DomainState,
  input: EnrollInput
): Result<DomainState> {
  const student = findStudent(state, input.studentId);
  if (!student) return { ok: false, error: "Student not found" };

  const course = findCourse(state, input.courseCode);
  if (!course) return { ok: false, error: "Course not found" };

  if (hasDuplicateEnrollment(state, input.studentId, input.courseCode, input.semester)) {
    return { ok: false, error: "Duplicate enrollment" };
  }

  if (!hasCapacity(course)) {
    return { ok: false, error: "Course is full" };
  }

  if (!canAddCredits(student, course.credits)) {
    return { ok: false, error: "Student exceeds 18 credits" };
  }

  // Apply immutable updates
  const updatedStudent = addCredits(student, course.credits);
  const updatedCourse = enrollOne(course);
  const newEnrollment = createEnrollment(
    input.enrollmentId,
    input.studentId,
    input.courseCode,
    input.semester
  );

  const newState: DomainState = {
    students: state.students.map(s => (s.id === student.id ? updatedStudent : s)),
    courses: state.courses.map(c => (c.code === course.code ? updatedCourse : c)),
    enrollments: [...state.enrollments, newEnrollment]
  };

  // Emit events
  DomainEvents.emitStudentEnrolled({
    enrollmentId: input.enrollmentId,
    studentId: input.studentId,
    courseCode: input.courseCode
  });

  if (isAtLeast80Percent(updatedCourse)) {
    DomainEvents.emitCourseCapacityReached({
      courseCode: updatedCourse.code,
      enrolledCount: updatedCourse.enrolledCount,
      capacity: updatedCourse.capacity
    });
  }

  if (isFull(updatedCourse)) {
    DomainEvents.emitCourseFull({
      courseCode: updatedCourse.code,
      enrolledCount: updatedCourse.enrolledCount,
      capacity: updatedCourse.capacity
    });
  }

  return { ok: true, value: newState };
}


// ---------------------------------------------------------
// CANCEL ENROLLMENT (PURE, IMMUTABLE)
// ---------------------------------------------------------

export function cancelEnrollment(
  state: DomainState,
  enrollmentId: EnrollmentId
): Result<DomainState> {
  const enrollment = findEnrollment(state, enrollmentId);
  if (!enrollment) return { ok: false, error: "Enrollment not found" };
  if (!isActive(enrollment)) return { ok: false, error: "Enrollment already cancelled" };

  const student = findStudent(state, enrollment.studentId)!;
  const course = findCourse(state, enrollment.courseCode)!;

  const updatedEnrollment = cancelEntity(enrollment);
  const updatedStudent = removeCredits(student, course.credits);
  const updatedCourse = cancelOne(course);

  const newState: DomainState = {
    students: state.students.map(s => (s.id === student.id ? updatedStudent : s)),
    courses: state.courses.map(c => (c.code === course.code ? updatedCourse : c)),
    enrollments: state.enrollments.map(e =>
      e.id === enrollment.id ? updatedEnrollment : e
    )
  };

  DomainEvents.emitEnrollmentCancelled({
    enrollmentId: enrollment.id,
    studentId: enrollment.studentId,
    courseCode: enrollment.courseCode
  });

  return { ok: true, value: newState };
}
