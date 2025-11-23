import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../api/index";
 import Cookies from "js-cookie";

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // login | register
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const isLogin = mode === "login";

  // Remove name & phone when switching to login
  useEffect(() => {
    if (isLogin) {
      setFormData(({ full_name: name, phone, ...rest }) => rest);
      setErrors(({ name, phone, ...rest }) => rest);
    }
  }, [isLogin]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  const validate = (data) => {
    const errs = {};

    // Email validation
    if (!data.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errs.email = "Invalid email address";
    }

    // Password validation
    if (!data.password) {
      errs.password = "Password is required";
    } else if (data.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    // Register-only fields
    if (!isLogin) {
      if (!data.full_name) errs.full_name = "Full name is required";
      if (!data.phone) {
        errs.phone = "Phone number is required";
      } else if (!/^\d{11}$/.test(data.phone)) {
        errs.phone = "Phone number must be 11 digits";
      }
    }

    return errs;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (isLogin) {
        const response = await auth.login(formData);
        Cookies.set("token", response?.data?.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        toast.success("Logged in successfully!");
      } else {
        await auth.register(formData);
        console.log("Register data:", formData);
        toast.success("Registered successfully!");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("User already exists!");
      } else {
        console.log(err);
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* LEFT IMAGE */}
        <div className="auth-left">
          <img
            src="https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=600&auto=format&fit=crop&q=60"
            alt="Ecommerce"
          />
          <div className="auth-overlay">
            <h2>Welcome to MultiMart</h2>
            <p>Shop the best products at amazing prices!</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="auth-right">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {/* Title */}
          <div className="auth-body">
            <h2 className="auth-title">
              {isLogin ? "Welcome Back" : "Create your account"}
            </h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Login to continue shopping"
                : "Join us and enjoy seamless shopping"}
            </p>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="auth-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="John Doe"
                      value={formData.full_name || ""}
                      onChange={handleChange}
                    />
                    {errors.full_name && (
                      <span className="error">{errors.full_name}</span>
                    )}
                  </div>

                  <div className="auth-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="03453894872"
                      value={formData.phone || ""}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <span className="error">{errors.phone}</span>
                    )}
                  </div>
                </>
              )}

              <div className="auth-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="auth-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <span className="error">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="auth-btn">
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            {/* Footer */}
            <p className="auth-footer">
              {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
              <span onClick={() => setMode(isLogin ? "register" : "login")}>
                {isLogin ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
