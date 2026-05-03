import ContentManager from "@/components/admin/ContentManager";

export default function AdminTemplesPage() {
  const fields = [
    { name: "name", label: "Temple Name", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true, options: ["Ayodhya", "Bhopal", "Varanasi", "Prayagraj", "Mathura", "Vrindavan", "Gorakhpur", "Ujjain", "Indore", "Haridwar", "Rishikesh", "Dehradun", "Manaskhand", "Sidhpeeth"] },
    { name: "description", label: "Description", type: "textarea" },
    { name: "slug", label: "Slug", type: "text" },
    { name: "imageUrl", label: "Image URL", type: "url" },
  ];

  return <ContentManager type="temples" title="Temples" fields={fields as any} />;
}
