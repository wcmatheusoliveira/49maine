"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewMenuItemPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the menu page with the "add item" form open
    router.push("/admin/menu?action=add");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Redirecting to menu management...</div>
    </div>
  );
}