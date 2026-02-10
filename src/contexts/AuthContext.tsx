"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AppUser {
  id: string;
  email: string;
  role: "admin" | "artist";
}

interface AuthContextType {
  user: AppUser | null;
  role: "admin" | "artist" | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  refreshUser: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<"admin" | "artist" | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        setRole(null);
        return;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setRole(data.user.role);
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (err) {
      console.error("Error fetching auth user:", err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setRole(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

