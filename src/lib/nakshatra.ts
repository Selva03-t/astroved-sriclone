export interface AstroDetails {
  nakshatra: string;
  pada: number;
  rasi: string;
  tithi: string;
  gana: string;
  nadi: string;
  yoni: string;
  lord: string;
  alphabet: string;
}

interface NakshatraMeta {
  gana: string;
  nadi: string;
  yoni: string;
  lord: string;
  alphabet: string;
}

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

const RASIS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const TITHIS = [
  "Shukla Pratipada",
  "Shukla Dwitiya",
  "Shukla Tritiya",
  "Shukla Chaturthi",
  "Shukla Panchami",
  "Shukla Shashthi",
  "Shukla Saptami",
  "Shukla Ashtami",
  "Shukla Navami",
  "Shukla Dashami",
  "Shukla Ekadashi",
  "Shukla Dwadashi",
  "Shukla Trayodashi",
  "Shukla Chaturdashi",
  "Purnima",
  "Krishna Pratipada",
  "Krishna Dwitiya",
  "Krishna Tritiya",
  "Krishna Chaturthi",
  "Krishna Panchami",
  "Krishna Shashthi",
  "Krishna Saptami",
  "Krishna Ashtami",
  "Krishna Navami",
  "Krishna Dashami",
  "Krishna Ekadashi",
  "Krishna Dwadashi",
  "Krishna Trayodashi",
  "Krishna Chaturdashi",
  "Amavasya",
] as const;

const NAKSHATRA_META: Record<(typeof NAKSHATRAS)[number], NakshatraMeta> = {
  Ashwini: { gana: "Deva", nadi: "Adi", yoni: "Horse", lord: "Ketu", alphabet: "Chu" },
  Bharani: { gana: "Manushya", nadi: "Madhya", yoni: "Elephant", lord: "Venus", alphabet: "Li" },
  Krittika: { gana: "Rakshasa", nadi: "Antya", yoni: "Sheep", lord: "Sun", alphabet: "A" },
  Rohini: { gana: "Manushya", nadi: "Antya", yoni: "Serpent", lord: "Moon", alphabet: "Vi" },
  Mrigashira: { gana: "Deva", nadi: "Madhya", yoni: "Serpent", lord: "Mars", alphabet: "Ve" },
  Ardra: { gana: "Manushya", nadi: "Adi", yoni: "Dog", lord: "Rahu", alphabet: "Ku" },
  Punarvasu: { gana: "Deva", nadi: "Adi", yoni: "Cat", lord: "Jupiter", alphabet: "Ke" },
  Pushya: { gana: "Deva", nadi: "Madhya", yoni: "Sheep", lord: "Saturn", alphabet: "Hu" },
  Ashlesha: { gana: "Rakshasa", nadi: "Antya", yoni: "Cat", lord: "Mercury", alphabet: "De" },
  Magha: { gana: "Rakshasa", nadi: "Antya", yoni: "Rat", lord: "Ketu", alphabet: "Ma" },
  "Purva Phalguni": { gana: "Manushya", nadi: "Madhya", yoni: "Rat", lord: "Venus", alphabet: "Mo" },
  "Uttara Phalguni": { gana: "Manushya", nadi: "Adi", yoni: "Cow", lord: "Sun", alphabet: "Te" },
  Hasta: { gana: "Deva", nadi: "Adi", yoni: "Buffalo", lord: "Moon", alphabet: "Pu" },
  Chitra: { gana: "Rakshasa", nadi: "Madhya", yoni: "Tiger", lord: "Mars", alphabet: "Pe" },
  Swati: { gana: "Deva", nadi: "Antya", yoni: "Buffalo", lord: "Rahu", alphabet: "Ru" },
  Vishakha: { gana: "Rakshasa", nadi: "Antya", yoni: "Tiger", lord: "Jupiter", alphabet: "Ti" },
  Anuradha: { gana: "Deva", nadi: "Madhya", yoni: "Deer", lord: "Saturn", alphabet: "Na" },
  Jyeshtha: { gana: "Rakshasa", nadi: "Adi", yoni: "Deer", lord: "Mercury", alphabet: "No" },
  Mula: { gana: "Rakshasa", nadi: "Adi", yoni: "Dog", lord: "Ketu", alphabet: "Ye" },
  "Purva Ashadha": { gana: "Manushya", nadi: "Madhya", yoni: "Monkey", lord: "Venus", alphabet: "Bhu" },
  "Uttara Ashadha": { gana: "Manushya", nadi: "Antya", yoni: "Mongoose", lord: "Sun", alphabet: "Bhe" },
  Shravana: { gana: "Deva", nadi: "Antya", yoni: "Monkey", lord: "Moon", alphabet: "Ju" },
  Dhanishta: { gana: "Rakshasa", nadi: "Madhya", yoni: "Lion", lord: "Mars", alphabet: "Ga" },
  Shatabhisha: { gana: "Rakshasa", nadi: "Adi", yoni: "Horse", lord: "Rahu", alphabet: "Go" },
  "Purva Bhadrapada": { gana: "Manushya", nadi: "Adi", yoni: "Lion", lord: "Jupiter", alphabet: "Se" },
  "Uttara Bhadrapada": { gana: "Manushya", nadi: "Madhya", yoni: "Cow", lord: "Saturn", alphabet: "Du" },
  Revati: { gana: "Deva", nadi: "Antya", yoni: "Elephant", lord: "Mercury", alphabet: "De" },
};

export function getJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function getAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 22.460148 + 1.396042 * T + 0.000308 * T * T;
}

function getMoonLongitude(jd: number): number {
  const daysSinceJ2000 = jd - 2451545.0;
  const meanLongitude = 218.316 + 13.176396 * daysSinceJ2000;
  const meanAnomaly = 134.963 + 13.064993 * daysSinceJ2000;
  const meanAnomalyRadians = (normalizeDegrees(meanAnomaly) * Math.PI) / 180;
  const trueLongitude = normalizeDegrees(meanLongitude) + 6.289 * Math.sin(meanAnomalyRadians);
  return normalizeDegrees(trueLongitude);
}

function getSunLongitude(jd: number): number {
  const daysSinceJ2000 = jd - 2451545.0;
  const meanLongitude = 280.46 + 0.9856474 * daysSinceJ2000;
  const meanAnomaly = 357.528 + 0.9856003 * daysSinceJ2000;
  const anomalyRadians = (normalizeDegrees(meanAnomaly) * Math.PI) / 180;
  const trueLongitude =
    normalizeDegrees(meanLongitude) +
    1.915 * Math.sin(anomalyRadians) +
    0.02 * Math.sin(2 * anomalyRadians);

  return normalizeDegrees(trueLongitude);
}

export function getAstroDetails(date: Date): AstroDetails {
  const jd = getJulianDate(date);
  const ayanamsa = getAyanamsa(jd);

  const moonSiderealLongitude = normalizeDegrees(getMoonLongitude(jd) - ayanamsa);
  const sunSiderealLongitude = normalizeDegrees(getSunLongitude(jd) - ayanamsa);

  const nakshatraSpan = 360 / 27;
  const nakshatraIndex = Math.floor(moonSiderealLongitude / nakshatraSpan);
  const pada = Math.floor((moonSiderealLongitude % nakshatraSpan) / (nakshatraSpan / 4)) + 1;

  const rasiIndex = Math.floor(moonSiderealLongitude / 30);
  const tithiAngle = normalizeDegrees(moonSiderealLongitude - sunSiderealLongitude);
  const tithiIndex = Math.floor(tithiAngle / 12);

  const nakshatra = NAKSHATRAS[nakshatraIndex] ?? "Ashwini";
  const meta = NAKSHATRA_META[nakshatra];

  return {
    nakshatra,
    pada,
    rasi: RASIS[rasiIndex] ?? "Aries",
    tithi: TITHIS[tithiIndex] ?? "Shukla Pratipada",
    gana: meta.gana,
    nadi: meta.nadi,
    yoni: meta.yoni,
    lord: meta.lord,
    alphabet: meta.alphabet,
  };
}
