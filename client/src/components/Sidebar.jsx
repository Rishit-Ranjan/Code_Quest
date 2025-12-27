import { cn } from "@/lib/utils";
import {
  Bookmark,
  Bot,
  Building,
  FileText,
  Home,
  MessageSquare,
  MessageSquareIcon,
  Tag,
  Trophy,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import React from "react";
import { Badge } from "./ui/badge";

const Sidebar = ({ isopen }) => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/questions", icon: MessageSquareIcon, label: "Questions" },
    { to: "/ai-assist", icon: Bot, label: "AI Assist", badge: "Labs" },
    { to: "/tags", icon: Tag, label: "Tags" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/saves", icon: Bookmark, label: "Saves" },
    {
      to: "/challenges",
      icon: Trophy,
      label: "Challenges",
      badge: "NEW",
      badgeVariant: "orange"
    },
    { to: "/chat", icon: MessageSquare, label: "Chat" },
    { to: "/articles", icon: FileText, label: "Articles" },
    { to: "/companies", icon: Building, label: "Companies" },
  ];

  return (
    <aside
      className={cn(
        "fixed md:sticky top-[53px] left-0 w-64 h-[calc(100vh-53px)] bg-white border-r transition-transform duration-200 ease-in-out z-40 overflow-y-auto",
        isopen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <nav className="py-6 px-1 lg:px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-2.5 rounded-r-none transition-colors text-sm font-medium",
                    isActive
                      ? "bg-gray-100 text-gray-900 border-r-4 border-orange-500 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                <item.icon className={cn("w-[18px] h-[18px] mr-3 font-bold")} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-auto text-[10px] px-1.5 py-0 h-5 leading-tight font-normal",
                      item.badgeVariant === "orange"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
