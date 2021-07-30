import { ListResponse } from "./api";

export interface CourseType {
    id: number;
    name: string;
}
export interface CourseShort {
    id: number;
    courseId: number;
    name: string;
}

export interface CourseDetails extends CourseShort{
    createdAt: string;
    updatedAt: string;
    courseDate: string;
    studentId: number;
    type: []
}

export interface Course {
    createdAt: string;
    updatedAt: string;
    id: number;
    cover: string;
    detail: string;
    duration: number;
    durationUnit: number;
    maxStudents: number;
    name: string;
    price: number;
    uid: string;
    star: number;
    startTime: string;
    status: number;
    scheduleId: number;
    teacherId: number;
    type: CourseType[];
    teacherName: string;
}

export interface CourseResponse extends ListResponse {
    courses: Course[];
}