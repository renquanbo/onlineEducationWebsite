import { IResponse, Paginator } from "../model/api";
import { CourseDetailResponse, CourseRequest, CourseResponse, CourseType } from "../model/course";
import { BaseApiService } from "./baseApiService";

class CourseService extends BaseApiService {
    getCourses(params?: CourseRequest): Promise<IResponse<CourseResponse>> {
        return this.get('courses', params);
    }
    getCourseById(id: string): Promise<IResponse<CourseDetailResponse>> {
        return this.get('courses/detail',{ id: id });
    }
    getTypes(): Promise<IResponse<CourseType[]>> {
        return this.get('courses/type');
    }
    getCode(): Promise<IResponse<string>> {
        return this.get('courses/code');
    }
}

const courseService = new CourseService();
export default courseService;