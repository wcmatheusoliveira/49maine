"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isPopular: z.boolean(),
  isAvailable: z.boolean(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type MenuItem = z.infer<typeof menuItemSchema> & { id: string; order: number };
type Category = z.infer<typeof categorySchema> & { id: string; order: number; items: MenuItem[] };

export default function MenuManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const itemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      isPopular: false,
      isAvailable: true,
    },
  });

  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/menu/categories");
      const data = await response.json();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSaveItem = async (data: z.infer<typeof menuItemSchema>) => {
    try {
      const url = editingItem
        ? `/api/admin/menu/items?id=${editingItem.id}`
        : "/api/admin/menu/items";

      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          order: editingItem?.order || categories.find(c => c.id === data.categoryId)?.items.length || 0,
        }),
      });

      if (response.ok) {
        fetchCategories();
        setIsAddingItem(false);
        setEditingItem(null);
        itemForm.reset();
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const handleSaveCategory = async (data: z.infer<typeof categorySchema>) => {
    try {
      const url = editingCategory
        ? `/api/admin/menu/categories?id=${editingCategory.id}`
        : "/api/admin/menu/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          order: editingCategory?.order || categories.length,
        }),
      });

      if (response.ok) {
        fetchCategories();
        setIsAddingCategory(false);
        setEditingCategory(null);
        categoryForm.reset();
      }
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/menu/items?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category and all its items?")) return;

    try {
      const response = await fetch(`/api/admin/menu/categories?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
        if (selectedCategory === id) {
          setSelectedCategory(categories.find(c => c.id !== id)?.id || null);
        }
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h1>
        <p className="text-gray-600">Manage your restaurant's menu categories and items.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="p-1.5 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              {isAddingCategory && (
                <form onSubmit={categoryForm.handleSubmit(handleSaveCategory)} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    {...categoryForm.register("name")}
                    placeholder="Category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <textarea
                    {...categoryForm.register("description")}
                    placeholder="Description (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-1.5 bg-[#144663] text-white rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        categoryForm.reset();
                      }}
                      className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? "bg-[#144663] text-white border-[#144663]"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className={`text-sm ${selectedCategory === category.id ? "text-white/70" : "text-gray-500"}`}>
                          {category.items?.length || 0} items
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!category.isActive && (
                          <EyeOff className="w-4 h-4" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="lg:col-span-2">
          {currentCategory ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentCategory.name}</h2>
                    {currentCategory.description && (
                      <p className="text-gray-600 mt-1">{currentCategory.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingItem(true);
                      itemForm.setValue("categoryId", currentCategory.id);
                    }}
                    className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="p-6">
                {isAddingItem && (
                  <form onSubmit={itemForm.handleSubmit(handleSaveItem)} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        {...itemForm.register("name")}
                        placeholder="Item name"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        {...itemForm.register("price")}
                        placeholder="Price (e.g., $15)"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <textarea
                      {...itemForm.register("description")}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                      rows={3}
                    />
                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...itemForm.register("isPopular")}
                          className="rounded"
                        />
                        <span className="text-sm">Popular item</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...itemForm.register("isAvailable")}
                          className="rounded"
                        />
                        <span className="text-sm">Available</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#144663] text-white rounded-lg"
                      >
                        Save Item
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingItem(false);
                          setEditingItem(null);
                          itemForm.reset();
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {currentCategory.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            {item.isPopular && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                            {!item.isAvailable && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                                Unavailable
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          )}
                          {item.price && (
                            <p className="font-semibold text-[#144663]">{item.price}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsAddingItem(true);
                              itemForm.reset(item);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Select a category to view and manage items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}