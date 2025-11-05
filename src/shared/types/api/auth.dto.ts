export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
  registrationToken?: string;
  onboardingStatus?: "step1" | "step2" | "complete";
}

export interface RefreshTokenDto {
  refreshToken: string;
}

