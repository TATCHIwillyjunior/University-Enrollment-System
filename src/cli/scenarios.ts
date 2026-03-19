import { createStudentId } from "../domain/value-objects/StudentId";
import { createEmail } from "../domain/value-objects/Email";
import { createCourseCode } from "../domain/value-objects/CourseCode";
import { createCredits } from "../domain/value-objects/Credits";
import { createSemester } from "../domain/value-objects/Semester";
import { createEnrollmentId } from "../domain/value-objects/EnrollmentId";

import { createStudent } from "../domain/entities/Student";
import { createCourse } from "../domain/entities/Course";

import {
  enroll,
  cancelEnrollment,
  DomainState,
} from "../domain/services/EnrollmentService";

import { registerObservers } from "../infrastructure/observers/observer";

// ---------------------------------------------------------
// Helper: unwrap VO constructors
// ---------------------------------------------------------
export function unwrap<T>(value: T | Error): T {
  if (value instanceof Error) {
    throw value;
  }
  return value;
}

// ---------------------------------------------------------
// Setup initial domain state (pure, immutable)
// ---------------------------------------------------------
function setupDomain(): DomainState {
  const student1 = createStudent(
    unwrap(createStudentId("STU123456")),
    "Alice",
    unwrap(createEmail("alice@epita.fr")),
  );

  const student2 = createStudent(
    unwrap(createStudentId("STU654321")),
    "Bob",
    unwrap(createEmail("bob@epita.fr")),
  );

  const cs101 = createCourse(
    unwrap(createCourseCode("CS101")),
    "Intro to CS",
    unwrap(createCredits(6)),
    5, // capacity
  );

  return {
    students: [student1, student2],
    courses: [cs101],
    enrollments: [],
  };
}

// ---------------------------------------------------------
// Scenario 1: Successful Enrollment
// ---------------------------------------------------------
export function scenario1_successfulEnrollment() {
  console.log("\n--- Scenario 1: Successful Enrollment ---");

  try {
    registerObservers();
    let state = setupDomain();

    const result = enroll(state, {
      enrollmentId: unwrap(createEnrollmentId("ENR-1")),
      studentId: unwrap(createStudentId("STU123456")),
      courseCode: unwrap(createCourseCode("CS101")),
      semester: unwrap(createSemester("Fall2024")),
    });

    if (!result.ok) {
      console.log("Enrollment failed:", result.error);
      return;
    }

    state = result.value;
    console.log("Enrollment succeeded.");
  } catch (err) {
    console.error("Scenario 1 crashed:", err);
  }
}

// ---------------------------------------------------------
// Scenario 2: Course reaches 80% capacity
// ---------------------------------------------------------
export function scenario2_courseReaches80() {
  console.log("\n--- Scenario 2: Course Reaches 80% Capacity ---");

  try {
    registerObservers();
    let state = setupDomain();

    const semester = unwrap(createSemester("Fall2024"));
    const courseCode = unwrap(createCourseCode("CS101"));

    for (let i = 1; i <= 4; i++) {
      const studentId = unwrap(createStudentId(`STU99${i}99`));
      const email = unwrap(createEmail(`s${i}@epita.fr`));
      const student = createStudent(studentId, `Student${i}`, email);

      // Add student immutably
      state = {
        ...state,
        students: [...state.students, student],
      };

      const result = enroll(state, {
        enrollmentId: unwrap(createEnrollmentId(`ENR-80-${i}`)),
        studentId,
        courseCode,
        semester,
      });

      if (!result.ok) {
        console.log("Enrollment failed:", result.error);
        continue;
      }

      state = result.value;
    }
  } catch (err) {
    console.error("Scenario 2 crashed:", err);
  }
}

// ---------------------------------------------------------
// Scenario 3: Course becomes full
// ---------------------------------------------------------
export function scenario3_courseFull() {
  console.log("\n--- Scenario 3: Course Becomes Full ---");

  try {
    registerObservers();
    let state = setupDomain();

    // Reduce capacity to 3 for demonstration
    const course = state.courses[0];
    const updatedCourse = { ...course, capacity: 3 };

    state = {
      ...state,
      courses: [updatedCourse],
    };

    const semester = unwrap(createSemester("Fall2024"));
    const courseCode = updatedCourse.code;

    for (let i = 1; i <= 4; i++) {
      const studentId = unwrap(createStudentId(`STU88${i}88`));
      const email = unwrap(createEmail(`f${i}@epita.fr`));
      const student = createStudent(studentId, `FullStudent${i}`, email);

      state = {
        ...state,
        students: [...state.students, student],
      };

      const result = enroll(state, {
        enrollmentId: unwrap(createEnrollmentId(`ENR-FULL-${i}`)),
        studentId,
        courseCode,
        semester,
      });

      if (!result.ok) {
        console.log(`Enrollment ${i} failed:`, result.error);
        continue;
      }

      state = result.value;
    }
  } catch (err) {
    console.error("Scenario 3 crashed:", err);
  }
}

// ---------------------------------------------------------
// Scenario 4: Student exceeds 18 credits
// ---------------------------------------------------------
export function scenario4_exceedsCredits() {
  console.log("\n--- Scenario 4: Student Exceeds 18 Credits ---");

  try {
    registerObservers();
    let state = setupDomain();

    // Preload student with 15 credits
    const student = state.students[0];
    const updatedStudent = { ...student, enrolledCredits: 15 };

    state = {
      ...state,
      students: state.students.map((s) =>
        s.id === student.id ? updatedStudent : s,
      ),
    };

    const result = enroll(state, {
      enrollmentId: unwrap(createEnrollmentId("ENR-OVER-1")),
      studentId: student.id,
      courseCode: unwrap(createCourseCode("CS101")),
      semester: unwrap(createSemester("Fall2024")),
    });

    if (!result.ok) {
      console.log("Expected failure:", result.error);
      return;
    }

    console.log("Unexpected success:", result.value);
  } catch (err) {
    console.error("Scenario 4 crashed:", err);
  }
}

// ---------------------------------------------------------
// Scenario 5: Cancel an enrollment
// ---------------------------------------------------------
export function scenario5_cancelEnrollment() {
  console.log("\n--- Scenario 5: Cancel an Enrollment ---");

  try {
    registerObservers();
    let state = setupDomain();

    const enrollmentId = unwrap(createEnrollmentId("ENR-CANCEL-1"));

    const result = enroll(state, {
      enrollmentId,
      studentId: unwrap(createStudentId("STU123456")),
      courseCode: unwrap(createCourseCode("CS101")),
      semester: unwrap(createSemester("Fall2024")),
    });

    if (!result.ok) {
      console.log("Enrollment failed:", result.error);
      return;
    }

    state = result.value;

    const cancelResult = cancelEnrollment(state, enrollmentId);

    if (!cancelResult.ok) {
      console.log("Cancellation failed:", cancelResult.error);
      return;
    }

    console.log("Cancellation succeeded.");
  } catch (err) {
    console.error("Scenario 5 crashed:", err);
  }
}

// ---------------------------------------------------------
// Run all scenarios
// ---------------------------------------------------------
export function runAllScenarios() {
  scenario1_successfulEnrollment();
  scenario2_courseReaches80();
  scenario3_courseFull();
  scenario4_exceedsCredits();
  scenario5_cancelEnrollment();
}
