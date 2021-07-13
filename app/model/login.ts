import { Role } from "./role";

export interface LoginResponse {
    userId: number;
    token: string;
    role: Role;
}

export interface LoginRequest {
    email: string;
    password: string;
    role: Role;
    remember: boolean;
}