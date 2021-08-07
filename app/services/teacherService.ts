import { IResponse } from "../model/api";
import { TeacherRequest, TeacherResponse } from "../model/teacher";
import { BaseApiService } from "./baseApiService";

class TeacherService extends BaseApiService {
    getTeachers(params?: TeacherRequest): Promise<IResponse<TeacherResponse>>{
        return this.get('teachers',params);
    }
}


const teacherService = new TeacherService();
export default teacherService;