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
  ChatBubbleLeftRightIcon,
  GiftIcon,
  UserCircleIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Pujas", href: "/admin/pujas", icon: SparklesIcon },
  { name: "Offerings", href: "/admin/offerings", icon: GiftIcon },
  { name: "Chadhava", href: "/admin/chadhava", icon: ShoppingBagIcon },
  { name: "Temples", href: "/admin/temples", icon: BuildingLibraryIcon },
  { name: "Library", href: "/admin/library", icon: BookOpenIcon },
  { name: "Store", href: "/admin/store", icon: ShoppingBagIcon },
  { name: "Reviews", href: "/admin/reviews", icon: ChatBubbleLeftRightIcon },
  { name: "Currency Settings", href: "/admin/currency", icon: CurrencyDollarIcon },
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
    <div className="flex h-screen w-64 flex-col border-r border-[#d8ceff] bg-white">
      <Link 
        href="/admin/profile"
        className="flex flex-col items-center justify-center border-b border-[#d8ceff] bg-[#1f1f1f] hover:bg-[#000000] transition-colors py-6"
      >
        <div className="bg-white/20 p-2 rounded-full mb-3">
          <UserCircleIcon className="h-12 w-12 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-wide">Admin Profile</span>
      </Link>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#f3f0ff] text-[#000000]"
                  : "text-gray-600 hover:bg-[#f3f0ff] hover:text-[#000000]"
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 shrink-0 ${
                  isActive ? "text-[#000000]" : "text-gray-400 group-hover:text-[#1f1f1f]"
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
            className="mr-3 h-6 w-6 shrink-0 text-red-500 group-hover:text-red-600"
            aria-hidden="true"
          />
          Logout
        </button>
      </nav>
      <div className="border-t border-[#d8ceff] p-4 font-semibold text-gray-500">
          <Link href="/dashboard" className="flex items-center hover:text-[#000000]">
            <span className="mr-2">←</span> Back to Site
          </Link>
      </div>
    </div>
  );
}

