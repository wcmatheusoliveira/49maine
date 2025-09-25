"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPages: 0,
    totalMenuItems: 0,
    totalTestimonials: 0,
    publishedPages: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalPages: 1,
      totalMenuItems: 25,
      totalTestimonials: 4,
      publishedPages: 1
    });

    setRecentActivity([
      { id: 1, action: "Menu item added", item: "Lobster Roll", time: "2 hours ago", type: "menu" },
      { id: 2, action: "Page updated", item: "Homepage", time: "5 hours ago", type: "page" },
      { id: 3, action: "Testimonial added", item: "Sarah Johnson", time: "1 day ago", type: "testimonial" },
      { id: 4, action: "Business hours updated", item: "Weekend Hours", time: "2 days ago", type: "business" }
    ]);
  }, []);

  const quickActions = [
    { label: "Add Menu Item", href: "/admin/menu/new", icon: Plus, color: "bg-green-500" },
    { label: "Edit Homepage", href: "/admin/pages/home/edit", icon: Edit, color: "bg-blue-500" },
    { label: "View Site", href: "/", icon: Eye, color: "bg-purple-500", external: true },
  ];

  const statCards = [
    {
      title: "Total Pages",
      value: stats.totalPages,
      icon: FileText,
      change: `${stats.publishedPages} published`,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Menu Items",
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      change: "5 categories",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: Users,
      change: "All published",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Site Status",
      value: "Live",
      icon: TrendingUp,
      change: "All systems operational",
      color: "bg-emerald-100 text-emerald-600"
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your restaurant's content.</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return action.external ? (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 ${action.color} rounded-lg text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
              </a>
            ) : (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 ${action.color} rounded-lg text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-500">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="mt-8 bg-gradient-to-r from-[#144663] to-[#1a5a7d] rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
        <p className="mb-4 opacity-90">
          Check out our documentation or contact support for assistance with managing your content.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white text-[#144663] rounded-lg font-medium hover:bg-gray-100 transition-colors">
            View Documentation
          </button>
          <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}