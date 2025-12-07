import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { category } from "../api/index";
import Select from "react-select";
import axios from "axios";

function CategoryForm() {
  const [mode, setMode] = useState("update"); 
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await category.getAllCategories({
          signal: controller.signal,
        });
        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            value: item.category_id,
            label: item.category_name,
          }));
          setCategories(mapped);
        }
      } catch (err) {
        if (!axios.isCancel(err)) console.error(err);
      }
    })();
    return () => controller.abort();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "update") {
      if (!selectedCategory)
        newErrors.selectedCategory = "Select a category to update.";
      if (!formData.category_name.trim())
        newErrors.category_name = "To field is required.";
    }

    if (mode === "add") {
      if (!formData.category_name.trim())
        newErrors.category_name = "Category name is required.";
    }

    if (mode === "delete") {
      if (!selectedCategory)
        newErrors.selectedCategory = "Select a category to delete.";
    }

    if ((mode === "add" || mode === "update") && !formData.description.trim())
      newErrors.description = "Description is required.";
    else if (
      (mode === "add" || mode === "update") &&
      formData.description.length > 60
    )
      newErrors.description = "Max 60 characters allowed.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (mode == "delete") {
      try {
        await category.deleteCategory(selectedCategory);
        toast.success("Category deleted successfully!");
            setTimeout(()=>{
             window.location.reload()
          },2000);
        
      } catch (err) {
        toast.err(err);
      }
      return;
    } else {
      try {
        if (mode === "update") {
          await category.updateCategory(selectedCategory, formData);
          toast.success("Category updated successfully!");
            setTimeout(()=>{
             window.location.reload()
          },2000);
        } else if (mode === "add") {
          await category.createCategory(formData);
          toast.success("Category added successfully!");

          setTimeout(()=>{
             window.location.reload()
          },2000);
        }
      } catch (err) {
        toast.error("Something went wrong!");
        console.error(err);
      }
    }

    setFormData({ category_name: "", description: "" });
    setSelectedCategory("");
  };

  return (
    <div className="product-form">
      <h2>
        {mode === "update"
          ? "Update Category"
          : mode === "add"
          ? "Add Category"
          : "Delete Category"}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {["update", "add", "delete"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius:
                m === "update"
                  ? "6px 0 0 6px"
                  : m === "delete"
                  ? "0 6px 6px 0"
                  : "0",
              border: "1px solid #0f3460",
              borderLeft: m === "add" ? "none" : undefined,
              borderRight: m === "add" ? "none" : undefined,
              background: mode === m ? "#0f3460" : "#f1f1f1",
              color: mode === m ? "#fff" : "#0f3460",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {(mode === "update" || mode === "delete") && (
          <div className="form-group">
            <label>{mode === "update" ? "From" : "Select Category"}</label>
            <Select
              options={categories}
              placeholder={
                mode === "update"
                  ? "Select category to update"
                  : "Select category to delete"
              }
              isClearable
              onChange={(option) =>
                setSelectedCategory(option ? option.value : "")
              }
            />
            {errors.selectedCategory && (
              <span className="error">{errors.selectedCategory}</span>
            )}
          </div>
        )}

        {(mode === "update" || mode === "add") && (
          <>
            <div className="form-group">
              <label>{mode === "update" ? "To" : "Category Name"}</label>
              <input
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
              />
              {errors.category_name && (
                <span className="error">{errors.category_name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={60}
              />
              {errors.description && (
                <span className="error">{errors.description}</span>
              )}
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">
          {mode === "update" ? "Update" : mode === "add" ? "Add" : "Delete"}
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
