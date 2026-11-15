"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { ArrowUpDown, Package } from "lucide-react";
import type Product from "@/src/app/types/product";
import ProductCard from "@/src/app/component/home/ProductCard";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

type SortOption = "default" | "low-high" | "high-low";

// Loading Component
function CategoryLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0]">
      <div className="flex flex-col items-center gap-3">
        <Spinner color="success" size="lg" />
        <p className="text-sm text-gray-600">
          ক্যাটাগরি লোড হচ্ছে...
        </p>
      </div>
    </main>
  );
}

// Main Category Content
function CategoryContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  // Fetch category products
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategoryProducts() {
      try {
        setLoading(true);
        setError("");
        setProducts([]);

        const response = await fetch(
          `${API_URL}/products?category=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const result = await response.json();

        const productList: Product[] = Array.isArray(result)
          ? result
          : result.data ?? result.products ?? [];

        if (!Array.isArray(productList)) {
          throw new Error("পণ্যের তথ্য সঠিক নয়।");
        }

        setProducts(productList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCategoryProducts();

    return () => {
      controller.abort();
    };
  }, [slug]);

  // Sort products by today's price
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low-high") {
      return a.today - b.today;
    }

    if (sort === "high-low") {
      return b.today - a.today;
    }

    return a.id - b.id;
  });

  const categoryName = products[0]?.categoryNameBn || slug;
  const categoryIcon = products[0]?.categoryIcon;

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Category Header */}
        <section className="mb-5 flex items-center gap-4 rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC] p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl">
            {categoryIcon}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {categoryName}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              পণ্যের দাম এবং বাজারের তথ্য দেখুন।
            </p>
          </div>
        </section>

        {/* Sorting Section */}
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC] p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package size={17} />

            <span>
              {loading
                ? "পণ্য লোড হচ্ছে..."
                : `${products.length}টি পণ্য পাওয়া গেছে`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-gray-500" />

            <label htmlFor="sort" className="text-sm text-gray-600">
              সাজান:
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              disabled={loading}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-high">কম দাম থেকে বেশি</option>
              <option value="high-low">বেশি দাম থেকে কম</option>
            </select>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC]">
            <div className="flex flex-col items-center gap-3">
              <Spinner color="success" size="lg" />

              <p className="text-sm text-gray-600">
                পণ্যের তথ্য লোড হচ্ছে...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC] p-10 text-center">
            <Package
              size={40}
              className="mx-auto mb-3 text-gray-400"
            />

            <h2 className="text-lg font-semibold text-gray-800">
              কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// Main Page with Suspense
export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent />
    </Suspense>
  );
}
