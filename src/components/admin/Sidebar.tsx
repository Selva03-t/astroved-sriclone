"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  CalendarIcon, 
  SparklesIcon, 
  BuildingLibraryIcon, 
  BookOpenIcon, 
  ArrowLeftOnRectangleIcon,
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Pujas", href: "/admin/pujas", icon: SparklesIcon },
  { name: "Chadhava", href: "/admin/chadhava", icon: ShoppingBagIcon },
  { name: "Panchang", href: "/admin/panchang", icon: CalendarIcon },
  { name: "Temples", href: "/admin/temples", icon: BuildingLibraryIcon },
  { name: "Library", href: "/admin/library", icon: BookOpenIcon },
  { name: "Astro Tools", href: "/admin/astro-tools", icon: WrenchScrewdriverIcon },
  { name: "Store", href: "/admin/store", icon: ShoppingBagIcon },
  { name: "Reviews", href: "/admin/reviews", icon: ChatBubbleLeftRightIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center justify-center border-b">
        <span className="text-xl font-bold text-purple-700">AstroVed Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? "text-purple-700" : "text-gray-400 group-hover:text-gray-500"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="w-full group flex items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-red-600"
            aria-hidden="true"
          />
          Logout
        </button>
      </nav>
      <div className="border-t p-4 font-semibold text-gray-500">
          <Link href="/dashboard" className="flex items-center hover:text-purple-700">
            <span className="mr-2">←</span> Back to Site
          </Link>
      </div>
    </div>
  );
}
