"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "number" | "date" | "datetime-local" | "json";
  required?: boolean;
  placeholder?: string;
  options?: string[];
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

  useEffect(() => {
    fetchItems();
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
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <button
          onClick={handleOpenAdd}
          className="flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          {isAdding ? "Cancel" : <><PlusIcon className="mr-2 h-5 w-5" /> Add New</>}
        </button>
      </div>

      {isAdding && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {editingId ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.type === "textarea" || field.type === "json" ? "sm:col-span-2" : ""}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === "textarea" || field.type === "json" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      rows={field.type === "json" ? 8 : 3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
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
                className="rounded-md bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Item" : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg bg-white shadow overflow-hidden">
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
                        className="text-indigo-600 hover:text-indigo-900"
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
    </div>
  );
}
