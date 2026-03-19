import { globalEventEmitter } from "../emitter/emit";
import {
  EVENT_STUDENT_ENROLLED,
  EVENT_ENROLLMENT_CANCELLED,
  EVENT_COURSE_CAPACITY_REACHED,
  EVENT_COURSE_FULL,
  StudentEnrolledEvent,
  EnrollmentCancelledEvent,
  CourseCapacityReachedEvent,
  CourseFullEvent
} from "../../domain/events/EventTypes";

export function registerObservers(): void {
  globalEventEmitter.subscribe<StudentEnrolledEvent>(
    EVENT_STUDENT_ENROLLED,
    (event) => {
      console.log(
        `[EVENT] StudentEnrolled: enrollment=${event.enrollmentId}, student=${event.studentId}, course=${event.courseCode}`
      );
    }
  );

  globalEventEmitter.subscribe<EnrollmentCancelledEvent>(
    EVENT_ENROLLMENT_CANCELLED,
    (event) => {
      console.log(
        `[EVENT] EnrollmentCancelled: enrollment=${event.enrollmentId}, student=${event.studentId}, course=${event.courseCode}`
      );
    }
  );

  globalEventEmitter.subscribe<CourseCapacityReachedEvent>(
    EVENT_COURSE_CAPACITY_REACHED,
    (event) => {
      console.log(
        `[EVENT] CourseCapacityReached: course=${event.courseCode}, ${event.enrolledCount}/${event.capacity}`
      );
    }
  );

  globalEventEmitter.subscribe<CourseFullEvent>(
    EVENT_COURSE_FULL,
    (event) => {
      console.log(
        `[EVENT] CourseFull: course=${event.courseCode}, ${event.enrolledCount}/${event.capacity}`
      );
    }
  );
}
