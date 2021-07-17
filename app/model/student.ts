import { ListResponse } from "./api";

export interface Course {
    id: number;
    courseId: number;
    name: string;
}
  
export interface StudentType {
    id: number;
    name: string;
}

export interface Student {
    id: number;
    name: string;
    updatedAt: string;
    country: string;
    createdAt: string;
    email: string;
    courses: Course[];
    profileId: number;
    type: StudentType;
}

export interface StudentResponse extends ListResponse{
    students: Student[]
}

export interface AddStudentRequest {
    name: string;
    country: string;
    email: string;
    type: number;
}

export type AddStudentResponse = Student;
export type UpdateStudentResponse = Student;

export interface UpdateStudentRequest extends AddStudentRequest{
    id: number
}