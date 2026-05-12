import ContentManager from "@/components/admin/ContentManager";

export default function AdminOfferingsPage() {
  const fields = [
    { name: "name", label: "Offering Name", type: "text", required: true },
    { name: "price", label: "Price", type: "number", required: true },
    { name: "badge", label: "Badge (e.g. Home Delivery)", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "imageUrl", label: "Image URL", type: "url" },
  ];

  return <ContentManager type="offering" title="Offerings" fields={fields as any} />;
}
