"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

import type Product from "@/src/app/types/product";
import ProductCard from "./ProductCard";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

// Calculate percentage change using actual prices
function getChangePercent(product: Product): number {
  if (product.yesterday <= 0) {
    return 0;
  }

  return Math.abs(
    ((product.today - product.yesterday) / product.yesterday) * 100
  );
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Fetch all products from API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const result = await response.json();

        const productList: Product[] = Array.isArray(result)
          ? result
          : result.data?.products ??
            result.data ??
            result.products ??
            [];

        if (!Array.isArray(productList)) {
          throw new Error("Invalid product data.");
        }

        setProducts(productList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [retry]);

  // Price Increased
  const increasedProducts = products
    .filter((product) => product.today > product.yesterday)
    .sort((a, b) => getChangePercent(b) - getChangePercent(a))
    .slice(0, 6);

  // Price Decreased
  const decreasedProducts = products
    .filter((product) => product.today < product.yesterday)
    .sort((a, b) => getChangePercent(b) - getChangePercent(a))
    .slice(0, 6);

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-80 items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-3">
          <Spinner color="success" size="lg" />

          <p className="text-sm text-gray-600">
            Loading product information...
          </p>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-sm text-red-600">{error}</p>

        <button
          onClick={() => setRetry((previous) => previous + 1)}
          className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Try Again
        </button>
      </main>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <main
        id="all-products"
        className="mx-auto max-w-7xl px-4 py-12 text-center"
      >
        <Package size={32} className="mx-auto mb-3 text-gray-400" />

        <p className="text-gray-500">
          No products available at the moment.
        </p>

        <button
          onClick={() => setRetry((previous) => previous + 1)}
          className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

      {/* SECTION 1: PRICE INCREASED */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-600" />

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
          <TrendingDown size={20} className="text-red-600" />

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
      <section
        id="all-products"
        className="scroll-mt-24"
      >
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
