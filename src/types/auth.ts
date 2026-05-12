export type LoginMethod = "email" | "phone" | "whatsapp";

export interface CountryOption {
  name: string;
  isoCode: string;
  dialCode: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: CountryOption;
}

export interface AuthApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  user?: AuthUser;
  isAdmin?: boolean;
}

export interface EmailLoginPayload {
  email: string;
  password: string;
}

export interface OtpPayload {
  method: Extract<LoginMethod, "phone" | "whatsapp">;
  country: CountryOption;
  number: string;
}

export interface VerifyOtpPayload extends OtpPayload {
  otp: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: CountryOption;
  password: string;
  confirmPassword: string;
}
