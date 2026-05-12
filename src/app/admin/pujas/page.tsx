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
    { 
      name: "gallery", 
      label: "Gallery Image URLs", 
      type: "array-string",
      placeholder: "https://example.com/image.jpg"
    },

    {
      name: "benefits",
      label: "Benefits",
      type: "array-object",
      objectSchema: [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" }
      ]
    },
    {
      name: "process",
      label: "Process Steps",
      type: "array-object",
      objectSchema: [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" }
      ]
    },
    {
      name: "inclusions",
      label: "Inclusions",
      type: "array-string",
      placeholder: "e.g. Experienced pandit-led ritual"
    },
    {
      name: "faq",
      label: "FAQs",
      type: "array-object",
      objectSchema: [
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Answer", type: "textarea" }
      ]
    },
    {
      name: "packages",
      label: "Packages",
      type: "array-object",
      objectSchema: [
        { name: "name", label: "Package Name", type: "text" },
        { name: "price", label: "Price", type: "number" },
        { name: "description", label: "Description", type: "textarea" }
      ]
    },
    {
      name: "offeringIds",
      label: "Select Offerings",
      type: "reference-array",
      referenceEndpoint: "/api/admin/content?type=offering",
      referenceLabelField: "name"
    }
  ];

  return <ContentManager type="puja" title="Pujas" fields={fields as any} />;
}
