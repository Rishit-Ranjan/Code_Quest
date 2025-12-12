import { useState, createContext, useContext, ReactNode } from "react";
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  tags: string[];
  about?: string;
  joinDate?: string;
  loginHistory?: any[]; // Simplified for now
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  Signup: (data: any) => Promise<void>;
  Login: (data: any) => Promise<any>;
  VerifyOTP: (data: { userId: string; otp: string }) => Promise<any>;
  Logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState<string | null>(null);

  const Signup = async ({ name, email, password }: any) => {
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
    } catch (error: any) {
      const msg = error.response?.data.message || "Signup failed";
      seterror(msg);
      toast.error(msg);
    } finally {
      setloading(false);
    }
  };
  const Login = async ({ email, password }: any) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      // Check for OTP requirement
      if (res.data.needsOTP) {
        setloading(false);
        return res.data; // Return data to let UI handle OTP
      }

      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Login Successful");
      return res.data;
    } catch (error: any) {
      setloading(false);
      const msg = error.response?.data.message || "Login failed";
      seterror(msg);
      toast.error(msg);
      throw error;
    }
  };

  const VerifyOTP = async ({ userId, otp }: { userId: string, otp: string }) => {
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
    } catch (error: any) {
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
  return (
    <AuthContext.Provider
      value={{ user, Signup, Login, VerifyOTP, Logout, loading, error }}
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
