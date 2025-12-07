// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { admin } from "../../api";

// export default function ProtectedRoute({ children }) {
//   const [isAdmin, setIsAdmin] = useState(null); // null = loading

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await admin.CheckAccess();
//         setIsAdmin(res.data?.role);
//         console.log(res)
//       } catch (err) {
//         setIsAdmin(false);
//         console.log(err)
//       }
//     })();
//   }, []);

//   if (isAdmin === null) return <div>Loading...</div>; 

//   return isAdmin ? children : <Navigate to="/" replace />; 
// }
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAdmin ? children : <Navigate to="/" replace />;
}
