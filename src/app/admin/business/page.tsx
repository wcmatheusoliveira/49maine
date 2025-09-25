"use client";

import { useState, useEffect } from "react";
import { Save, MapPin, Clock, Phone, Mail, Globe } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  mapEmbed: z.string().optional(),
});

const hoursSchema = z.object({
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
});

const socialSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
});

export default function BusinessInfoPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const businessForm = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
  });

  const [hours, setHours] = useState({
    "Monday": "Closed",
    "Tuesday - Thursday": "5:00 PM - 9:00 PM",
    "Friday - Saturday": "5:00 PM - 10:00 PM",
    "Sunday": "4:00 PM - 8:00 PM",
  });

  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
  });

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/business");
      const data = await response.json();

      if (data) {
        businessForm.reset({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          phone: data.phone,
          email: data.email,
          mapEmbed: data.mapEmbed || "",
        });

        if (data.hours) {
          setHours(JSON.parse(data.hours));
        }

        if (data.socialMedia) {
          setSocialMedia(JSON.parse(data.socialMedia));
        }
      }
    } catch (error) {
      console.error("Failed to fetch business info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: z.infer<typeof businessSchema>) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          hours: JSON.stringify(hours),
          socialMedia: JSON.stringify(socialMedia),
        }),
      });

      if (response.ok) {
        // Show success message
        alert("Business information saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save business info:", error);
      alert("Failed to save business information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Information</h1>
        <p className="text-gray-600">Manage your restaurant's contact details, hours, and location.</p>
      </div>

      <form onSubmit={businessForm.handleSubmit(handleSave)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Basic Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  {...businessForm.register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {businessForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {businessForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...businessForm.register("email")}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {businessForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {businessForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  {...businessForm.register("phone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {businessForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {businessForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  {...businessForm.register("address")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {businessForm.formState.errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {businessForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  {...businessForm.register("city")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {businessForm.formState.errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {businessForm.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    {...businessForm.register("state")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {businessForm.formState.errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {businessForm.formState.errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    {...businessForm.register("zip")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {businessForm.formState.errors.zip && (
                    <p className="text-red-500 text-sm mt-1">
                      {businessForm.formState.errors.zip.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed Code (optional)
              </label>
              <textarea
                {...businessForm.register("mapEmbed")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Paste your Google Maps iframe embed code here..."
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Business Hours
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(hours).map(([day, time]) => (
                <div key={day} className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">
                    {day}
                  </label>
                  <input
                    value={time}
                    onChange={(e) => setHours({ ...hours, [day]: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Social Media
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://instagram.com/yourrestaurant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://facebook.com/yourrestaurant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter URL
                </label>
                <input
                  value={socialMedia.twitter}
                  onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://twitter.com/yourrestaurant"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#144663] text-white rounded-lg hover:bg-[#0d3346] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}