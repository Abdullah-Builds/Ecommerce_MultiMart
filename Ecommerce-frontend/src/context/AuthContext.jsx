import { createContext, useContext, useEffect, useState } from "react";
import { admin } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-run once on app start
  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await admin.CheckAccess();
      console.log("ADMIN")
      setIsAdmin(res.data?.role === true);
    } catch {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, checkAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
