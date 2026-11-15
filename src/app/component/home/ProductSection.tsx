"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

import type Product from "@/src/app/types/product";
import ProductCard from "./ProductCard";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products from API
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const result = await response.json();

        const productList: Product[] = Array.isArray(result)
          ? result
          : result.data ?? result.products ?? [];

        if (!Array.isArray(productList)) {
          throw new Error("Invalid product data.");
        }

        if (isMounted) {
          setProducts(productList);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Products with increased prices
  
  const increasedProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  // Products with decreased prices

  const decreasedProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  // Loading state
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {[1, 2, 3].map((section) => (
          <section key={section}>
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <p className="mx-auto max-w-7xl px-4 py-8 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

      {/* SECTION 1: PRICE INCREASED */}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-red-600" />

          <h2 className="text-xl font-bold text-gray-800">
            Price Increased
          </h2>
        </div>

        {increasedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {increasedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No products with increased prices.
          </p>
        )}
      </section>

      {/* SECTION 2: PRICE DECREASED */}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <TrendingDown size={20} className="text-green-600" />

          <h2 className="text-xl font-bold text-gray-800">
            Price Decreased
          </h2>
        </div>

        {decreasedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {decreasedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No products with decreased prices.
          </p>
        )}
      </section>

      {/* SECTION 3: ALL PRODUCTS */}

      <section id="all-products">

 
        <div className="mb-4 flex items-center gap-2">
          <Package size={20} className="text-green-700" />

          <h2 className="text-xl font-bold text-gray-800">
            All Products
          </h2>
        </div>

        {/* Total Product Count */}

        <p className="mb-4 text-sm text-gray-500">
          Showing {products.length} products
        </p>

        {/* All Product Cards */}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No products available at the moment.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}
