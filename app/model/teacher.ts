import { ListResponse, Paginator } from "./api";

export interface Teacher {
  createdAt: string;
  updatedAt: string;
  id: number;
  country: string;
  courseAmount: number;
  email: string;
  name: string;
  phone: string;
  profileId: number;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface TeacherResponse extends ListResponse {
    teachers: Teacher[];
};

export interface TeacherRequest{
    query?: string;
    limit?: number;
    page?: number;
}