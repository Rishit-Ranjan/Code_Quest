import { useAuth } from "@/lib/AuthContext";
import { Menu, Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import LanguageSelector from "./LanguageSelector";

import { useTranslation } from "react-i18next";

const Navbar = ({ handleslidein }) => {
  const { t } = useTranslation();
  const { user, Logout } = useAuth();
  const { notifications, fetchNotifications, markNotificationRead } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
    const iv = setInterval(() => {
      if (user) fetchNotifications();
    }, 15000);
    return () => clearInterval(iv);
  }, [user]);

  const handlelogout = () => {
    Logout();
  };

  return (
    <div className="top-0 z-50 w-full min-h-[53px] bg-white border-t-[3px] border-[#ef8236] shadow-[0_1px_5px_#00000033] flex items-center justify-center">
      <div className="w-[90%] max-w-[1440px] flex items-center justify-between mx-auto py-1">
        <button
          aria-label="Toggle sidebar"
          className="sm:block md:hidden p-2 rounded hover:bg-gray-100 transition"
          onClick={handleslidein}
        >
          <Menu className="w-5 h-5 text-gray-800" />
        </button>
        <div className="flex items-center gap-2 flex-grow">
          <Link to="/" className="px-3 py-1">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
          </Link>

          <div className="hidden sm:flex gap-1">
            {[
              { label: t("nav.about") || "About", to: "/" },
              { label: t("nav.products") || "Products", to: "/" },
              { label: t("nav.for_teams") || "For Teams", to: "/" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <form className="hidden lg:block flex-grow relative px-3">
            <input
              type="text"
              placeholder={t("common.search") || "Search..."}
              className="w-full max-w-[600px] pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-600" />
          </form>
        </div>

        <div className="flex items-center gap-4 relative">
          <LanguageSelector />
          {!hasMounted ? null : !user ? (
            <Link
              to="/auth"
              className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
            >
              Log in
            </Link>
          ) : (
            <>
              <button
                onClick={() => setShowDropdown((s) => !s)}
                aria-label="Notifications"
                className="relative p-2 rounded hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {notifications && notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              <Link
                to={`/users/${user._id}`}
                className="flex items-center justify-center bg-orange-600 text-white text-sm font-semibold w-9 h-9 rounded-full"
              >
                {user.name?.charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handlelogout}
                className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
              >
                Log out
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-12 w-80 bg-white border rounded shadow-lg z-50">
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="font-semibold">Notifications</div>
                    <button
                      onClick={async () => {
                        const unread = (notifications || []).filter((n) => !n.read);
                        for (const n of unread) {
                          await markNotificationRead(n._id);
                        }
                      }}
                      className="text-sm text-blue-600"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {(notifications || []).length === 0 && (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    )}
                    {(notifications || []).map((n) => (
                      <div
                        key={n._id}
                        onClick={async () => {
                          if (!n.read) await markNotificationRead(n._id);
                          window.location.href = n.link || "/";
                        }}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${n.read ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        <div className="text-sm text-gray-800">{n.message}</div>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
