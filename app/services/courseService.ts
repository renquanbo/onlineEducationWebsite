import { IResponse, Paginator } from "../model/api";
import { AddCourseRequest, AddCourseResponse, CourseDetailResponse, CourseRequest, CourseResponse, CourseType, ScheduleRequest } from "../model/course";
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
    addCourse(req: AddCourseRequest): Promise<IResponse<AddCourseResponse>> {
        return this.post<IResponse<AddCourseResponse>>('courses', req).then(this.showMessage(true));
    }
    updateSchedule(req: ScheduleRequest): Promise<IResponse<boolean>> {
        return this.put<IResponse<boolean>>('courses/schedule',req).then(this.showMessage(true));
    }
}

const courseService = new CourseService();
export default courseService;