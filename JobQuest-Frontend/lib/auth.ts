import { api } from "./api";

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(
  input: RegisterInput,
): Promise<AuthResponse> {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(
  input: LoginInput,
): Promise<AuthResponse> {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser(token: string) {
  return api<{ success: boolean; data: { user: User } }>("/auth/me", {
    method: "GET",
    token,
  });
}