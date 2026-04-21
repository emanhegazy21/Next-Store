import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ProductsPage = ({ products }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchBrand = filterType !== "brand" || !filterValue || p.brand === filterValue;
    const matchCategory = filterType !== "category" || !filterValue || p.category === filterValue;
    return matchSearch && matchBrand && matchCategory;
  });

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-2">Our Collection</h1>
        <p className="text-muted">Discover our curated selection of premium products</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
        <div className="row g-3 align-items-end">
          <div className="col-lg-5">
            <label className="form-label small fw-bold text-uppercase opacity-50">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-0 bg-light rounded-end"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="form-label small fw-bold text-uppercase opacity-50">Filter Type</label>
            <select
              className="form-select border-0 bg-light rounded-3"
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setFilterValue(""); }}
            >
              <option value="all">Everything</option>
              <option value="brand">Brand</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className="col-lg-4 col-md-6">
            {filterType !== "all" && (
              <>
                <label className="form-label small fw-bold text-uppercase opacity-50">Choose {filterType}</label>
                <select 
                  className="form-select border-0 bg-light rounded-3 shadow-sm" 
                  value={filterValue} 
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">All {filterType === "brand" ? "Brands" : "Categories"}</option>
                  {(filterType === "brand" ? brands : categories).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">Results ({filtered.length})</h5>
        <Link href="/products/add" className="btn btn-dark rounded-pill px-4 shadow-sm">
          + Add New Product
        </Link>
      </div>

      <div className="row g-4">
        {filtered.map((product) => (
          <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
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
                   <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                    {product.category}
                  </small>
                </div>
                <h6 className="card-title fw-bold mb-2 text-truncate">{product.title}</h6>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="h5 mb-0 fw-bold text-success">${product.price}</span>
                  <Link href={`/products/${product.id}`} className="btn btn-outline-dark btn-sm rounded-pill px-3">
                    View Detail
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
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
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .image-wrapper {
          background-color: #f8f9fa;
          margin: 10px;
          border-radius: 15px;
        }
        .form-control:focus, .form-select:focus {
          box-shadow: none;
          background-color: #eee !important;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;

export async function getStaticProps() {
  const res = await fetch("https://dummyjson.com/products?limit=100");
  const data = await res.json();
  return {
    props: { products: data.products },
  };
}