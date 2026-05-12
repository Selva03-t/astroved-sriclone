import type { CountryOption } from "@/types/auth";

export const COUNTRIES: CountryOption[] = [
  { name: "India", isoCode: "IN", dialCode: "91" },
  { name: "United States", isoCode: "US", dialCode: "1" },
  { name: "United Kingdom", isoCode: "GB", dialCode: "44" },
  { name: "Canada", isoCode: "CA", dialCode: "1" },
  { name: "Australia", isoCode: "AU", dialCode: "61" },
  { name: "Singapore", isoCode: "SG", dialCode: "65" },
  { name: "Malaysia", isoCode: "MY", dialCode: "60" },
  { name: "United Arab Emirates", isoCode: "AE", dialCode: "971" },
  { name: "Sri Lanka", isoCode: "LK", dialCode: "94" },
  { name: "Nepal", isoCode: "NP", dialCode: "977" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function getCountryByIsoCode(isoCode: string) {
  return COUNTRIES.find((country) => country.isoCode === isoCode) ?? DEFAULT_COUNTRY;
}
