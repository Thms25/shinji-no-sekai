"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'artist' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'artist' | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // 1. Try to get role from Custom Claims (fastest, no DB read needed if set)
          const tokenResult = await user.getIdTokenResult();
          const claimRole = tokenResult.claims.role as 'admin' | 'artist' | undefined;
          
          if (claimRole) {
            setRole(claimRole);
            setLoading(false);
            return;
          }

          // 2. Fallback: Check Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role as 'admin' | 'artist');
          } else {
             console.warn("User document not found in Firestore. Defaulting to artist.");
             setRole('artist'); 
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // 3. Last resort: specific email check (useful for dev/recovery)
          if (user.email === "thomasallenmartinho@gmail.com") {
              setRole('admin');
          } else {
              setRole('artist');
          }
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setRole(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
