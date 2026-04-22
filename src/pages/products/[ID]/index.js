import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getProductById, getProductPaths } from "@/lib/dbConnect";

const ProductDetail = ({ product }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
    thumbnail: product.thumbnail,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed.");
      }

      setFormData({
        title: data.product.title,
        price: data.product.price,
        description: data.product.description,
        category: data.product.category,
        brand: data.product.brand,
        stock: data.product.stock,
        thumbnail: data.product.thumbnail,
      });
      setMessage("Updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed.");
      }

      setMessage("Product deleted. Redirecting...");
      setTimeout(() => router.push("/products"), 1500);
    } catch (error) {
      setMessage(error.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <button
          className="btn btn-link text-decoration-none text-dark fw-bold p-0"
          onClick={() => router.push("/products")}
        >
          {"<-"} Back to Collection
        </button>
        <span className="text-muted small">Product ID: {product._id}</span>
      </div>

      {message && (
        <div
          className={`alert border-0 shadow-sm ${
            message.toLowerCase().includes("failed") ? "alert-danger" : "alert-success"
          } mb-4 fade show text-center`}
        >
          {message}
        </div>
      )}

      <div className="row g-5">
        <div className="col-lg-6">
          <div className="product-image-container p-4 bg-white shadow-sm rounded-4 text-center mb-4">
            <div style={{ position: "relative", width: "100%", height: "400px" }}>
              <Image
                src={formData.thumbnail}
                alt={formData.title}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
              {formData.category}
            </span>
            <span className="badge rounded-pill bg-dark px-3 py-2">{formData.brand}</span>
          </div>

          <h1 className="display-5 fw-bold mb-3">{formData.title}</h1>
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="text-success mb-0 fw-bold">${formData.price}</h2>
            <span className="text-muted small">({formData.stock} in stock)</span>
          </div>
          <p className="lead text-muted">{formData.description}</p>

          <button
            className="btn btn-outline-danger rounded-pill px-4 py-2 mt-4 transition-all"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete from Inventory
          </button>
        </div>

        <div className="col-lg-5 offset-lg-1">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 border-0">
              <h4 className="mb-0 fs-5">Management Portal</h4>
              <p className="mb-0 opacity-50 small">Update product details instantly</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleUpdate}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control border-0 bg-light rounded-3"
                    id="titleInput"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <label htmlFor="titleInput">Product Name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control border-0 bg-light rounded-3"
                    id="priceInput"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    required
                  />
                  <label htmlFor="priceInput">Price ($)</label>
                </div>

                <div className="form-floating mb-3">
                  <textarea
                    className="form-control border-0 bg-light rounded-3"
                    placeholder="Description"
                    id="descInput"
                    style={{ height: "140px" }}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                  <label htmlFor="descInput">Full Description</label>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light rounded-3"
                        id="brandInput"
                        placeholder="Brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                      <label htmlFor="brandInput">Brand</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light rounded-3"
                        id="categoryInput"
                        placeholder="Category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="categoryInput">Category</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control border-0 bg-light rounded-3"
                        id="stockInput"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: Number(e.target.value) })
                        }
                        required
                      />
                      <label htmlFor="stockInput">Stock</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="url"
                        className="form-control border-0 bg-light rounded-3"
                        id="thumbInput"
                        placeholder="Thumbnail URL"
                        value={formData.thumbnail}
                        onChange={(e) =>
                          setFormData({ ...formData, thumbnail: e.target.value })
                        }
                      />
                      <label htmlFor="thumbInput">Thumbnail URL</label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-3 rounded-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-image-container {
          transition: transform 0.3s ease;
        }
        .product-image-container:hover {
          transform: translateY(-5px);
        }
        .form-control:focus {
          box-shadow: none;
          background-color: #f8f9fa !important;
          border: 1px solid #000 !important;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;

export async function getStaticPaths() {
  const ids = await getProductPaths();

  return {
    paths: ids.map((id) => ({ params: { ID: String(id) } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const product = await getProductById(params.ID);

  if (!product) {
    return {
      notFound: true,
      revalidate: 30,
    };
  }

  return {
    props: { product },
    revalidate: 30,
  };
}
