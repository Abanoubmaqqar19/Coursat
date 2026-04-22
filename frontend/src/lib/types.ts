export type Role = 'student' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ApiUserPayload {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export function mapUserFromApi(raw: ApiUserPayload): User {
  return {
    id: String(raw._id),
    name: raw.name,
    email: raw.email,
    role: raw.role,
  };
}

export interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  instructor?: { _id?: string; name?: string; email?: string } | string;
  isPublished?: boolean;
}

export interface EnrollmentRow {
  _id: string;
  course: Course;
  student?: string;
  createdAt?: string;
}
