import { CourseCode } from "../value-objects/CourseCode";
import { Credits } from "../value-objects/Credits";

export type Course = {
  code: CourseCode;
  name: string;
  credits: Credits;
  capacity: number;
  enrolledCount: number;
};

export function createCourse(
  code: CourseCode,
  name: string,
  credits: Credits,
  capacity: number
): Course {
  if (capacity < 1 || capacity > 200) {
    throw new Error("Capacity must be between 1 and 200");
  }

  return {
    code,
    name,
    credits,
    capacity,
    enrolledCount: 0
  };
}

export function hasCapacity(course: Course): boolean {
  return course.enrolledCount < course.capacity;
}

export function enrollOne(course: Course): Course {
  if (!hasCapacity(course)) {
    throw new Error("Course is full");
  }

  return {
    ...course,
    enrolledCount: course.enrolledCount + 1
  };
}

export function cancelOne(course: Course): Course {
  return {
    ...course,
    enrolledCount: Math.max(0, course.enrolledCount - 1)
  };
}

export function isAtLeast80Percent(course: Course): boolean {
  const ratio = course.enrolledCount / course.capacity;
  return ratio >= 0.8 && ratio < 1;
}

export function isFull(course: Course): boolean {
  return course.enrolledCount === course.capacity;
}
