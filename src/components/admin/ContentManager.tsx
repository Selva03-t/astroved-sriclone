"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface SubField {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "number";
  placeholder?: string;
}

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "number" | "date" | "datetime-local" | "json" | "array-string" | "array-object" | "reference-array";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  objectSchema?: SubField[];
  referenceEndpoint?: string;
  referenceLabelField?: string;
}

interface ContentManagerProps {
  type: string;
  title: string;
  fields: Field[];
}

export default function ContentManager({ type, title, fields }: ContentManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [referenceData, setReferenceData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchItems();
    
    // Fetch any reference data
    fields.forEach(async (f) => {
      if (f.type === "reference-array" && f.referenceEndpoint) {
        try {
          const res = await fetch(f.referenceEndpoint);
          const data = await res.json();
          if (Array.isArray(data)) {
            setReferenceData((prev) => ({ ...prev, [f.name]: data }));
          }
        } catch (error) {
          console.error(`Failed to fetch reference data for ${f.name}:`, error);
        }
      }
    });
  }, [type]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?type=${type}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (fieldName: string, index: number, value: any, subField?: string) => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      if (subField) {
        arr[index] = { ...arr[index], [subField]: value };
      } else {
        arr[index] = value;
      }
      return { ...prev, [fieldName]: arr };
    });
  };

  const addArrayItem = (fieldName: string, type: "array-string" | "array-object") => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      arr.push(type === "array-string" ? "" : {});
      return { ...prev, [fieldName]: arr };
    });
  };

  const removeArrayItem = (fieldName: string, index: number) => {
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      arr.splice(index, 1);
      return { ...prev, [fieldName]: arr };
    });
  };

  const resetForm = () => {
    setFormData({});
    setFormError(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleOpenAdd = () => {
    if (isAdding) {
      resetForm();
      return;
    }

    setFormData({});
    setFormError(null);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEdit = (item: Record<string, any>) => {
    const draft: Record<string, unknown> = {};

    fields.forEach((field) => {
      const raw = item[field.name];
      if (field.type === "json") {
        draft[field.name] = raw === undefined || raw === null ? "" : JSON.stringify(raw, null, 2);
        return;
      }
      if (field.type === "array-string" || field.type === "array-object" || field.type === "reference-array") {
        draft[field.name] = Array.isArray(raw) ? raw : [];
        return;
      }

      draft[field.name] = raw ?? "";
    });

    setFormData(draft);
    setFormError(null);
    setEditingId(String(item._id));
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload: Record<string, unknown> = { ...formData };
    for (const field of fields) {
      const rawValue = formData[field.name];

      if (field.type === "number") {
        if (rawValue === "" || rawValue === undefined || rawValue === null) {
          continue;
        }

        const numericValue = Number(rawValue);
        if (Number.isNaN(numericValue)) {
          setFormError(`${field.label} must be a valid number.`);
          return;
        }

        payload[field.name] = numericValue;
      }

      if (field.type === "json") {
        if (typeof rawValue !== "string" || rawValue.trim() === "") {
          payload[field.name] = field.required ? {} : undefined;
          continue;
        }

        try {
          payload[field.name] = JSON.parse(rawValue);
        } catch {
          setFormError(`${field.label} must be valid JSON.`);
          return;
        }
      }

      if (field.type === "array-string") {
        payload[field.name] = (formData[field.name] || []).filter((v: string) => typeof v === "string" && v.trim().length > 0);
        continue;
      }

      if (field.type === "array-object") {
        payload[field.name] = (formData[field.name] || []).filter((v: any) => 
          v && typeof v === "object" && Object.values(v).some(val => val !== "" && val !== null && val !== undefined)
        );
        continue;
      }

      if (field.type === "reference-array") {
        payload[field.name] = Array.isArray(formData[field.name]) ? formData[field.name] : [];
        continue;
      }
    }

    setSubmitting(true);
    try {
      const endpoint = editingId
        ? `/api/admin/content?type=${type}&id=${editingId}`
        : `/api/admin/content?type=${type}`;

      const res = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resetForm();
        fetchItems();
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`/api/admin/content?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#241a46]">{title}</h1>
        <div className="flex items-center gap-2">
          {isAdding && (
            <button
              form="content-manager-form"
              type="submit"
              disabled={submitting}
              className="flex items-center rounded-md bg-[#6869F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#5657e8] disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update Item" : "Save Item"}
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className={`flex items-center rounded-md px-4 py-2 text-sm font-medium text-white ${
              isAdding
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-[#6869F9] hover:bg-[#5657e8]"
            }`}
          >
            {isAdding ? "Cancel" : <><PlusIcon className="mr-2 h-5 w-5" /> Add New</>}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="rounded-lg border border-[#e8e2ff] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-[#241a46]">
            {editingId ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
          </h2>
          <form id="content-manager-form" onSubmit={handleSubmit} className="space-y-4">
            {formError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.type === "textarea" || field.type === "json" || field.type === "array-string" || field.type === "array-object" || field.type === "reference-array" ? "sm:col-span-2" : ""}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  
                  {field.type === "reference-array" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {referenceData[field.name]?.map((item: any) => (
                        <label key={item._id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={(formData[field.name] || []).includes(String(item._id))}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev: any) => {
                                const arr = prev[field.name] || [];
                                if (checked) {
                                  return { ...prev, [field.name]: [...arr, String(item._id)] };
                                }
                                return { ...prev, [field.name]: arr.filter((id: string) => id !== String(item._id)) };
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-[#6869F9] focus:ring-[#6869F9]"
                          />
                          {item[field.referenceLabelField || "name"]}
                        </label>
                      ))}
                      {!referenceData[field.name] && <div className="text-sm text-gray-500">Loading...</div>}
                      {referenceData[field.name]?.length === 0 && <div className="text-sm text-gray-500">No items available.</div>}
                    </div>
                  ) : field.type === "array-string" ? (
                    <div className="space-y-2">
                      {(Array.isArray(formData[field.name]) ? formData[field.name] : []).map((val: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleArrayChange(field.name, idx, e.target.value)}
                            placeholder={field.placeholder || "Enter value"}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
                          />
                          <button type="button" onClick={() => removeArrayItem(field.name, idx)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem(field.name, "array-string")} className="text-sm text-[#6869F9] font-medium hover:underline">
                        + Add {field.label}
                      </button>
                    </div>
                  ) : field.type === "array-object" ? (
                    <div className="space-y-4">
                      {(Array.isArray(formData[field.name]) ? formData[field.name] : []).map((val: any, idx: number) => (
                        <div key={idx} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <button type="button" onClick={() => removeArrayItem(field.name, idx)} className="absolute right-2 top-2 text-red-500 hover:text-red-700">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                            {field.objectSchema?.map(sub => (
                              <div key={sub.name} className={sub.type === "textarea" ? "sm:col-span-2" : ""}>
                                <label className="block text-xs font-medium text-gray-700">{sub.label}</label>
                                {sub.type === "textarea" ? (
                                  <textarea
                                    value={val[sub.name] || ""}
                                    onChange={(e) => handleArrayChange(field.name, idx, e.target.value, sub.name)}
                                    rows={2}
                                    placeholder={sub.placeholder}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
                                  />
                                ) : (
                                  <input
                                    type={sub.type}
                                    value={val[sub.name] || ""}
                                    onChange={(e) => handleArrayChange(field.name, idx, e.target.value, sub.name)}
                                    placeholder={sub.placeholder}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem(field.name, "array-object")} className="text-sm text-[#6869F9] font-medium hover:underline">
                        + Add {field.label}
                      </button>
                    </div>
                  ) : field.type === "textarea" || field.type === "json" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      rows={field.type === "json" ? 8 : 3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
                    />
                  ) : (
                    <>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        list={field.options ? `${field.name}-options` : undefined}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
                      />
                      {field.options && (
                        <datalist id={`${field.name}-options`}>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt} />
                          ))}
                        </datalist>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[#6869F9] px-6 py-2 text-sm font-medium text-white hover:bg-[#5657e8] disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Item" : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isAdding && (
        <div className="overflow-hidden rounded-lg border border-[#e8e2ff] bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fields.slice(0, 3).map((field) => (
                  <th key={field.name} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={fields.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                    No items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    {fields.slice(0, 3).map((field) => (
                      <td key={field.name} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {field.type === "url" && item[field.name] ? (
                          <div className="flex items-center">
                            <img src={item[field.name]} alt="" className="h-8 w-8 rounded object-cover mr-2" />
                            <span className="truncate max-w-37.5">{item[field.name]}</span>
                          </div>
                        ) : (
                          <span className="truncate max-w-50 block">{item[field.name]}</span>
                        )}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#5657e8] hover:text-[#4647c4]"
                          aria-label="Edit item"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
