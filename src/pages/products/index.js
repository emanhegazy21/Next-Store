import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/dbConnect";
import { useSession } from "next-auth/react";

const ProductsPage = ({ products }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [quantities, setQuantities] = useState({});
  const [isBuying, setIsBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [inventory, setInventory] = useState(products);

  const brands = [...new Set(inventory.map((product) => product.brand).filter(Boolean))];
  const categories = [...new Set(inventory.map((product) => product.category))];

  const filtered = inventory.filter((product) => {
    const matchSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchBrand = filterType !== "brand" || !filterValue || product.brand === filterValue;
    const matchCategory =
      filterType !== "category" || !filterValue || product.category === filterValue;

    return matchSearch && matchBrand && matchCategory;
  });
  const visibleProducts = isAuthenticated ? filtered : filtered.slice(0, 4);

  const selectedItems = inventory
    .map((product) => ({
      productId: product._id,
      quantity: Number(quantities[product._id] || 0),
    }))
    .filter((item) => item.quantity > 0);

  const selectedCount = selectedItems.reduce((total, item) => total + item.quantity, 0);

  const updateQuantity = (productId, nextValue, maxStock) => {
    const quantity = Math.max(0, Math.min(maxStock, Number(nextValue) || 0));

    setQuantities((current) => ({
      ...current,
      [productId]: quantity,
    }));
  };

  const handleBuyProducts = async () => {
    if (selectedItems.length === 0) {
      setMessage("Choose at least one product quantity before buying.");
      return;
    }

    setIsBuying(true);

    try {
      const response = await fetch("/api/products/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: selectedItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Purchase failed.");
      }

      setMessage(`Purchase complete. Total price: $${data.totalPrice}`);
      setQuantities({});

      setInventory((current) =>
        current.map((product) => {
          const purchased = data.purchasedProducts.find(
            (item) => item.productId === product._id
          );

          return purchased ? { ...product, stock: purchased.remainingStock } : product;
        })
      );
    } catch (error) {
      setMessage(error.message || "Purchase failed.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-2">Our Collection</h1>
        <p className="text-muted">
          Browse the ISR-powered catalog, filter it instantly, and buy selected items.
        </p>
        {!isAuthenticated && status !== "loading" && (
          <p className="small text-muted mb-0">
            Sign in to unlock the full catalog and product management tools.
          </p>
        )}
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("Total price") ? "alert-success" : "alert-warning"
          } border-0 shadow-sm rounded-4 mb-4`}
        >
          {message}
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
        <div className="row g-3 align-items-end">
          <div className="col-lg-5">
            <label className="form-label small fw-bold text-uppercase opacity-50">Search</label>
            <input
              type="text"
              className="form-control border-0 bg-light rounded-3"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-lg-3 col-md-6">
            <label className="form-label small fw-bold text-uppercase opacity-50">
              Filter Type
            </label>
            <select
              className="form-select border-0 bg-light rounded-3"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterValue("");
              }}
            >
              <option value="all">Everything</option>
              <option value="brand">Brand</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="col-lg-4 col-md-6">
            {filterType !== "all" && (
              <>
                <label className="form-label small fw-bold text-uppercase opacity-50">
                  Choose {filterType}
                </label>
                <select
                  className="form-select border-0 bg-light rounded-3 shadow-sm"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">
                    All {filterType === "brand" ? "Brands" : "Categories"}
                  </option>
                  {(filterType === "brand" ? brands : categories).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
        <h5 className="mb-0 fw-bold">Results ({visibleProducts.length})</h5>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-success rounded-pill px-4 shadow-sm"
            onClick={handleBuyProducts}
            disabled={isBuying}
          >
            {isBuying ? "Buying..." : `Buy Selected (${selectedCount})`}
          </button>
          {isAuthenticated && (
            <Link href="/products/add" className="btn btn-dark rounded-pill px-4 shadow-sm">
              + Add New Product
            </Link>
          )}
        </div>
      </div>

      <div className="row g-4">
        {visibleProducts.map((product) => (
          <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="product-card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="image-wrapper p-3">
                <div style={{ position: "relative", width: "100%", height: "200px" }}>
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-2"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              </div>

              <div className="card-body d-flex flex-column pt-0">
                <div className="mb-2">
                  <small
                    className="text-uppercase text-muted fw-bold"
                    style={{ fontSize: "10px", letterSpacing: "1px" }}
                  >
                    {product.category}
                  </small>
                </div>

                <h6 className="card-title fw-bold mb-2 text-truncate">{product.title}</h6>
                <p className="text-muted small mb-3">
                  {product.brand} • {product.stock} in stock
                </p>

                <label className="form-label small fw-semibold text-muted mb-1">
                  Buy Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  max={product.stock}
                  value={quantities[product._id] || ""}
                  onChange={(e) =>
                    updateQuantity(product._id, e.target.value, product.stock)
                  }
                  className="form-control bg-light border-0 rounded-3 mb-3"
                  placeholder="0"
                  disabled={product.stock === 0}
                />

                <div className="d-flex justify-content-between align-items-center mt-auto gap-2">
                  <span className="h5 mb-0 fw-bold text-success">${product.price}</span>
                  <Link
                    href={`/products/${product._id}`}
                    className="btn btn-outline-dark btn-sm rounded-pill px-3"
                  >
                    View Detail
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="text-center py-5">
          <p className="lead text-muted">No products found matching your search.</p>
        </div>
      )}

      <style jsx>{`
        .product-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
        .image-wrapper {
          background-color: #f8f9fa;
          margin: 10px;
          border-radius: 15px;
        }
        .form-control:focus,
        .form-select:focus {
          box-shadow: none;
          background-color: #eee !important;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;

export async function getStaticProps() {
  return {
    props: {
      products: await getAllProducts(),
    },
    revalidate: 30,
  };
}
