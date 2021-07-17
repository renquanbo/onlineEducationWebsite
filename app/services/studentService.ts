import { IResponse } from "../model/api";
import { AddStudentRequest, AddStudentResponse, StudentResponse, UpdateStudentRequest, UpdateStudentResponse } from "../model/student";
import { BaseApiService } from "./baseApiService";

class StudentService extends BaseApiService {
    getStudents(limit: number, page: number): Promise<IResponse<StudentResponse>> {
        return this.get<IResponse<StudentResponse>>('students?limit=' + limit + '&page=' + page);
    }

    getStudentsByName(limit: number, page: number, name: string): Promise<IResponse<StudentResponse>> {
        return this.get<IResponse<StudentResponse>>('students?limit=' + limit + '&page=' + page+'&query=' + name);
    }

    addStudent(addStuReq: AddStudentRequest): Promise<IResponse<AddStudentResponse>> {
        return this.post<IResponse<AddStudentResponse>>('students',addStuReq).then(this.showMessage(true));;
    }

    updateStudent(updateStuReq: UpdateStudentRequest): Promise<IResponse<UpdateStudentResponse>> {
        return this.put<IResponse<UpdateStudentResponse>>('students',updateStuReq).then(this.showMessage(true));
    }

    deleteStudent(id: string) {
        return this.delete<IResponse<Boolean>>('students/'+id).then(this.showMessage(true));
    }
}

const studentService = new StudentService();

export default studentService;