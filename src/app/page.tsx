import DynamicHomePage from "@/components/DynamicHomePage";
import { getMenuCategories, getBusinessInfo, getHomePage } from "@/lib/data";

export default async function Home() {
  // Fetch data on the server
  const [menuCategories, businessInfo, homepage] = await Promise.all([
    getMenuCategories(),
    getBusinessInfo(),
    getHomePage()
  ]);

  // If no homepage or sections, show a message
  if (!homepage || !homepage.sections || homepage.sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Homepage Content</h1>
          <p className="text-gray-600">Please add sections in the page builder.</p>
        </div>
      </div>
    );
  }

  // Pass data to the dynamic homepage component
  return (
    <DynamicHomePage
      sections={homepage.sections}
      menuCategories={menuCategories}
      businessInfo={businessInfo}
    />
  );
}