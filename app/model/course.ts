export interface CourseType {
    id: number;
    name: string;
}
export interface Course {
    id: number;
    courseId: number;
    name: string;
}

export interface CourseDetails extends Course{
    createdAt: string;
    updatedAt: string;
    courseDate: string;
    studentId: number;
    type: []
}