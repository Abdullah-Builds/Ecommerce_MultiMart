import { lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const ListProduct = lazy(() => import("./pages/ListProduct"));
const Profile = lazy(() => import("./pages/Profile"));
const Category = lazy(() => import("./pages/Category"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
import PaymentInfo from "./pages/PaymentInfo";

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />

        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/payment" element={<PaymentInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orderhistory" element={<OrderHistory />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/listproduct"
            element={
              <ProtectedRoute>
                <ListProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </Router>
    </Suspense>
  );
}

export default App;
