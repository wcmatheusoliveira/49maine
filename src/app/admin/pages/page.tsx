"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Home, Globe } from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  isHomepage: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (page: Page) => {
    try {
      const response = await fetch(`/api/admin/pages?id=${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...page,
          isPublished: !page.isPublished
        })
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Failed to update page:", error);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const response = await fetch(`/api/admin/pages?id=${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pages...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pages</h1>
          <p className="text-gray-600">Manage your website pages and content.</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Page
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">No pages created yet</p>
              <Link
                href="/admin/pages/new"
                className="px-4 py-2 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Page
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Slug</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Homepage</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{page.title}</p>
                          {page.description && (
                            <p className="text-sm text-gray-500">{page.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono text-gray-600">/{page.slug}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => togglePublish(page)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            page.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {page.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {page.isHomepage && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            <Home className="w-3 h-3" />
                            Homepage
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/pages/${page.slug}/edit`}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Link>
                          {!page.isHomepage && (
                            <button
                              onClick={() => deletePage(page.id)}
                              className="p-1.5 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}