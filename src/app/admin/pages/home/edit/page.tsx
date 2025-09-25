"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VisualPageBuilder from "@/components/page-builder/VisualPageBuilder";

interface Section {
  id: string;
  type: string;
  name: string;
  order: number;
  isVisible: boolean;
  data: any;
}

export default function EditHomePage() {
  const router = useRouter();
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all data in parallel
      const [pagesResponse, menuResponse, businessResponse] = await Promise.all([
        fetch("/api/admin/pages"),
        fetch("/api/admin/menu/categories"),
        fetch("/api/admin/business")
      ]);

      const pages = await pagesResponse.json();
      const menuData = await menuResponse.json();
      const businessData = await businessResponse.json();

      const homepage = pages.find((p: any) => p.isHomepage);

      if (homepage) {
        setPage(homepage);
        setSections((homepage.sections || []).map((s: any) => ({
          ...s,
          data: typeof s.data === 'string' ? JSON.parse(s.data) : s.data
        })));
      }

      setMenuCategories(menuData);
      setBusinessInfo(businessData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSections: Section[]) => {
    try {
      // Update each section with pageId included
      for (const section of updatedSections) {
        const sectionData = {
          ...section,
          pageId: page?.id, // Add pageId here
          data: typeof section.data === 'object' ? JSON.stringify(section.data) : section.data
        };

        // Check if section exists (has database id) or is new
        if (section.id.startsWith('section-')) {
          // This is a new section, create it
          await fetch('/api/admin/sections', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sectionData)
          });
        } else {
          // Update existing section
          await fetch(`/api/admin/sections?id=${section.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sectionData)
          });
        }
      }

      // Delete sections that were removed
      const currentIds = updatedSections.map(s => s.id);
      const originalIds = sections.map(s => s.id);
      const deletedIds = originalIds.filter(id => !currentIds.includes(id));

      for (const id of deletedIds) {
        await fetch(`/api/admin/sections?id=${id}`, {
          method: "DELETE"
        });
      }

      alert("Homepage updated successfully!");
      router.push("/admin/pages");
    } catch (error) {
      console.error("Failed to save homepage:", error);
      alert("Failed to save changes");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500">Loading homepage...</div>
      </div>
    );
  }

  return (
    <VisualPageBuilder
      pageId={page?.id || "homepage"}
      initialSections={sections}
      menuCategories={menuCategories}
      businessInfo={businessInfo}
      onSave={handleSave}
    />
  );
}