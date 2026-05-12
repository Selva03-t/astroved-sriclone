import ContentManager from "@/components/admin/ContentManager";

export default function AdminPujasPage() {
  const fields = [
    { name: "title", label: "Main Title", type: "text", required: true },
    { name: "slug", label: "Slug (optional)", type: "text", placeholder: "1100000-lakshmi-beej-mantra-jaap-19th-april-26" },
    { name: "shortTitle", label: "Short Title (on image)", type: "text" },
    { name: "subtitle", label: "Subtitle (Pink Text)", type: "text" },
    { name: "badge", label: "Badge (e.g. Special Event)", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "imageUrl", label: "Image URL", type: "url" },
    { name: "location", label: "Temple/Location", type: "text" },
    { name: "templeVenue", label: "Temple Venue Name", type: "text", placeholder: "Shri Gajalakshmi Temple" },
    { name: "templeNote", label: "Temple Venue Note", type: "textarea", placeholder: "Short temple significance or venue note." },
    { name: "date", label: "Date (DD-MM-YYYY)", type: "text", placeholder: "21-08-2026" },
    { name: "eventDateTime", label: "Countdown Date & Time", type: "datetime-local", placeholder: "2026-04-19T18:30" },
    { name: "buttonText", label: "Button Text", type: "text" },
    { name: "price", label: "Price", type: "number" },

    { name: "heroTitle", label: "Hero Title", type: "text" },
    { name: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
    { name: "strengthFor", label: "Strength/Use For", type: "textarea" },
    { name: "ritualSummary", label: "Ritual Summary", type: "textarea" },
    { name: "about", label: "About Puja", type: "textarea" },
    { name: "templeLocation", label: "Temple Location (Details Section)", type: "text" },

    { name: "benefit1Title", label: "Benefit 1 Title", type: "text" },
    { name: "benefit1Description", label: "Benefit 1 Description", type: "textarea" },
    { name: "benefit2Title", label: "Benefit 2 Title", type: "text" },
    { name: "benefit2Description", label: "Benefit 2 Description", type: "textarea" },
    { name: "benefit3Title", label: "Benefit 3 Title", type: "text" },
    { name: "benefit3Description", label: "Benefit 3 Description", type: "textarea" },
    { name: "benefit4Title", label: "Benefit 4 Title", type: "text" },
    { name: "benefit4Description", label: "Benefit 4 Description", type: "textarea" },

    { name: "process1Title", label: "Process 1 Title", type: "text" },
    { name: "process1Description", label: "Process 1 Description", type: "textarea" },
    { name: "process2Title", label: "Process 2 Title", type: "text" },
    { name: "process2Description", label: "Process 2 Description", type: "textarea" },
    { name: "process3Title", label: "Process 3 Title", type: "text" },
    { name: "process3Description", label: "Process 3 Description", type: "textarea" },
    { name: "process4Title", label: "Process 4 Title", type: "text" },
    { name: "process4Description", label: "Process 4 Description", type: "textarea" },

    { name: "inclusion1", label: "Inclusion 1", type: "text" },
    { name: "inclusion2", label: "Inclusion 2", type: "text" },
    { name: "inclusion3", label: "Inclusion 3", type: "text" },
    { name: "inclusion4", label: "Inclusion 4", type: "text" },
    { name: "inclusion5", label: "Inclusion 5", type: "text" },

    { name: "faq1Question", label: "FAQ 1 Question", type: "text" },
    { name: "faq1Answer", label: "FAQ 1 Answer", type: "textarea" },
    { name: "faq2Question", label: "FAQ 2 Question", type: "text" },
    { name: "faq2Answer", label: "FAQ 2 Answer", type: "textarea" },
    { name: "faq3Question", label: "FAQ 3 Question", type: "text" },
    { name: "faq3Answer", label: "FAQ 3 Answer", type: "textarea" },

    { name: "package1Name", label: "Package 1 Name", type: "text", placeholder: "Individual Package" },
    { name: "package1Price", label: "Package 1 Price", type: "number", placeholder: "51" },
    { name: "package1Description", label: "Package 1 Description", type: "textarea" },
    { name: "package2Name", label: "Package 2 Name", type: "text", placeholder: "Partner Package" },
    { name: "package2Price", label: "Package 2 Price", type: "number", placeholder: "81" },
    { name: "package2Description", label: "Package 2 Description", type: "textarea" },
    { name: "package3Name", label: "Package 3 Name", type: "text", placeholder: "Family + Bhog" },
    { name: "package3Price", label: "Package 3 Price", type: "number", placeholder: "151" },
    { name: "package3Description", label: "Package 3 Description", type: "textarea" },
    { name: "package4Name", label: "Package 4 Name", type: "text", placeholder: "Joint Family" },
    { name: "package4Price", label: "Package 4 Price", type: "number", placeholder: "221" },
    { name: "package4Description", label: "Package 4 Description", type: "textarea" },

    { name: "offering1Name", label: "Offering 1 Name", type: "text" },
    { name: "offering1Price", label: "Offering 1 Price", type: "number" },
    { name: "offering1Description", label: "Offering 1 Description", type: "textarea" },
    { name: "offering1ImageUrl", label: "Offering 1 Image URL", type: "url" },

    { name: "offering2Name", label: "Offering 2 Name", type: "text" },
    { name: "offering2Price", label: "Offering 2 Price", type: "number" },
    { name: "offering2Description", label: "Offering 2 Description", type: "textarea" },
    { name: "offering2ImageUrl", label: "Offering 2 Image URL", type: "url" },

    { name: "offering3Name", label: "Offering 3 Name", type: "text" },
    { name: "offering3Price", label: "Offering 3 Price", type: "number" },
    { name: "offering3Description", label: "Offering 3 Description", type: "textarea" },
    { name: "offering3ImageUrl", label: "Offering 3 Image URL", type: "url" },

    { name: "offering4Name", label: "Offering 4 Name", type: "text" },
    { name: "offering4Price", label: "Offering 4 Price", type: "number" },
    { name: "offering4Description", label: "Offering 4 Description", type: "textarea" },
    { name: "offering4ImageUrl", label: "Offering 4 Image URL", type: "url" },

    { name: "offering5Name", label: "Offering 5 Name", type: "text" },
    { name: "offering5Price", label: "Offering 5 Price", type: "number" },
    { name: "offering5Description", label: "Offering 5 Description", type: "textarea" },
    { name: "offering5ImageUrl", label: "Offering 5 Image URL", type: "url" },
  ];

  return <ContentManager type="puja" title="Pujas" fields={fields as any} />;
}
