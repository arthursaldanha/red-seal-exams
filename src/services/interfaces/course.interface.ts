import type {
  CoursesApiResponse,
  CourseDetailApiResponse,
} from "@/types/dashboard";

export interface ICourseService {
  getAll(): Promise<CoursesApiResponse>;
  getBySlug(slug: string): Promise<CourseDetailApiResponse>;
  purchase(courseId: string): Promise<{ url: string }>;
}
