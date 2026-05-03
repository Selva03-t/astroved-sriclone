import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type PujaPackage = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type PujaStat = {
  label: string;
  value: string;
  detail?: string;
};

type PujaSection = {
  title: string;
  description: string;
};

type PujaFaq = {
  question: string;
  answer: string;
};

type PujaDetails = {
  heroTitle: string;
  heroSubtitle: string;
  strengthFor: string;
  ritualSummary: string;
  templeName: string;
  templeLocation: string;
  templeNote?: string;
  about: string;
  stats: PujaStat[];
  benefits: PujaSection[];
  process: PujaSection[];
  inclusions: string[];
  faq: PujaFaq[];
};

type PujaOffering = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
};

type PujaRecord = {
  _id?: ObjectId | string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  badge?: string;
  shortTitle?: string;
  buttonText?: string;
  location?: string;
  date?: string;
  eventDateTime?: string;
  templeVenue?: string;
  templeNote?: string;
  slug?: string;
  details?: PujaDetails;
  packages?: PujaPackage[];
  offerings?: PujaOffering[];
  [key: string]: unknown;
};

const normalizeOfferings = (items: unknown) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [
      { id: "e1", name: "Vastra Daan", price: 501, description: "Offer sacred clothes to the deity", imageUrl: "https://cdn.astroved.com/images/puja/vastra-daan.jpg" },
      { id: "e2", name: "Anna Daan", price: 1101, description: "Feed the needy in your name", imageUrl: "https://cdn.astroved.com/images/puja/anna-daan.jpg" },
      { id: "e3", name: "Deep Daan", price: 251, description: "Lighting lamps for prosperity", imageUrl: "https://cdn.astroved.com/images/puja/deep-daan.jpg" },
      { id: "e4", name: "Gau Seva", price: 501, description: "Feeding sacred cows", imageUrl: "https://cdn.astroved.com/images/puja/gau-seva.jpg" },
    ];
  }
  return items.map((item, index) => {
    const off = item as Partial<PujaOffering>;
    return {
      id: off.id || `extra-${index + 1}`,
      name: off.name || "Special Offering",
      price: typeof off.price === 'number' ? off.price : Number(off.price || 0),
      description: off.description || "Divine offering for the deity",
      imageUrl: off.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=200&q=80"
    };
  });
};

const slugify = (value: any) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeSections = (items: unknown, fallback: PujaSection[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  return items.map((item) => {
    if (typeof item === 'string') {
      return { title: item, description: item };
    }

    if (item && typeof item === 'object') {
      const section = item as Partial<PujaSection>;
      return {
        title: section.title || section.description || fallback[0].title,
        description: section.description || section.title || fallback[0].description,
      };
    }

    return fallback[0];
  });
};

const normalizeFaq = (items: unknown, fallback: PujaFaq[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  return items.map((item) => {
    if (typeof item === 'string') {
      return { question: item, answer: item };
    }

    if (item && typeof item === 'object') {
      const faq = item as Partial<PujaFaq>;
      return {
        question: faq.question || fallback[0].question,
        answer: faq.answer || faq.question || fallback[0].answer,
      };
    }

    return fallback[0];
  });
};

const normalizePackages = (items: unknown, fallback: PujaPackage[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  const parsed = items
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const pkg = item as Partial<PujaPackage> & { title?: string; amount?: number | string };
      const name = typeof pkg.name === 'string' && pkg.name.trim() ? pkg.name.trim() : pkg.title;
      const priceSource = pkg.price ?? pkg.amount;
      const numericPrice = typeof priceSource === 'number' ? priceSource : Number(priceSource);

      if (!name || Number.isNaN(numericPrice)) {
        return null;
      }

      const safeId =
        typeof pkg.id === 'string' && pkg.id.trim().length > 0
          ? pkg.id.trim()
          : slugify(`${name}-${index + 1}`);

      return {
        id: safeId,
        name,
        price: numericPrice,
        description:
          typeof pkg.description === 'string' && pkg.description.trim().length > 0
            ? pkg.description.trim()
            : `Recommended for ${name.toLowerCase()} devotees.`,
      };
    })
    .filter((item): item is PujaPackage => item !== null);

  return parsed.length > 0 ? parsed : fallback;
};

const getStringField = (record: PujaRecord, key: string) => {
  const value = record[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
};

const getNumberField = (record: PujaRecord, key: string) => {
  const value = record[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const buildFlatPackages = (puja: PujaRecord): PujaPackage[] | undefined => {
  const defaultNames = ['Individual Package', 'Partner Package', 'Family + Bhog', 'Joint Family'];
  const result: PujaPackage[] = [];

  for (let i = 1; i <= 4; i += 1) {
    const name = getStringField(puja, `package${i}Name`) || defaultNames[i - 1];
    const price = getNumberField(puja, `package${i}Price`);
    const description =
      getStringField(puja, `package${i}Description`) || `Recommended for ${name.toLowerCase()} devotees.`;

    if (price === undefined) continue;

    result.push({
      id: slugify(`${name}-${i}`),
      name,
      price,
      description,
    });
  }

  return result.length > 0 ? result : undefined;
};

const buildSectionsFromFlatFields = (
  puja: PujaRecord,
  prefix: 'benefit' | 'process',
  fallback: PujaSection[]
) => {
  const sections: PujaSection[] = [];

  for (let i = 1; i <= 4; i += 1) {
    const title = getStringField(puja, `${prefix}${i}Title`);
    const description = getStringField(puja, `${prefix}${i}Description`);
    if (!title && !description) continue;

    sections.push({
      title: title || fallback[Math.min(i - 1, fallback.length - 1)].title,
      description: description || fallback[Math.min(i - 1, fallback.length - 1)].description,
    });
  }

  return sections.length > 0 ? sections : undefined;
};

const buildStatsFromFlatFields = (puja: PujaRecord) => {
  const stats: PujaStat[] = [];

  for (let i = 1; i <= 4; i += 1) {
    const label = getStringField(puja, `stat${i}Label`);
    const value = getStringField(puja, `stat${i}Value`);
    const detail = getStringField(puja, `stat${i}Detail`);
    if (!label && !value && !detail) continue;

    stats.push({
      label: label || defaultDetails.stats[Math.min(i - 1, defaultDetails.stats.length - 1)].label,
      value: value || defaultDetails.stats[Math.min(i - 1, defaultDetails.stats.length - 1)].value,
      detail,
    });
  }

  return stats.length > 0 ? stats : undefined;
};

const buildInclusionsFromFlatFields = (puja: PujaRecord) => {
  const inclusions: string[] = [];

  for (let i = 1; i <= 5; i += 1) {
    const inclusion = getStringField(puja, `inclusion${i}`);
    if (inclusion) inclusions.push(inclusion);
  }

  return inclusions.length > 0 ? inclusions : undefined;
};

const buildOfferingsFromFlatFields = (puja: PujaRecord): PujaOffering[] | undefined => {
  const offerings: PujaOffering[] = [];

  for (let i = 1; i <= 5; i += 1) {
    const name = getStringField(puja, `offering${i}Name`);
    const price = getNumberField(puja, `offering${i}Price`);
    const description = getStringField(puja, `offering${i}Description`);
    const imageUrl = getStringField(puja, `offering${i}ImageUrl`);

    if (name && price !== undefined) {
      offerings.push({
        id: slugify(`${name}-${i}`),
        name,
        price,
        description: description || `Recommended offering for ${name.toLowerCase()}.`,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=200&q=80"
      });
    }
  }

  return offerings.length > 0 ? offerings : undefined;
};

const buildFaqFromFlatFields = (puja: PujaRecord) => {
  const faqs: PujaFaq[] = [];

  for (let i = 1; i <= 3; i += 1) {
    const question = getStringField(puja, `faq${i}Question`);
    const answer = getStringField(puja, `faq${i}Answer`);
    if (!question && !answer) continue;

    faqs.push({
      question: question || defaultDetails.faq[Math.min(i - 1, defaultDetails.faq.length - 1)].question,
      answer: answer || defaultDetails.faq[Math.min(i - 1, defaultDetails.faq.length - 1)].answer,
    });
  }

  return faqs.length > 0 ? faqs : undefined;
};

const defaultPackages: PujaPackage[] = [
  {
    id: 'individual-package',
    name: 'Individual Package',
    price: 51,
    description: 'Best for one devotee with sankalp, mantra jaap and prasadam blessings.',
  },
  {
    id: 'partner-package',
    name: 'Partner Package',
    price: 81,
    description: 'For a couple or two devotees joining the puja together.',
  },
  {
    id: 'family-bhog',
    name: 'Family + Bhog',
    price: 151,
    description: 'Family sankalp with bhog offering and temple archana included.',
  },
  {
    id: 'joint-family',
    name: 'Joint Family',
    price: 221,
    description: 'Ideal for larger families seeking collective blessings and sankalp.',
  },
];

const defaultDetails: PujaDetails = {
  heroTitle: '11,00,000 Lakshmi Beej Mantra Jaap',
  heroSubtitle: '11,00,000 Lakshmi Beej Mantra Jaap, 1,10,000 Dashansh Havan and 108 Narvial Gola Purnahuti',
  strengthFor: 'For relief from financial obstacles, prosperity and stable wealth growth.',
  ritualSummary:
    'This grand mahapuja includes mantra chanting, dashansh havan, puja offerings and a special purnahuti performed by experienced pandits.',
  templeName: 'Shri Gajalakshmi Temple',
  templeLocation: 'Ujjain, Madhya Pradesh',
  templeNote: 'A revered spiritual center for prosperity and positive energy rituals.',
  about:
    'This puja is performed at a powerful Lakshmi kshetra to invoke abundance, prosperity, career growth and positive opportunities for devotees and their families.',
  stats: [
    { label: 'Mantra Jaap', value: '11,00,000', detail: 'Lakshmi Beej Mantra' },
    { label: 'Dashansh Havan', value: '1,10,000', detail: 'Special fire ritual' },
    { label: 'Purnahuti', value: '108', detail: 'Narvial Gola offering' },
    { label: 'Rating', value: '4.9/5', detail: 'Trusted by devotees' },
  ],
  benefits: [
    {
      title: 'Economic growth and stable wealth flow',
      description: 'Supports income stability, savings and long-term prosperity.',
    },
    {
      title: 'Career and business success',
      description: 'Encourages progress, recognition and new opportunities.',
    },
    {
      title: 'Removal of financial obstacles',
      description: 'Helps reduce hidden blocks, delays and recurring monetary stress.',
    },
    {
      title: 'Peace and positive energy',
      description: 'Creates a more balanced and auspicious home environment.',
    },
  ],
  process: [
    {
      title: 'Select Puja',
      description: 'Choose the package that matches your family or personal sankalp.',
    },
    {
      title: 'Add Offerings',
      description: 'Include offerings like flowers, bhog or special puja dravyas if needed.',
    },
    {
      title: 'Provide Sankalp Details',
      description: 'Enter your name and gothra so the puja is performed in your name.',
    },
    {
      title: 'Puja Updates and Video',
      description: 'Receive updates along with a puja video and completion details.',
    },
  ],
  inclusions: [
    'Experienced pandit-led ritual at the temple',
    'Your sankalp performed in your name',
    'Special mantra chanting and havan',
    'Puja update with completion details',
    'Prasadam or bhog as per selected package',
  ],
  faq: [
    {
      question: 'Do I need to be present in the temple?',
      answer: 'No. The puja is performed on your behalf and you receive the completion update remotely.',
    },
    {
      question: 'Can I book for my family?',
      answer: 'Yes. The package options include individual, partner, family + bhog and joint family options.',
    },
    {
      question: 'Will I receive a puja video?',
      answer: 'Yes. A puja update or video is shared after completion depending on the package and booking flow.',
    },
  ],
};

const fallbackPujas: PujaRecord[] = [
  {
    title: '11,00,000 Lakshmi Beej Mantra Jaap | 19th April 26',
    shortTitle: 'Akshaya Tritiya Special',
    subtitle: 'MAHAMANTRA ANUSH TTHI DEEP PUJA',
    badge: 'Special Event',
    description:
      'Become part of this rare grand mahapuja and receive divine blessings for wealth and prosperity.',
    imageUrl:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=1600&q=80',
    location: 'Shri Gajalakshmi Temple, Ujjain, Madhya Pradesh',
    date: '19-04-2026',
    eventDateTime: '2026-04-19T18:30',
    buttonText: 'Participate',
    slug: '1100000-lakshmi-beej-mantra-jaap-19th-april-26',
    details: defaultDetails,
    packages: defaultPackages,
  },
];

const normalizePuja = (puja: PujaRecord) => ({
  ...puja,
  title: puja.title || 'Untitled Puja',
  _id: puja._id ? String(puja._id) : slugify(puja.title || 'Untitled Puja'),
  buttonText: puja.buttonText || 'Participate',
  imageUrl:
    puja.imageUrl ||
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=1600&q=80',
  slug: puja.slug || slugify(puja.title || 'Untitled Puja'),
  eventDateTime: getStringField(puja, 'eventDateTime') || undefined,
  details: (() => {
    const flatDetails = {
      heroTitle: getStringField(puja, 'heroTitle'),
      heroSubtitle: getStringField(puja, 'heroSubtitle'),
      strengthFor: getStringField(puja, 'strengthFor'),
      ritualSummary: getStringField(puja, 'ritualSummary'),
      about: getStringField(puja, 'about'),
      templeName: getStringField(puja, 'templeVenue') || getStringField(puja, 'templeName'),
      templeLocation: getStringField(puja, 'templeLocation') || puja.location,
      templeNote: getStringField(puja, 'templeNote'),
      stats: buildStatsFromFlatFields(puja),
      benefits: buildSectionsFromFlatFields(puja, 'benefit', defaultDetails.benefits),
      process: buildSectionsFromFlatFields(puja, 'process', defaultDetails.process),
      inclusions: buildInclusionsFromFlatFields(puja),
      faq: buildFaqFromFlatFields(puja),
    };

    return {
      ...defaultDetails,
      ...(puja.details || {}),
      ...Object.fromEntries(Object.entries(flatDetails).filter(([, value]) => value !== undefined)),
      benefits: normalizeSections(flatDetails.benefits ?? puja.details?.benefits, defaultDetails.benefits),
      process: normalizeSections(flatDetails.process ?? puja.details?.process, defaultDetails.process),
      faq: normalizeFaq(flatDetails.faq ?? puja.details?.faq, defaultDetails.faq),
      inclusions:
        Array.isArray(flatDetails.inclusions) && flatDetails.inclusions.length > 0
          ? flatDetails.inclusions
          : Array.isArray(puja.details?.inclusions) && puja.details?.inclusions.length > 0
            ? puja.details!.inclusions.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            : defaultDetails.inclusions,
      stats:
        Array.isArray(flatDetails.stats) && flatDetails.stats.length > 0
          ? flatDetails.stats
          : Array.isArray(puja.details?.stats) && puja.details?.stats.length > 0
            ? puja.details!.stats
            : defaultDetails.stats,
      templeName:
        flatDetails.templeName || puja.details?.templeName || puja.templeVenue || defaultDetails.templeName,
      templeLocation:
        flatDetails.templeLocation || puja.details?.templeLocation || puja.location || defaultDetails.templeLocation,
      templeNote: flatDetails.templeNote || puja.details?.templeNote || puja.templeNote || defaultDetails.templeNote,
    };
  })(),
  packages: normalizePackages(buildFlatPackages(puja) ?? puja.packages, defaultPackages),
  offerings: buildOfferingsFromFlatFields(puja) ?? normalizeOfferings(puja.offerings),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('puja');

    if (req.method === 'POST') {
      const data = req.body;
      const result = await collection.insertOne(data);
      return res.status(201).json({ _id: result.insertedId, ...data });
    } else if (req.method === 'GET') {
      const { slug } = req.query;
      const items = await collection.find({}).toArray();
      const normalized = (items as PujaRecord[]).map(normalizePuja);
      const source = normalized.length > 0 ? normalized : fallbackPujas.map(normalizePuja);

      if (typeof slug === 'string' && slug.trim()) {
        const found = source.find((item) => item.slug === slug);
        if (!found) {
          return res.status(404).json({ error: 'Puja not found' });
        }
        return res.status(200).json(found);
      }

      return res.status(200).json(source);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await collection.deleteOne({ _id: new ObjectId(id as string) });
      return res.status(200).json({ success: true });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
