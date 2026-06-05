export type Role = "ADMIN" | "ANGGOTA";

export interface User {
  id: string;
  nama: string;
  email: string;
  role: Role;
  foto?: string | null;
  alamat?: string | null;
  noTelpon?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  nama: string;
  email: string;
  password: string;
}
