export class LogoutDto {
  Token: string;
}

export class GoogleUserDto {
  email: string;
  fullName: string;
  image?: string;
}

export class ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}
