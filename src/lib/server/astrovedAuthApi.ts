import type { AuthUser, CountryOption, LoginMethod } from "@/types/auth";

export type AstrovedLoginType = 1 | 2 | 3 | 4;

interface AstrovedLoginInfo {
  UserLogin?: string;
  CustomerId?: number;
  CustomerName?: string;
  IsMobileVerified?: boolean;
  IsEmailVerified?: boolean;
  MobileNo?: string;
  CustomerCurrency?: string;
}

interface AstrovedAuthResponse {
  StatusCode?: number;
  Status?: string;
  Message?: string;
  loginInfo?: AstrovedLoginInfo | null;
  ErrorMessage?: string;
  FirstName?: string;
  CustomerId?: number;
  IsRegistered?: boolean;
  Email?: string;
  Password?: string;
  PhoneNumber?: string;
  Currency?: string;
}

export class AstrovedAuthError extends Error {
  statusCode: number;
  vendorStatus?: string;

  constructor(message: string, statusCode = 502, vendorStatus?: string) {
    super(message);
    this.name = "AstrovedAuthError";
    this.statusCode = statusCode;
    this.vendorStatus = vendorStatus;
  }
}

const ASTROVED_AUTH_TIMEOUT_MS = Number(process.env.ASTROVED_AUTH_TIMEOUT_MS ?? 10000);

function getAuthConfig() {
  const baseUrl =
    process.env.ASTROVED_AUTH_API_BASE_URL ??
    "https://qawebservice.astroved.com/api/UserAccount";
  const token = process.env.ASTROVED_AUTH_API_TOKEN?.trim() || process.env.ASTROVED_API_TOKEN?.trim();

  if (!token) {
    throw new AstrovedAuthError("AstroVed auth token is not configured", 500);
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    token,
  };
}

function getStatusCode(statusCode?: number) {
  if (statusCode === 400 || statusCode === 404) return 401;
  if (statusCode === 429) return 429;
  if (statusCode && statusCode >= 500) return 502;
  return 400;
}

function ensureSuccessfulResponse(data: AstrovedAuthResponse) {
  if (data.StatusCode === 200 && data.Status === "OK") return data;

  throw new AstrovedAuthError(
    data.Message || "AstroVed authentication failed",
    getStatusCode(data.StatusCode),
    data.Status
  );
}

async function postToAstroved(path: string, body: Record<string, unknown>) {
  const { baseUrl, token } = getAuthConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ASTROVED_AUTH_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as AstrovedAuthResponse | null;

    if (!response.ok) {
      throw new AstrovedAuthError(
        data?.Message || `AstroVed auth request failed with ${response.status}`,
        response.status,
        data?.Status
      );
    }

    if (!data) {
      throw new AstrovedAuthError("Invalid response from AstroVed auth service", 502);
    }

    return ensureSuccessfulResponse(data);
  } catch (error) {
    if (error instanceof AstrovedAuthError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new AstrovedAuthError("AstroVed auth service timed out", 504);
    }
    throw new AstrovedAuthError("Unable to reach AstroVed auth service", 502);
  } finally {
    clearTimeout(timeout);
  }
}

export function getAstrovedLoginType(method: LoginMethod): AstrovedLoginType {
  if (method === "phone") return 2;
  if (method === "whatsapp") return 3;
  if (method === "email") return 4;
  return 1;
}

export function normalizeCountryCode(country: CountryOption | string) {
  const value = typeof country === "string" ? country : country.dialCode;
  return String(value ?? "").replace(/[^0-9]/g, "");
}

export function normalizeCurrency(currency?: string) {
  const value = String(currency ?? "").toUpperCase();
  if (value === "USD" || value === "MYR" || value === "INR") return value;
  return "INR";
}

export function mapLoginInfoToUser(
  loginInfo: AstrovedLoginInfo,
  options: { country?: CountryOption; loginProvider: LoginMethod }
): AuthUser {
  const customerId = loginInfo.CustomerId ? String(loginInfo.CustomerId) : undefined;
  const currency = normalizeCurrency(loginInfo.CustomerCurrency);
  const id = customerId || loginInfo.UserLogin || loginInfo.MobileNo || "astroved-user";

  return {
    id,
    customerId,
    name: loginInfo.CustomerName || loginInfo.UserLogin || "AstroVed User",
    email: loginInfo.UserLogin || undefined,
    phone: loginInfo.MobileNo || undefined,
    country: options.country,
    currency,
    loginProvider: options.loginProvider,
  };
}

export async function authenticatePasswordLogin(payload: {
  email: string;
  password: string;
}) {
  const data = await postToAstroved("AuthenticateLogin", {
    UserName: payload.email,
    Password: payload.password,
    Type: 1,
  });

  if (!data.loginInfo) {
    throw new AstrovedAuthError(data.Message || "Invalid email or password", 401, data.Status);
  }

  return data.loginInfo;
}

export async function requestOtp(payload: {
  method: Extract<LoginMethod, "phone" | "whatsapp" | "email">;
  country?: CountryOption;
  number?: string;
  email?: string;
}) {
  if (payload.method === "email") {
    const data = await postToAstroved("AuthenticateLogin", {
      UserName: payload.email,
      Password: "",
      Type: 4,
    });
    return { message: data.Message || "OTP sent successfully" };
  }

  const data = await postToAstroved("AuthenticateLogin", {
    Type: getAstrovedLoginType(payload.method),
    CountryCode: normalizeCountryCode(payload.country!),
    MobileNo: payload.number!,
  });

  return { message: data.Message || "OTP sent successfully" };
}

export async function verifyOtpWithAstroved(payload: {
  method: Extract<LoginMethod, "phone" | "whatsapp" | "email">;
  country?: CountryOption;
  number?: string;
  email?: string;
  otp: string;
}) {
  if (payload.method === "email") {
    const data = await postToAstroved("VerifyOtp", {
      Type: 4,
      CountryCode: "",
      MobileNo: "",
      OTP: payload.otp,
      UserName: payload.email,
    });

    if (!data.loginInfo) {
      throw new AstrovedAuthError(data.Message || "Invalid OTP. Please try again.", 401, data.Status);
    }

    return data.loginInfo;
  }

  const data = await postToAstroved("VerifyOtp", {
    Type: getAstrovedLoginType(payload.method),
    CountryCode: normalizeCountryCode(payload.country!),
    MobileNo: payload.number!,
    OTP: payload.otp,
  });

  if (!data.loginInfo) {
    throw new AstrovedAuthError(data.Message || "Invalid OTP. Please try again.", 401, data.Status);
  }

  return data.loginInfo;
}

export async function resendOtpWithAstroved(payload: {
  method: Extract<LoginMethod, "phone" | "whatsapp" | "email">;
  country?: CountryOption;
  number?: string;
  email?: string;
}) {
  if (payload.method === "email") {
    const data = await postToAstroved("AuthenticateLogin", {
      UserName: payload.email,
      Password: "",
      Type: 4,
    });
    return { message: data.Message || "OTP resent successfully" };
  }

  const data = await postToAstroved("ResendOtp", {
    Type: getAstrovedLoginType(payload.method),
    CountryCode: normalizeCountryCode(payload.country!),
    MobileNo: payload.number!,
  });

  return { message: data.Message || "OTP resent successfully" };
}

export async function registerWithAstroved(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  country: CountryOption;
  isWhatsappNumber: boolean;
  currency: "INR" | "USD" | "MYR";
}) {
  const apiUrl =
    process.env.REGISTRATION_API_URL?.trim() ||
    `${process.env.ASTROVED_AUTH_API_BASE_URL ?? "https://qawebservice.astroved.com/api/UserAccount"}/RegistrationBasedOnShop`;
  const token = process.env.ASTROVED_AUTH_API_TOKEN?.trim() || process.env.ASTROVED_API_TOKEN?.trim();

  if (!token) {
    throw new AstrovedAuthError("AstroVed registration token is not configured", 500);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ASTROVED_AUTH_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        FirstName: payload.firstName,
        LastName: payload.lastName,
        UserName: payload.email,
        Password: payload.password,
        PhoneNumber: `${normalizeCountryCode(payload.country)}|${payload.phone}`,
        ShopName: "AstroVed",
        Currency: payload.currency,
        IsWhatsappNumber: payload.isWhatsappNumber,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as AstrovedAuthResponse | null;

    if (!response.ok) {
      throw new AstrovedAuthError(
        data?.ErrorMessage ||
          data?.Message ||
          `AstroVed registration failed with ${response.status}. Check REGISTRATION_API_URL and request payload.`,
        response.status,
        data?.Status
      );
    }

    if (data?.ErrorMessage) {
      throw new AstrovedAuthError(data.ErrorMessage, getStatusCode(data.StatusCode), data.Status);
    }

    if (data?.StatusCode && data.StatusCode !== 200) {
      throw new AstrovedAuthError(
        data.Message || "AstroVed registration failed",
        getStatusCode(data.StatusCode),
        data.Status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AstrovedAuthError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new AstrovedAuthError("AstroVed registration service timed out", 504);
    }
    throw new AstrovedAuthError("Unable to reach AstroVed registration service", 502);
  } finally {
    clearTimeout(timeout);
  }
}
