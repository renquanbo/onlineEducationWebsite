import { IResponse } from "../model/api";
import { StudentResponse } from "../model/student";
import { BaseApiService } from "./baseApiService";

class StudentService extends BaseApiService {
    getStudents(limit: number, page: number): Promise<IResponse<StudentResponse>>{
        return this.get<IResponse<StudentResponse>>('students?limit='+limit+'&page='+page);
    }
}

const studentService = new StudentService();

export default studentService;