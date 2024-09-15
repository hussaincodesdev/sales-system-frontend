"use client";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { USER_ROLE } from "@/utils/constants";

const Navbar = () => {
  const currentRoute = usePathname();
  const { userInfo, logout } = useAuth();

  if (!userInfo) return null;

  const role: UserRole = userInfo.role;

  const renderLinks = () => {
    let links: { href: string; label: string }[] = [];
    if (role === USER_ROLE.ADMIN) {
      links = [
        { href: "/dashboard", label: "Home" },
        { href: "/sales-coaches", label: "Sales Coaches" },
        { href: "/sales-agents", label: "Sales Agents" },
        { href: "/applications", label: "Applications" },
        { href: "/commissions", label: "Commissions" },
      ];
    } else if (role === USER_ROLE.SALES_AGENT) {
      links = [
        { href: "/dashboard", label: "Home" },
        { href: "/profile", label: "Profile" },
      ];
    } else if (role === USER_ROLE.SALES_COACH) {
      links = [
        { href: "/dashboard", label: "Home" },
        { href: "/sales-agents", label: "Sales Agents" },
        { href: "/commissions", label: "Commissions" },
      ];
    }

    return (
      <nav className="flex space-x-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <span
              className={`text-sm font-medium hover:text-gray-600 ${
                currentRoute === link.href
                  ? "text-gray-800 bg-gray-200 px-4 py-2 rounded"
                  : "text-gray-800"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
    );
  };

  return (
    <header className="w-full bg-gray-100 text-gray-800 p-4 flex justify-between items-center">
      <Link href="/" className="text-lg font-medium">
        Sales Dashboard
      </Link>

      {renderLinks()}

      <Button
        variant="secondary"
        className="flex items-center space-x-2"
        onClick={logout}
      >
        <LogIn className="w-4 h-4" />
        <span className="text-sm font-medium">Log Out</span>
      </Button>
    </header>
  );
};

export default Navbar;
