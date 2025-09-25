"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.number().min(1).max(5),
  text: z.string().min(1, "Review text is required"),
  date: z.string().optional(),
  isPublished: z.boolean()
});

type Testimonial = z.infer<typeof testimonialSchema> & { id: string };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      rating: 5,
      isPublished: true
    }
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: z.infer<typeof testimonialSchema>) => {
    try {
      const url = editingId
        ? `/api/admin/testimonials?id=${editingId}`
        : "/api/admin/testimonials";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchTestimonials();
        form.reset();
        setIsAdding(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials</h1>
          <p className="text-gray-600">Manage customer reviews and testimonials.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            form.reset({ rating: 5, isPublished: true });
          }}
          className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  {...form.register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="John Doe"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date (optional)
                </label>
                <input
                  {...form.register("date")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="2 weeks ago"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => form.setValue("rating", star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (form.watch("rating") || 0) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Text
              </label>
              <textarea
                {...form.register("text")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Write the customer's review..."
              />
              {form.formState.errors.text && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.text.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...form.register("isPublished")}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish this testimonial
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors"
              >
                {editingId ? "Update" : "Add"} Testimonial
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  form.reset();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testimonial.isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {testimonial.isPublished ? (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Draft
                  </span>
                )}
              </span>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.text}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                {testimonial.date && (
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingId(testimonial.id);
                    setIsAdding(false);
                    form.reset(testimonial);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="p-1.5 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && !isAdding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-4">No testimonials yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Testimonial
          </button>
        </div>
      )}
    </div>
  );
}