"use client";

import { PhoneInput } from "react-international-phone";
import type { CountryOption } from "@/types/auth";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/auth/countries";

type Props = {
  label: string;
  value: string;
  onChange: (digitsOnly: string) => void;
  country: CountryOption;
  onCountryChange: (country: CountryOption) => void;
  placeholder?: string;
  disabled?: boolean;
};

function mapIsoToLibCountry(isoCode: string) {
  return isoCode.toLowerCase();
}

function extractDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function inferCountryFromPhone(phoneE164Like: string) {
  const digits = extractDigits(phoneE164Like);
  // Naive best-effort: find the longest matching dial code
  let match: CountryOption | undefined;
  for (const c of COUNTRIES) {
    if (!c.dialCode) continue;
    if (digits.startsWith(c.dialCode)) {
      if (!match || c.dialCode.length > match.dialCode.length) match = c;
    }
  }
  return match ?? DEFAULT_COUNTRY;
}

export default function CountryPhoneField({
  label,
  value,
  onChange,
  country,
  onCountryChange,
  placeholder,
  disabled,
}: Props) {
  const e164Like = `+${country.dialCode}${value}`;

  return (
    <label className="block text-sm font-medium text-[#5a3b8a]">
      {label}
      <div className="mt-2 rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-3 py-2.5 transition-all focus-within:border-[#F47820] focus-within:ring-2 focus-within:ring-[#ddd1ff]">
        <PhoneInput
          value={e164Like}
          disabled={disabled}
          defaultCountry={mapIsoToLibCountry(DEFAULT_COUNTRY.isoCode)}
          onChange={(nextValue) => {
            const nextCountry = inferCountryFromPhone(nextValue);
            onCountryChange(nextCountry);

            const digits = extractDigits(nextValue);
            const numberOnly = digits.startsWith(nextCountry.dialCode) ? digits.slice(nextCountry.dialCode.length) : digits;
            onChange(numberOnly);
          }}
          inputProps={{
            inputMode: "numeric",
            autoComplete: "tel",
            placeholder: placeholder ?? "Enter number",
          }}
          className="astroved-phone"
        />
      </div>
    </label>
  );
}

