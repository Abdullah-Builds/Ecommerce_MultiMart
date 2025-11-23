import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { admin } from "../../api";

export default function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading

  useEffect(() => {
    (async () => {
      try {
        const res = await admin.checkAdminAccess(); // API returns { admin: true/false }
        setIsAdmin(res.data?.admin);
      } catch (err) {
        setIsAdmin(false);
      }
    })();
  }, []);

  if (isAdmin === null) return <div>Loading...</div>; // or your Loader

  return isAdmin ? children : <Navigate to="/" replace />; // redirect non-admins to home
}
