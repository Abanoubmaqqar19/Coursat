import type { Course } from '@/lib/types';

export function getInstructorId(course: Course | null | undefined): string | undefined {
  if (!course?.instructor) return undefined;
  const ins = course.instructor;
  if (typeof ins === 'string') return ins;
  if (typeof ins === 'object' && ins !== null && '_id' in ins && ins._id) {
    return String(ins._id);
  }
  return undefined;
}
