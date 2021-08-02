import { ListResponse, Paginator } from "./api";

export interface CourseType {
    id: number;
    name: string;
}
export interface CourseShort {
    id: number;
    courseId: number;
    name: string;
}

export interface StudentCourse extends CourseShort{
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

export interface CourseRequest{
    id: string;
    code?: string;
    name?: string;
    type?: number;
    userId?: number;
    page?: number;
    limit?: number;
}

interface Sales {
    id: number;
    batches: number;
    price: number;
    earnings: number;
    paidAmount: number;
    studentAmount: number;
    paidIds: number[];
  }
  
  export interface Schedule {
    id: number;
    status: number;
    current: number;
    chapters: Chapter[];
    classTime: string[];
  }
  
  export interface Chapter {
    name: string;
    id: number;
    content: string;
    order: number;
  }
  
  export interface CourseDetail extends Course {
    sales: Sales;
    schedule: Schedule;
  }
  
  export type CourseDetailResponse = CourseDetail;