import { globalEventEmitter } from "../../infrastructure/emitter/emit";
import {
  EVENT_STUDENT_ENROLLED,
  EVENT_ENROLLMENT_CANCELLED,
  EVENT_COURSE_CAPACITY_REACHED,
  EVENT_COURSE_FULL,
  StudentEnrolledEvent,
  EnrollmentCancelledEvent,
  CourseCapacityReachedEvent,
  CourseFullEvent
} from "./EventTypes";

export const DomainEvents = {
  emitStudentEnrolled(event: StudentEnrolledEvent) {
    globalEventEmitter.emit<StudentEnrolledEvent>(EVENT_STUDENT_ENROLLED, event);
  },
  emitEnrollmentCancelled(event: EnrollmentCancelledEvent) {
    globalEventEmitter.emit<EnrollmentCancelledEvent>(
      EVENT_ENROLLMENT_CANCELLED,
      event
    );
  },
  emitCourseCapacityReached(event: CourseCapacityReachedEvent) {
    globalEventEmitter.emit<CourseCapacityReachedEvent>(
      EVENT_COURSE_CAPACITY_REACHED,
      event
    );
  },
  emitCourseFull(event: CourseFullEvent) {
    globalEventEmitter.emit<CourseFullEvent>(EVENT_COURSE_FULL, event);
  }
};
