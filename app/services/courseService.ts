import { IResponse, Paginator } from "../model/api";
import { CourseDetailResponse, CourseRequest, CourseResponse } from "../model/course";
import { BaseApiService } from "./baseApiService";

class CourseService extends BaseApiService {
    getCourses(params?: CourseRequest): Promise<IResponse<CourseResponse>> {
        return this.get('courses', params);
    }
    getCourseById(id: string): Promise<IResponse<CourseDetailResponse>> {
        return this.get('courses/detail',{ id: id });
    }
}

const courseService = new CourseService();
export default courseService;