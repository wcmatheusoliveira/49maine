"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Star, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const priceVariantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
});

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isPopular: z.boolean(),
  isAvailable: z.boolean(),
  priceVariants: z.array(priceVariantSchema).min(1, "At least one price is required"),
});

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type PriceVariant = z.infer<typeof priceVariantSchema>;
type MenuItem = z.infer<typeof menuItemSchema> & { id: string; order: number };
type Category = z.infer<typeof categorySchema> & { id: string; order: number; items: MenuItem[] };

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}

export default function MenuManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      isPopular: false,
      isAvailable: true,
      priceVariants: [{ name: "Regular", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: itemForm.control,
    name: "priceVariants",
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
          order: editingItem ? editingItem.order : (categories.find(c => c.id === data.categoryId)?.items.length ?? 0),
        }),
      });

      if (response.ok) {
        fetchCategories();
        setIsItemDialogOpen(false);
        setEditingItem(null);
        itemForm.reset({
          isPopular: false,
          isAvailable: true,
          priceVariants: [{ name: "Regular", price: "" }],
        });
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
        setIsCategoryDialogOpen(false);
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

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex).map((cat, idx) => ({
        ...cat,
        order: idx,
      }));

      setCategories(newCategories);

      // Update order on backend
      const toastId = toast.loading("Saving category order...");
      try {
        const response = await fetch("/api/admin/menu/categories/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: newCategories.map(c => ({ id: c.id, order: c.order })) }),
        });

        if (response.ok) {
          toast.success("Category order saved", { id: toastId });
        } else {
          throw new Error("Failed to save order");
        }
      } catch (error) {
        console.error("Failed to reorder categories:", error);
        toast.error("Failed to save category order", { id: toastId });
      }
    }
  };

  const handleItemDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && currentCategory) {
      const items = currentCategory.items;
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        order: idx,
      }));

      setCategories(categories.map(cat =>
        cat.id === currentCategory.id ? { ...cat, items: newItems } : cat
      ));

      // Update order on backend
      const toastId = toast.loading("Saving menu item order...");
      try {
        const response = await fetch("/api/admin/menu/items/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: newItems.map(i => ({ id: i.id, order: i.order })) }),
        });

        if (response.ok) {
          toast.success("Menu item order saved", { id: toastId });
        } else {
          throw new Error("Failed to save order");
        }
      } catch (error) {
        console.error("Failed to reorder items:", error);
        toast.error("Failed to save menu item order", { id: toastId });
      }
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);

  const openAddItemDialog = () => {
    setEditingItem(null);
    itemForm.reset({
      categoryId: selectedCategory || "",
      isPopular: false,
      isAvailable: true,
      priceVariants: [{ name: "Regular", price: "" }],
    });
    setIsItemDialogOpen(true);
  };

  const openEditItemDialog = (item: MenuItem) => {
    setEditingItem(item);

    // Handle migration from old schema (single price) to new schema (price variants)
    const formData = {
      ...item,
      priceVariants: item.priceVariants && item.priceVariants.length > 0
        ? item.priceVariants
        : (item as any).price // Old schema compatibility
          ? [{ name: "Regular", price: (item as any).price }]
          : [{ name: "Regular", price: "" }]
    };

    itemForm.reset(formData);
    setIsItemDialogOpen(true);
  };

  const openAddCategoryDialog = () => {
    setEditingCategory(null);
    categoryForm.reset({ isActive: true });
    setIsCategoryDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h1>
        <p className="text-gray-600">Organize your menu categories and items with drag-and-drop.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Categories</CardTitle>
              <Button
                size="icon"
                onClick={openAddCategoryDialog}
                className="bg-[#144663] hover:bg-[#0d3346]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCategoryDragEnd}
              >
                <SortableContext
                  items={categories.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <SortableItem key={category.id} id={category.id}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedCategory === category.id
                              ? "bg-[#144663] text-white border-[#144663]"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{category.name}</p>
                                <p className={`text-sm ${selectedCategory === category.id ? "text-white/70" : "text-muted-foreground"}`}>
                                  {category.items?.length || 0} items
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {!category.isActive && (
                                  <EyeOff className="w-4 h-4" />
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category.id);
                                  }}
                                  className="h-8 w-8 hover:bg-destructive/20"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        <div className="lg:col-span-2">
          {currentCategory ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentCategory.name}</CardTitle>
                    {currentCategory.description && (
                      <CardDescription className="mt-1">{currentCategory.description}</CardDescription>
                    )}
                  </div>
                  <Button
                    onClick={openAddItemDialog}
                    className="bg-[#144663] hover:bg-[#0d3346]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleItemDragEnd}
                >
                  <SortableContext
                    items={currentCategory.items?.map(i => i.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {currentCategory.items?.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    {item.isPopular && (
                                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    )}
                                    {!item.isAvailable && (
                                      <Badge variant="destructive" className="text-xs">
                                        Unavailable
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2">
                                    {item.priceVariants && item.priceVariants.length > 0 ? (
                                      item.priceVariants.map((variant, idx) => (
                                        <Badge key={idx} variant="secondary" className="font-semibold">
                                          {variant.name}: {variant.price}
                                        </Badge>
                                      ))
                                    ) : (item as any).price ? (
                                      <Badge variant="secondary" className="font-semibold">
                                        {(item as any).price}
                                      </Badge>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openEditItemDialog(item)}
                                    className="h-8 w-8"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="h-8 w-8 hover:bg-destructive/20"
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Select a category to view and manage items</p>
            </Card>
          )}
        </div>
      </div>

      {/* Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>
              Fill in the details for your menu item. You can add multiple price variants.
            </DialogDescription>
          </DialogHeader>

          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(handleSaveItem)} className="space-y-6">
              <FormField
                control={itemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lobster Roll" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={itemForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your dish..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Price Variants</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", price: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <FormField
                      control={itemForm.control}
                      name={`priceVariants.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="e.g., Regular, Large" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemForm.control}
                      name={`priceVariants.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="e.g., $15" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="mt-0.5"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-6">
                <FormField
                  control={itemForm.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Popular item
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={itemForm.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Available
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsItemDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#144663] hover:bg-[#0d3346]">
                  {editingItem ? "Update" : "Create"} Item
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              Create a new menu category to organize your items.
            </DialogDescription>
          </DialogHeader>

          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleSaveCategory)} className="space-y-6">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Appetizers, Entrees" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this category..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Active (visible on site)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#144663] hover:bg-[#0d3346]">
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
