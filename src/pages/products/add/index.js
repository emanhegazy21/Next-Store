import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const AddProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
  });

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        const categoryNames = typeof data[0] === 'object' ? data.map(c => c.slug) : data;
        setCategories(categoryNames);
      })
      .catch(() => console.error("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: +formData.price,
          stock: +formData.stock,
        }),
      });
      const data = await res.json();
      setMessage(`✅ Product "${data.title}" added successfully!`);
      setFormData({ title: "", price: "", description: "", category: "", brand: "", stock: "" });
      setTimeout(() => setMessage(""), 5000);
    } catch {
      setMessage("❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <button 
          className="btn btn-link text-decoration-none text-dark fw-bold p-0" 
          onClick={() => router.push("/products")}
        >
          ← Back to Inventory
        </button>
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-header bg-dark text-white p-4 text-center border-0">
          <h2 className="mb-1 fs-3">Add New Inventory Item</h2>
          <p className="mb-0 opacity-50 small">Fill in the details to list a new product</p>
        </div>

        <div className="card-body p-4 p-md-5">
          {message && (
            <div className={`alert border-0 shadow-sm ${message.includes('❌') ? 'alert-danger' : 'alert-success'} mb-4 text-center fade show`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="title"
                    className="form-control border-0 bg-light rounded-3"
                    id="titleInput"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="titleInput">Product Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    name="price"
                    className="form-control border-0 bg-light rounded-3"
                    id="priceInput"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="priceInput">Price ($)</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    name="stock"
                    className="form-control border-0 bg-light rounded-3"
                    id="stockInput"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="stockInput">Inventory Stock</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <select
                    name="category"
                    className="form-select border-0 bg-light rounded-3"
                    id="catSelect"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="catSelect">Category</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="brand"
                    className="form-control border-0 bg-light rounded-3"
                    id="brandInput"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                  <label htmlFor="brandInput">Brand Name (Optional)</label>
                </div>
              </div>

              <div className="col-12">
                <div className="form-floating mb-4">
                  <textarea
                    name="description"
                    className="form-control border-0 bg-light rounded-3"
                    placeholder="Description"
                    id="descInput"
                    style={{ height: "120px" }}
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                  <label htmlFor="descInput">Product Description</label>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-dark w-100 py-3 rounded-3 fw-bold shadow-sm mt-2"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Product Listing"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-control:focus, .form-select:focus {
          box-shadow: none;
          background-color: #f0f0f0 !important;
          border: 1px solid #000 !important;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;