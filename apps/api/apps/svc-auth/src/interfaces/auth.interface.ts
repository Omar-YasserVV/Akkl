export interface UserResponse {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  role?: string;
  image?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  branchId?: string;
  branchName?: string;
  restaurantName?: string;
}

export interface AuthResult {
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}

export interface MessageResult {
  message: string;
}
