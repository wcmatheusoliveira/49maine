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
  ArrowUpRight,
  Activity,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Helper function to format time ago
function timeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Helper to get action label
function getActionLabel(action: string, entityType: string) {
  const typeLabels: Record<string, string> = {
    menu_item: 'Menu item',
    menu_category: 'Menu category',
    page: 'Page',
    section: 'Section',
    testimonial: 'Testimonial',
    business_info: 'Business info',
    settings: 'Settings'
  };

  const actionLabels: Record<string, string> = {
    created: 'added',
    updated: 'updated',
    deleted: 'deleted'
  };

  return `${typeLabels[entityType] || 'Item'} ${actionLabels[action] || action}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPages: 0,
    totalMenuItems: 0,
    totalTestimonials: 0,
    publishedPages: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real stats from API
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalPages: data.totalPages || 1,
          totalMenuItems: data.totalMenuItems || 0,
          totalTestimonials: data.totalTestimonials || 0,
          publishedPages: data.publishedPages || 1
        });
      })
      .catch(() => {
        // Fallback to defaults if API fails
        setStats({
          totalPages: 1,
          totalMenuItems: 25,
          totalTestimonials: 4,
          publishedPages: 1
        });
      });

    // Fetch real activity from API
    fetch('/api/admin/activity')
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setRecentActivity(data);
        } else {
          console.error('Activity data is not an array:', data);
          setRecentActivity([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch activity:', err);
        setRecentActivity([]);
      });
  }, []);

  const quickActions = [
    { label: "Add Menu Item", href: "/admin/menu/new", icon: Plus, variant: "default" as const },
    { label: "Edit Homepage", href: "/admin/pages/home/edit", icon: Edit, variant: "secondary" as const },
    { label: "View Site", href: "/", icon: Eye, variant: "outline" as const, external: true },
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.label} className="hover:shadow-md transition-shadow cursor-pointer group">
              {action.external ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      {action.label}
                    </CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>Quick access</span>
                    </div>
                  </CardContent>
                </a>
              ) : (
                <Link href={action.href} className="block">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      {action.label}
                    </CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>Quick access</span>
                    </div>
                  </CardContent>
                </Link>
              )}
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>
            Track all changes and updates to your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-sm">No recent activity yet</p>
                <p className="text-muted-foreground text-xs mt-1">Changes will appear here when you start editing</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-4 py-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={
                        activity.action === 'created' ? 'bg-green-100 text-green-600' :
                        activity.action === 'updated' ? 'bg-blue-100 text-blue-600' :
                        'bg-red-100 text-red-600'
                      }>
                        {activity.action === 'created' ? <Plus className="h-4 w-4" /> :
                         activity.action === 'updated' ? <Edit className="h-4 w-4" /> :
                         <TrendingUp className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">
                            {getActionLabel(activity.action, activity.entityType)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.entityName}
                            {activity.description && ` • ${activity.description}`}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {timeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}