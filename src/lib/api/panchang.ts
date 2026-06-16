  
  export interface PanchangParams {
  date?: string; // YYYY-MM-DD
  latitude?: number;
  longitude?: number;
  timezone?: string;
  ayanamsa?: string;
}

// ─── Hindu festival calendar 2026-2027 ───────────────────────────────────────
const HINDU_FESTIVALS: Array<{ isoDate: string; name: string }> = [
  { isoDate: '2026-01-14', name: 'Makar Sankranti' },
  { isoDate: '2026-01-14', name: 'Pongal' },
  { isoDate: '2026-01-26', name: 'Republic Day' },
  { isoDate: '2026-02-03', name: 'Basant Panchami' },
  { isoDate: '2026-02-17', name: 'Mahashivratri' },
  { isoDate: '2026-03-01', name: 'Holika Dahan' },
  { isoDate: '2026-03-02', name: 'Holi' },
  { isoDate: '2026-03-25', name: 'Chaitra Navratri Begins' },
  { isoDate: '2026-04-02', name: 'Ram Navami' },
  { isoDate: '2026-04-05', name: 'Hanuman Jayanti' },
  { isoDate: '2026-04-14', name: 'Baisakhi' },
  { isoDate: '2026-04-14', name: 'Tamil New Year' },
  { isoDate: '2026-04-25', name: 'Akshaya Tritiya' },
  { isoDate: '2026-05-01', name: 'Buddha Purnima' },
  { isoDate: '2026-05-02', name: 'Jyeshtha Begins *North' },
  { isoDate: '2026-05-02', name: 'Narada Jayanti' },
  { isoDate: '2026-05-03', name: 'World Laughter Day' },
  { isoDate: '2026-05-04', name: 'Agni Nakshatram Begins' },
  { isoDate: '2026-05-05', name: 'Ekadanta Sankashti Chaturthi' },
  { isoDate: '2026-05-07', name: 'Rabindranath Tagore Jayanti' },
  { isoDate: '2026-05-09', name: 'Kalashtami' },
  { isoDate: '2026-05-09', name: 'Masik Krishna Janmashtami' },
  { isoDate: '2026-05-09', name: 'Tagore Jayanti *Bengal' },
  { isoDate: '2026-05-10', name: "Mother's Day" },
  { isoDate: '2026-05-12', name: 'Hanuman Jayanti *Telugu' },
  { isoDate: '2026-05-13', name: 'Apara Ekadashi' },
  { isoDate: '2026-05-14', name: 'Pradosh Vrat' },
  { isoDate: '2026-05-15', name: 'Masik Shivaratri' },
  { isoDate: '2026-05-16', name: 'Darsha Amavasya' },
  { isoDate: '2026-05-17', name: 'Shani Jayanti' },
  { isoDate: '2026-05-18', name: 'Adhika Chandra Darshan' },
  { isoDate: '2026-05-18', name: 'Rohini Vrat' },
  { isoDate: '2026-05-20', name: 'Adhika Vinayaka Chaturthi' },
  { isoDate: '2026-05-21', name: 'Adhika Skanda Sashti' },
  { isoDate: '2026-05-24', name: 'Adhika Masik Durgashtami' },
  { isoDate: '2026-05-25', name: 'Ganga Dussehra' },
  { isoDate: '2026-05-27', name: 'Padmini Ekadashi' },
  { isoDate: '2026-05-28', name: 'Adhika Pradosh Vrat' },
  { isoDate: '2026-05-31', name: 'Jyeshtha Adhika Purnima' },
  { isoDate: '2026-06-04', name: 'Sankashti Chaturthi' },
  { isoDate: '2026-06-10', name: 'Masik Durgashtami' },
  { isoDate: '2026-06-11', name: 'Nirjala Ekadashi' },
  { isoDate: '2026-06-12', name: 'Pradosh Vrat' },
  { isoDate: '2026-06-14', name: 'Vat Purnima Vrat' },
  { isoDate: '2026-06-14', name: 'Jyeshtha Purnima' },
  { isoDate: '2026-06-27', name: 'Yogini Ekadashi' },
  { isoDate: '2026-06-28', name: 'Pradosh Vrat' },
  { isoDate: '2026-06-30', name: 'Ashadha Amavasya' },
  { isoDate: '2026-07-01', name: 'Jagannath Rath Yatra' },
  { isoDate: '2026-07-03', name: 'Sankashti Chaturthi' },
  { isoDate: '2026-07-11', name: 'Devshayani Ekadashi' },
  { isoDate: '2026-07-12', name: 'Pradosh Vrat' },
  { isoDate: '2026-07-13', name: 'Guru Purnima' },
  { isoDate: '2026-07-25', name: 'Kamika Ekadashi' },
  { isoDate: '2026-07-27', name: 'Pradosh Vrat' },
  { isoDate: '2026-07-28', name: 'Hariyali Amavasya' },
  { isoDate: '2026-08-09', name: 'Putrada Ekadashi' },
  { isoDate: '2026-08-11', name: 'Pradosh Vrat' },
  { isoDate: '2026-08-12', name: 'Shravan Purnima' },
  { isoDate: '2026-08-13', name: 'Rakshabandhan' },
  { isoDate: '2026-08-16', name: 'Kajari Teej' },
  { isoDate: '2026-08-19', name: 'Janmashtami' },
  { isoDate: '2026-08-23', name: 'Aja Ekadashi' },
  { isoDate: '2026-08-26', name: 'Pradosh Vrat' },
  { isoDate: '2026-08-27', name: 'Bhadrapada Amavasya' },
  { isoDate: '2026-09-02', name: 'Hartalika Teej' },
  { isoDate: '2026-09-03', name: 'Ganesh Chaturthi' },
  { isoDate: '2026-09-08', name: 'Radha Ashtami' },
  { isoDate: '2026-09-13', name: 'Parivartini Ekadashi' },
  { isoDate: '2026-09-15', name: 'Pradosh Vrat' },
  { isoDate: '2026-09-16', name: 'Anant Chaturdashi' },
  { isoDate: '2026-09-17', name: 'Bhadrapada Purnima' },
  { isoDate: '2026-09-23', name: 'Pitru Paksha Begins' },
  { isoDate: '2026-09-27', name: 'Indira Ekadashi' },
  { isoDate: '2026-09-29', name: 'Pradosh Vrat' },
  { isoDate: '2026-10-07', name: 'Sarva Pitru Amavasya' },
  { isoDate: '2026-10-08', name: 'Shardiya Navratri Begins' },
  { isoDate: '2026-10-15', name: 'Maha Ashtami' },
  { isoDate: '2026-10-16', name: 'Maha Navami' },
  { isoDate: '2026-10-16', name: 'Dussehra (Vijaya Dashami)' },
  { isoDate: '2026-10-20', name: 'Sharad Purnima' },
  { isoDate: '2026-10-29', name: 'Karwa Chauth' },
  { isoDate: '2026-11-01', name: 'Ahoi Ashtami' },
  { isoDate: '2026-11-05', name: 'Dhanteras' },
  { isoDate: '2026-11-06', name: 'Narak Chaturdashi' },
  { isoDate: '2026-11-07', name: 'Diwali' },
  { isoDate: '2026-11-08', name: 'Govardhan Puja' },
  { isoDate: '2026-11-09', name: 'Bhai Dooj' },
  { isoDate: '2026-11-15', name: 'Chhath Puja' },
  { isoDate: '2026-11-25', name: 'Utpanna Ekadashi' },
  { isoDate: '2026-12-06', name: 'Vivah Panchami' },
  { isoDate: '2026-12-10', name: 'Mokshada Ekadashi' },
  { isoDate: '2026-12-13', name: 'Dattatreya Jayanti' },
  { isoDate: '2026-12-25', name: 'Christmas' },
  { isoDate: '2027-01-01', name: "New Year's Day" },
  { isoDate: '2027-01-14', name: 'Makar Sankranti' },
  { isoDate: '2027-02-05', name: 'Basant Panchami' },
  { isoDate: '2027-02-19', name: 'Maha Shivaratri' },
  { isoDate: '2027-03-22', name: 'Holi' },
];

/** Returns next 25 festivals from (and including) the given YYYY-MM-DD date. */
function getUpcomingFestivals(fromDate?: string): Array<{ date: string; name: string }> {
  const from = fromDate ? new Date(fromDate + 'T00:00:00') : new Date();
  from.setHours(0, 0, 0, 0);
  return HINDU_FESTIVALS
    .filter(f => new Date(f.isoDate + 'T00:00:00') >= from)
    .slice(0, 25)
    .map(f => ({
      date: new Date(f.isoDate + 'T12:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
      name: f.name,
    }));
}

// ─── Helper: ISO datetime → readable IST time ────────────────────────────────
function toTime(iso?: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
    });
  } catch { return ''; }
}

// ─── Moon Sign from nakshatra number (1-27) ──────────────────────────────────
// 27 nakshatras / 12 rashis = 2.25 nakshatras per rashi
const RASHI_EN = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
];
function getMoonSign(nakshatraNum: number): string {
  if (!nakshatraNum) return '';
  const idx = Math.min(Math.ceil(nakshatraNum / 2.25) - 1, 11);
  return RASHI_EN[idx];
}

// ─── Moon placement: North (1-14) / South (15-27) based on nakshatra ─────────
function getMoonPlacement(nakshatraNum: number): string {
  if (!nakshatraNum) return '';
  return nakshatraNum <= 14 ? 'NORTH' : 'SOUTH';
}

// ─── Sun Sign (sidereal/Lahiri) from Gregorian date ──────────────────────────
// Approximate sankranti dates (day sun enters each sidereal rashi)
const SUN_SIGN_TRANSITIONS: Array<{ rashi: string; month: number; day: number }> = [
  { rashi: 'Sagittarius', month: 12, day: 16 },
  { rashi: 'Scorpio',     month: 11, day: 17 },
  { rashi: 'Libra',       month: 10, day: 18 },
  { rashi: 'Virgo',       month:  9, day: 17 },
  { rashi: 'Leo',         month:  8, day: 17 },
  { rashi: 'Cancer',      month:  7, day: 17 },
  { rashi: 'Gemini',      month:  6, day: 15 },
  { rashi: 'Taurus',      month:  5, day: 15 },
  { rashi: 'Aries',       month:  4, day: 14 },
  { rashi: 'Pisces',      month:  3, day: 15 },
  { rashi: 'Aquarius',    month:  2, day: 13 },
  { rashi: 'Capricorn',   month:  1, day: 15 },
];
function getSunSign(date: Date): string {
  const m = date.getMonth() + 1, d = date.getDate();
  for (const t of SUN_SIGN_TRANSITIONS) {
    if (m > t.month || (m === t.month && d >= t.day)) return t.rashi;
  }
  return 'Sagittarius';
}

// ─── Lunar month names from tithi paksha + solar month ───────────────────────
const LUNAR_MONTHS = [
  'Chaitra','Vaishakh','Jyeshtha','Ashadha',
  'Shravan','Bhadrapada','Ashwin','Kartik',
  'Margashirsha','Pausha','Magha','Phalguna',
];
function getLunarMonths(date: Date, paksha: string): { amanta: string; purnimanta: string } {
  // Map solar month index (0-11) → approximate amanta lunar month index
  const solarToAmanta = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  let idx = solarToAmanta[date.getMonth()];
  // In Krishna Paksha the amanta month is the same; Shukla is next
  const amanta = LUNAR_MONTHS[idx];
  const purnimanta = LUNAR_MONTHS[(idx + 1) % 12];
  return { amanta, purnimanta };
}

// ─── Vikram & Shaka Samvat ────────────────────────────────────────────────────
// 60-year Jovian cycle names (Brihaspati Samvatsara)
const SAMVATSARA = [
  'Prabhava','Vibhava','Shukla','Pramoda','Prajapati','Angiras',
  'Shrimukha','Bhava','Yuvan','Dhatri','Ishvara','Bahudhanya',
  'Pramathi','Vikrama','Vrisha','Chitrabhanu','Svabhanu','Tarana',
  'Parthiva','Vyaya','Sarvajit','Sarvadhari','Virodhi','Vikrita',
  'Khara','Nandana','Vijaya','Jaya','Manmatha','Durmukha',
  'Hevilambi','Vilambi','Vikari','Sharvari','Plava','Shubhakrit',
  'Shobhakrit','Krodhi','Vishvavasu','Parabhava','Plavanga','Kilaka',
  'Saumya','Sadharana','Virodhikrit','Paridhavi','Pramadicha','Ananda',
  'Rakshasa','Nala','Pingala','Kalayukti','Siddharthi','Raudra',
  'Durmathi','Dundubhi','Rudhirodgari','Raktakshi','Krodhana','Akshaya',
];
function getSamvat(date: Date): { vikram: string; shaka: string } {
  const m = date.getMonth() + 1;
  // Hindu New Year (Chaitra Shukla 1) is roughly mid-March to mid-April
  // After April the new Vikram Samvat has started
  const vikram = date.getFullYear() + (m >= 4 ? 57 : 56);
  const shaka  = date.getFullYear() + (m >= 4 ? -78 : -79);
  const vName = SAMVATSARA[(vikram - 1) % 60];
  const sName = SAMVATSARA[(shaka  - 1) % 60];
  return {
    vikram: `${vikram} (${vName})`,
    shaka:  `${shaka} (${sName})`,
  };
}

// ─── Dishashool (inauspicious direction) by weekday ──────────────────────────
const DISHASHOOL_MAP: Record<string, string> = {
  Sunday: 'West', Monday: 'East', Tuesday: 'North',
  Wednesday: 'North', Thursday: 'South', Friday: 'West', Saturday: 'East',
};

// ─── Season (Ritu) from date ──────────────────────────────────────────────────
function getSeason(date: Date): string {
  const m = date.getMonth() + 1, d = date.getDate();
  if ((m === 3 && d >= 15) || m === 4 || (m === 5 && d < 15)) return 'Vasant';
  if ((m === 5 && d >= 15) || m === 6 || (m === 7 && d < 17)) return 'Grishma';
  if ((m === 7 && d >= 17) || m === 8 || (m === 9 && d < 17)) return 'Varsha';
  if ((m === 9 && d >= 17) || m === 10 || (m === 11 && d < 17)) return 'Sharad';
  if ((m === 11 && d >= 17) || m === 12 || (m === 1 && d < 14)) return 'Hemant';
  return 'Shishir';
}

// ─── Ayana from date ─────────────────────────────────────────────────────────
function getAyana(date: Date): string {
  const m = date.getMonth() + 1, d = date.getDate();
  const afterMakarSankranti = m > 1 || (m === 1 && d >= 14);
  const beforeKarkSankranti  = m < 7 || (m === 7 && d <= 16);
  return afterMakarSankranti && beforeKarkSankranti ? 'Uttarayana' : 'Dakshinayana';
}

// ─── Exact Calculation Helper ────────────────────────────────────────────────
function calculateExactTimings(dateObj: Date, longitude: number) {
  const day = dateObj.getDay(); // 0-6 (0 = Sunday)

  const rahuStarts = [16.5, 7.5, 15.0, 12.0, 13.5, 10.5, 9.0];
  const yamaStarts = [12.0, 10.5, 9.0, 7.5, 6.0, 15.0, 13.5];
  const guliStarts = [15.0, 13.5, 12.0, 10.5, 9.0, 7.5, 6.0];

  // Offset in minutes to adjust Local Mean Time (LMT) to IST (82.5° E)
  const offsetMins = Math.round((82.5 - longitude) * 4);

  const formatTime = (hours: number) => {
    let totalMins = Math.round(hours * 60) + offsetMins;
    if (totalMins < 0) totalMins += 24 * 60;
    
    let h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    
    const ampm = h >= 12 ? 'pm' : 'am';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return {
    auspiciousTimings: {
      abhijit: {
        start: formatTime(11.6), // 11:36 AM
        end: formatTime(12.4),   // 12:24 PM
      }
    },
    inauspiciousTimings: {
      rahu: {
        start: formatTime(rahuStarts[day]),
        end: formatTime(rahuStarts[day] + 1.5),
      },
      yamghant: {
        start: formatTime(yamaStarts[day]),
        end: formatTime(yamaStarts[day] + 1.5),
      },
      gulik: {
        start: formatTime(guliStarts[day]),
        end: formatTime(guliStarts[day] + 1.5),
      }
    }
  };
}

// ─── Main normalizer ──────────────────────────────────────────────────────────
function normalizeApiResponse(raw: any, queryDate?: string, reqLongitude?: number): any {
  const tithi    = raw.tithi    ?? {};
  const nakshatra = raw.nakshatra ?? {};
  const yoga     = raw.yoga     ?? {};
  const karana   = raw.karana   ?? {};

  // Parse date for calculations
  const date = queryDate ? new Date(queryDate + 'T12:00:00') : new Date();

  const nakshatraNum: number = nakshatra.number ?? 0;
  const weekday: string      = raw.weekday ?? '';
  const paksha: string       = tithi.paksha ?? '';

  const { amanta, purnimanta } = getLunarMonths(date, paksha);
  const { vikram, shaka }      = getSamvat(date);

  const exactTimings = calculateExactTimings(date, reqLongitude || raw.location?.longitude || 82.9739);

  return {
    queryDate: queryDate || new Date().toISOString(),

    tithi: {
      name:    tithi.name    ?? '',
      endTime: tithi.end_time ? toTime(tithi.end_time) : (tithi.endTime ?? ''),
    },
    nakshatra: {
      name:    nakshatra.name    ?? '',
      endTime: nakshatra.end_time ? toTime(nakshatra.end_time) : (nakshatra.endTime ?? ''),
    },
    yoga: {
      name:    yoga.name    ?? '',
      endTime: yoga.end_time ? toTime(yoga.end_time) : (yoga.endTime ?? ''),
    },
    karana: {
      name:    karana.name    ?? '',
      endTime: karana.end_time ? toTime(karana.end_time) : (karana.endTime ?? ''),
    },

    month:  { amanta, purnimanta },
    samvat: { vikram, shaka },

    sun: {
      sign: getSunSign(date),
      rise: raw.sunrise ? toTime(raw.sunrise) : '',
      set:  raw.sunset  ? toTime(raw.sunset)  : '',
    },
    moon: {
      sign:      getMoonSign(nakshatraNum),
      rise:      raw.moonrise ? toTime(raw.moonrise) : '',
      set:       raw.moonset  ? toTime(raw.moonset)  : '',
      placement: getMoonPlacement(nakshatraNum),
    },

    dishashool: DISHASHOOL_MAP[weekday] ?? '',
    season:     getSeason(date),
    ayana:      getAyana(date),
    festival:   raw.festival ?? '',

    auspiciousTimings: exactTimings.auspiciousTimings,
    inauspiciousTimings: exactTimings.inauspiciousTimings,

    upcomingFestivals: (raw.upcomingFestivals?.length || raw.upcoming_festivals?.length)
      ? (raw.upcomingFestivals ?? raw.upcoming_festivals)
      : getUpcomingFestivals(queryDate),
  };
}

let cachedToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  
  // Initialize from env if first time
  const envToken = process.env.ASTROVED_API_TOKEN || process.env.AstroVed_API_TOKEN;
  if (envToken) {
    cachedToken = envToken;
    return cachedToken;
  }
  return '';
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = process.env.ASTROVED_REFRESH_TOKEN || '';
      if (!refreshToken) {
        console.warn('Panchang API: No refresh token available in env.');
        return null;
      }

      // Use the provided refresh API URL
      const refreshUrl = process.env.ASTROVED_REFRESH_API_URL || 'https://qaengine.astroved.com/api/v1/auth/refresh';
      console.log('Panchang API: Attempting to refresh token via', refreshUrl);

      const res = await fetch(refreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        console.error('Panchang API: Failed to refresh token. Status:', res.status);
        return null;
      }

      const data = await res.json();
      // Adjust this depending on actual API response format (e.g., data.access_token)
      const newToken = data.access_token || data.token || data.jwt || data.JWT_Token || data.Token;
      
      if (newToken) {
        cachedToken = newToken;
        console.log('Panchang API: Successfully refreshed access token.');
        return newToken;
      }
      return null;
    } catch (error) {
      console.error('Panchang API: Error during token refresh:', error);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Fetch & return normalized panchang data ──────────────────────────────────
export async function fetchPanchangData(params: PanchangParams = {}) {
  const {
    date,
    latitude  = 25.3176,        // Varanasi
    longitude = 82.9739,
    timezone  = 'Asia/Kolkata',
    ayanamsa  = 'LAHIRI',
  } = params;

  let url    = 'https://qaengine.AstroVed.com/api/v2/today-panchanga';
  let method = 'GET';
  let body: string | undefined;

  if (date) {
    url    = 'https://qaengine.AstroVed.com/api/v1/panchanga/comprehensive';
    method = 'POST';
    body   = JSON.stringify({ datetime_local: `${date}T00:00:00`, timezone, latitude, longitude, ayanamsa });
  } else {
    url = `${url}?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&ayanamsa=${ayanamsa}`;
  }

  // Token lives only in .env.local — never sent to the browser
  let token = await getAccessToken();

  if (!token) {
    console.warn('Panchang API: No API Token found in .env.local. Using dummy data immediately.');
    return getDummyPanchangData(date, latitude, longitude);
  }

  // Helper to make the API request with a specific token
  const makeRequest = async (currentToken: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body,
        next: { revalidate: 3600 },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  try {
    let res = await makeRequest(token);

    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Panchang API: 401 Unauthorized — Attempting token refresh...');
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Retry the request with the new token
          res = await makeRequest(newToken);
          if (!res.ok) {
            console.warn(`Panchang API: Retried request failed with status: ${res.status}. Falling back to dummy data.`);
            return getDummyPanchangData(date, latitude, longitude);
          }
        } else {
          console.warn('Panchang API: Token refresh failed or returned no token. Falling back to dummy data.');
          return getDummyPanchangData(date, latitude, longitude);
        }
      } else {
        throw new Error(`Panchang API error: ${res.status}`);
      }
    }

    const raw = await res.json();
    return normalizeApiResponse(raw, date, longitude);
  } catch (err) {
    console.error('fetchPanchangData error:', err);
    return getDummyPanchangData(date, latitude, longitude);
  }
}

// ─── Fallback dummy data (used when API is unavailable) ───────────────────────
function getDummyPanchangData(queryDate?: string, lat?: number, lon?: number) {
  const base = queryDate ? new Date(queryDate + 'T12:00:00') : new Date();
  const d    = base.getDate();
  const tithis     = ['Pratipada','Dwitiya','Tritiyaa','Chaturthi','Panchami'];
  const nakshatras = [{ name: 'Ashwini', num: 1 }, { name: 'Bharani', num: 2 },
                      { name: 'Krittika', num: 3 }, { name: 'Rohini', num: 4 },
                      { name: 'Jyeshtha', num: 18 }];
  const nak = nakshatras[d % nakshatras.length];
  const { amanta, purnimanta } = getLunarMonths(base, 'Krishna');
  const { vikram, shaka }      = getSamvat(base);

  // Adjust dummy time slightly based on longitude to reflect location changes in UI
  const actualLon = lon || 82.9739; 
  const shiftMins = Math.round((82.5 - actualLon) * 4);
  const shift = (timeStr: string) => {
    try {
      const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/);
      if (!match) return timeStr;
      let h = parseInt(match[1]), m = parseInt(match[2]);
      const ampm = match[3];
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      let total = h * 60 + m - shiftMins;
      if (total < 0) total += 24 * 60;
      let newH = Math.floor(total / 60) % 24;
      const newM = total % 60;
      const newAmpm = newH >= 12 ? 'PM' : 'AM';
      if (newH > 12) newH -= 12;
      if (newH === 0) newH = 12;
      return `${newH}:${newM.toString().padStart(2, '0')} ${newAmpm}`;
    } catch { return timeStr; }
  };


  return {
    queryDate:  base.toISOString(),
    tithi:      { name: `Krishna-Paksha ${tithis[d % tithis.length]}`, endTime: shift('5:25 AM') },
    nakshatra:  { name: nak.name, endTime: shift('9:58 AM') },
    yoga:       { name: 'Parigh', endTime: shift('11:19 PM') },
    karana:     { name: 'Vanija', endTime: shift('4:13 PM') },
    month:      { amanta, purnimanta },
    samvat:     { vikram, shaka },
    sun:        { sign: getSunSign(base), rise: shift('5:21 AM'), set: shift('6:31 PM') },
    moon:       { sign: getMoonSign(nak.num), rise: shift('9:05 PM'), set: shift('6:42 AM'), placement: getMoonPlacement(nak.num) },
    dishashool: DISHASHOOL_MAP[base.toLocaleDateString('en-US', { weekday: 'long' })] ?? 'East',
    season:     getSeason(base),
    ayana:      getAyana(base),
    festival:   'Ekadanta Sankashti Chaturthi',
    auspiciousTimings:   { abhijit: { start: shift('11:30 AM'), end: shift('12:22 PM') } },
    inauspiciousTimings: {
      rahu:     { start: shift('6:59 AM'),  end: shift('8:38 AM') },
      gulik:    { start: shift('1:34 PM'),  end: shift('3:13 PM') },
      yamghant: { start: shift('10:17 AM'), end: shift('11:56 AM') },
    },
    upcomingFestivals: getUpcomingFestivals(queryDate),
  };
}

