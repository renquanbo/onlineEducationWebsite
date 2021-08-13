import { ListResponse, Paginator } from "./api";
import { Course } from "./course";

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

export interface TeachersResponse extends ListResponse {
  teachers: Teacher[];
};

export interface TeacherRequest {
  query?: string;
  limit?: number;
  page?: number;
}

export interface AddTeacherRequest {
  name: string;
  country: string;
  phone: number;
  skills: Skill[];
  email: string;
}

export type AddTeacherResponse = Teacher;

export interface UpdateTeacherRequest extends AddTeacherRequest{
  id: number;
}

export type UpdateTeacherResponse = Teacher;

export interface TeacherProfile {
  id: number;
  address: string[];
  gender: number;
  birthday: string;
  avatar: string;
  description: string;
  workExperience: WorkExperience[];
  education: Education[];
}

export interface Education {
  level: string;
  degree: string;
  startEnd: string;
}

export interface WorkExperience {
  company: string;
  post: string;
  startEnd: string;
}

export interface TeacherResponse extends Teacher {
  profile: TeacherProfile;
  courses?: Course[];
}