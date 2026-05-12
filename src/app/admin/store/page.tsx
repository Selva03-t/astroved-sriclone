import ContentManager from "@/components/admin/ContentManager";

export default function AdminStorePage() {
  const fields = [
    { name: "title", label: "Product Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number" },
    { name: "imageUrl", label: "Image URL", type: "url" },
    { name: "category", label: "Category", type: "text" },
  ];

  return <ContentManager type="store" title="Store" fields={fields as any} />;
}
