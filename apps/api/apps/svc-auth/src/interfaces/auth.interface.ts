export interface UserResponse {
  id: number;
  email: string;
  fullName?: string;
  username?: string;
  role?: string;
  image?: string;
  branchId?: number;
}

export interface AuthResult {
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}

export interface MessageResult {
  message: string;
}
