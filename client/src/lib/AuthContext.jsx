import { useState, createContext, useContext } from "react";
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const [shownNotifications, setShownNotifications] = useState(new Set());

  const Signup = async ({ name, email, password }) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/signup", {
        name,
        email,
        password,
      });
      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Signup Successful");
    } catch (error) {
      const msg = error.response?.data.message || "Signup failed";
      seterror(msg);
      toast.error(msg);
    } finally {
      setloading(false);
    }
  };
  const Login = async ({ email, password }) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      // Check for OTP requirement
      if (res.data.otpRequired) {
        setloading(false);
        return res.data; // Return data to let UI handle OTP
      }

      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Login Successful");
      return res.data;
    } catch (error) {
      setloading(false);
      const msg = error.response?.data.message || "Login failed";
      seterror(msg);
      toast.error(msg);
      throw error;
    }
  };

  const VerifyOTP = async ({ userId, otp }) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        userId,
        otp
      });
      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Login Successful");
      return res.data;
    } catch (error) {
      setloading(false);
      const msg = error.response?.data.message || "OTP Verification failed";
      seterror(msg);
      toast.error(msg);
      throw error;
    }
  }

  const Logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };
  const updateUser = (newData) => {
    const merged = { ...(user || {}), ...newData };
    setUser(merged);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      const base = stored ? JSON.parse(stored) : {};
      const combined = { ...base, ...merged };
      localStorage.setItem("user", JSON.stringify(combined));
    }
  };

  // Poll for notifications and show browser Notification API popups
  useEffect(() => {
    let polling = null;
    const fetchAndNotify = async () => {
      if (!user || !user.notificationsEnabled) return;
      try {
        const res = await axiosInstance.get("/user/notifications");
        const notifs = res.data.data || [];
        for (const n of notifs) {
          if (!n.read && !shownNotifications.has(n._id)) {
            // Request permission if needed
            if (typeof Notification !== "undefined") {
              if (Notification.permission === "default") {
                await Notification.requestPermission();
              }
              if (Notification.permission === "granted") {
                const popup = new Notification("CodeQuest", {
                  body: n.message,
                });
                popup.onclick = () => {
                  window.location.href = n.link || "/";
                };
              }
            }
            // mark as shown locally and mark read on server
            setShownNotifications((prev) => new Set(prev).add(n._id));
            try {
              await axiosInstance.patch(`/user/notifications/mark-read/${n._id}`);
            } catch (e) {
              // ignore
            }
          }
        }
      } catch (error) {
        // ignore polling errors
      }
    };
    if (user && user.notificationsEnabled) {
      fetchAndNotify();
      polling = setInterval(fetchAndNotify, 15000);
    }
    return () => {
      if (polling) clearInterval(polling);
    };
  }, [user, shownNotifications]);
  return (
    <AuthContext.Provider
      value={{ user, Signup, Login, VerifyOTP, Logout, updateUser, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
