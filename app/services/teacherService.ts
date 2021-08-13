import { IResponse } from "../model/api";
import { AddTeacherRequest, AddTeacherResponse, TeacherRequest, TeacherResponse, TeachersResponse, UpdateTeacherRequest, UpdateTeacherResponse } from "../model/teacher";
import { BaseApiService } from "./baseApiService";

class TeacherService extends BaseApiService {
    getTeachers(params?: TeacherRequest): Promise<IResponse<TeachersResponse>>{
        return this.get('teachers',params);
    }
    getTeacherById(id: number): Promise<IResponse<TeacherResponse>> {
        return this.get('/teachers/'+ id);
    }
    addTeacher(params: AddTeacherRequest): Promise<IResponse<AddTeacherResponse>> {
        return this.post<IResponse<AddTeacherResponse>>('teachers',params).then(this.showMessage(true));
    }
    deleteTeacher(id: number): Promise<IResponse<boolean>> {
        return this.delete<IResponse<boolean>>('teachers/' + id).then(this.showMessage(true));
    }
    updateTeacher(params: UpdateTeacherRequest): Promise<IResponse<UpdateTeacherResponse>> {
        return this.put<IResponse<UpdateTeacherResponse>>('teachers',params).then(this.showMessage(true));
    }
}


const teacherService = new TeacherService();
export default teacherService;