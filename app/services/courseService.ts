import { IResponse } from "../model/api";
import { CourseResponse } from "../model/course";
import { BaseApiService } from "./baseApiService";

class CourseService extends BaseApiService {
    getCourses(): Promise<IResponse<CourseResponse>> {
        return this.get<IResponse<CourseResponse>>('courses');
    }
    getCoursesByPageAndLimit(page:number, limit: number): Promise<IResponse<CourseResponse>> {
        return this.get<IResponse<CourseResponse>>('courses?page='+page+'&limit='+limit);
    }
}

const courseService = new CourseService();
export default courseService;