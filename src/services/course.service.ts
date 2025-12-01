import type {
  CoursesApiResponse,
  CourseDetailApiResponse,
} from "@/types/dashboard";

import { api } from "./api";
import type { ICourseService } from "./interfaces";

class CourseService implements ICourseService {
  async getAll(): Promise<CoursesApiResponse> {
    const { data } = await api.get<CoursesApiResponse>("/courses");
    return data;
  }

  async getBySlug(slug: string): Promise<CourseDetailApiResponse> {
    const { data } = await api.get<CourseDetailApiResponse>(`/courses/${slug}`);
    return data;
  }

  async purchase(courseId: string): Promise<{ url: string }> {
    const { data } = await api.post<{ url: string }>(
      `/courses/${courseId}/purchase`
    );
    return data;
  }
}

export const courseService = new CourseService();
