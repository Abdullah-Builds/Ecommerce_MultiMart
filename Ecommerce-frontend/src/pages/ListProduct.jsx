
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { products, category } from "../api/index";

function ManageProducts() {
  const [mode, setMode] = useState("add"); 

  const [categories, setCategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [formData, setFormData] = useState({
    category_id: "",
    product_name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const controller = new AbortController();

   (async () => {
      try {
        const res = await category.getAllCategories({ signal: controller.signal });
        const data = res?.data ?? res;
        if (Array.isArray(data)) {
          setCategories(
            data.map((c) => ({
              value: c.category_id,
              label: c.category_name,
            }))
          );
        } else {
          setCategories([]);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching categories:", err);
        }
      }
    })();

    (async () => {
      try {
        const res = await products.getproducts();
        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setProductsList(list);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductsList([]);
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedProductId) {
      if (mode === "update") {
        setFormData({
          category_id: "",
          product_name: "",
          price: "",
          stock: "",
          description: "",
          image_url: "",
        });
      }
      return;
    }

    const product = productsList.find((p) => String(p.product_id) === String(selectedProductId));
    if (product) {
      setFormData({
        category_id: product.category_id ?? "",
        product_name: product.product_name ?? "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        description: product.description ?? "",
        image_url: product.image_url ?? "",
      });
    }
  }, [selectedProductId, productsList, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    const isNumber = (v) => v !== "" && !Number.isNaN(Number(v));

    if (mode === "update" || mode === "delete") {
      if (!selectedProductId) newErrors.selectedProduct = "Please select a product.";
    }

    if (mode === "add" || mode === "update") {
      if (!formData.product_name?.trim()) newErrors.product_name = "Product name is required.";
      else if (formData.product_name.length > 20) newErrors.product_name = "Max 20 characters allowed.";

      if (!isNumber(formData.price)) newErrors.price = "Price is required and must be a number.";
      else if (Number(formData.price) > 10000) newErrors.price = "Max price allowed is 10000.";

      if (!isNumber(formData.stock)) newErrors.stock = "Stock is required and must be a number.";
      else if (Number(formData.stock) < 1 || Number(formData.stock) > 100)
        newErrors.stock = "Stock must be between 1 and 100.";

      if (!formData.image_url?.trim()) newErrors.image_url = "Image URL is required.";

      if (!formData.category_id) newErrors.category_id = "Category is required.";

      if (!formData.description?.trim()) newErrors.description = "Description is required.";
      else if (formData.description.length > 60) newErrors.description = "Max 60 characters allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const refreshProducts = async () => {
    try {
      const res = await products.getproducts();
      const data = res?.data ?? res;
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setProductsList(list);
    } catch (err) {
      console.error("Failed to refresh products", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (mode === "add") {
        const payload = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        };
        console.log(payload)
        await products.createProduct(payload);
        toast.success("Product added successfully!");
        setFormData({
          category_id: "",
          product_name: "",
          price: "",
          stock: "",
          description: "",
          image_url: "",
        });
        await refreshProducts();
      } else if (mode === "update") {
        const payload = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        };
        console.log(selectedProductId)
        await products.updateProduct(selectedProductId, payload);
        toast.success("Product updated successfully!");
        await refreshProducts();
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message ?? "Something went wrong!");
    }
  };

  const handleDelete = async () => {
    if (!selectedProductId) {
      setErrors({ selectedProduct: "Please select a product to delete." });
      return;
    }

    const product = productsList.find((p) => String(p.product_id) === String(selectedProductId));
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product?.product_name ?? "this product"}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await products.deleteProduct(selectedProductId);
      toast.success("Product deleted successfully!");
      setSelectedProductId("");
      await refreshProducts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message ?? "Something went wrong while deleting.");
    }
  };

  const categoryOptions = categories;
  const productOptions = productsList.map((p) => ({
    value: p.product_id,
    label: `${p.product_name} ${p.price ? `— $${p.price}` : ""}`,
  }));

  const selectedProduct = productsList.find((p) => String(p.product_id) === String(selectedProductId));

  return (
    <div className="product-form" style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>
        {mode === "add" ? "Add Product" : mode === "update" ? "Update Product" : "Delete Product"}
      </h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        {["add", "update", "delete"].map((m, idx) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setErrors({});
              setSelectedProductId("");
              if (m === "add") {
                setFormData({
                  category_id: "",
                  product_name: "",
                  price: "",
                  stock: "",
                  description: "",
                  image_url: "",
                });
              } else {
                setFormData((prev) => prev); 
              }
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: idx === 0 ? "6px 0 0 6px" : idx === 2 ? "0 6px 6px 0" : "0",
              border: "1px solid #0f3460",
              borderLeft: idx === 1 ? "none" : undefined,
              borderRight: idx === 1 ? "none" : undefined,
              background: mode === m ? "#0f3460" : "#f1f1f1",
              color: mode === m ? "#fff" : "#0f3460",
              fontWeight: "700",
              cursor: "pointer",
              transition: "0.18s",
              marginLeft: idx === 1 ? 0 : undefined,
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {(mode === "update" || mode === "delete") && (
          <div className="form-group">
            <label>Select Product</label>
            <Select
              options={productOptions}
              value={
                selectedProductId
                  ? productOptions.find((o) => String(o.value) === String(selectedProductId))
                  : null
              }
              onChange={(opt) => {
                setSelectedProductId(opt ? opt.value : "");
              }}
              isClearable
              placeholder={mode === "update" ? "Select product to edit" : "Select product to delete"}
            />
            {errors.selectedProduct && <span className="error">{errors.selectedProduct}</span>}
          </div>
        )}

        {(mode === "add" || mode === "update") && (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                maxLength={20}
              />
              {errors.product_name && <span className="error">{errors.product_name}</span>}
            </div>

            <div className="form-group" >
              <div style={{ flex: 1}}>
                <label>Price &nbsp;</label>
                <input
                 className="m-2"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  max="10000"
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
              <div style={{ flex: 1}}>
                <label>Stock</label>
                <input
                 className="m-3"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  max="100"
                />
                {errors.stock && <span className="error">{errors.stock}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <Select
                options={categoryOptions}
                value={categoryOptions.find((c) => String(c.value) === String(formData.category_id)) ?? null}
                onChange={(opt) => setFormData((p) => ({ ...p, category_id: opt ? opt.value : "" }))}
                isClearable
                placeholder="Select Category"
              />
              {errors.category_id && <span className="error">{errors.category_id}</span>}
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
              {errors.image_url && <span className="error">{errors.image_url}</span>}
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={60}
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>

            <button type="submit" className="submit-btn">
              {mode === "add" ? "Add Product" : "Update Product"}
            </button>
          </>
        )}
      </form>

      {mode === "delete" && (
        <>
          <div style={{ marginTop: 14 }}>
            {selectedProduct ? (
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <img
                  src={selectedProduct.image_url || ""}
                  alt={selectedProduct.product_name}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, background: "#f4f4f4" }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{selectedProduct.product_name}</div>
                  <div>Price: ${selectedProduct.price}</div>
                  <div>Stock: {selectedProduct.stock}</div>
                </div>
              </div>
            ) : (
              <div style={{ color: "#666", marginBottom: 12 }}>Select a product to preview before deleting.</div>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="submit-btn"
              style={{
                background: "#c0392b",
                borderColor: "#a5281f",
                marginTop: 6,
              }}
            >
              Delete Product
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageProducts;
