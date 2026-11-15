"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import {
  ArrowUpDown,
  Package,
  PackageX,
  ArrowLeft,
  ShoppingBasket,
} from "lucide-react";

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

// Empty State Component
function CategoryEmptyState() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F0F5F0] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E0E9E0] bg-[#FCFDFC] p-8 text-center shadow-sm">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <PackageX size={32} className="text-green-700" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800">
          কোনো পণ্য পাওয়া যায়নি!
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-gray-500">
          এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।
          অনুগ্রহ করে অন্য ক্যাটাগরি দেখুন।
        </p>

        {/* Home Button */}
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <ArrowLeft size={17} />
          হোম পেজে ফিরে যান
        </Link>
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
  const [retry, setRetry] = useState(0);

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
          : result.data?.products ??
            result.data ??
            result.products ??
            [];

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
  }, [slug, retry]);

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

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-80 items-center justify-center">
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
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center">
              <PackageX
                size={36}
                className="mx-auto mb-4 text-red-500"
              />

              <h2 className="text-xl font-bold text-gray-800">
                পণ্য লোড করা যায়নি
              </h2>

              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={() => setRetry((previous) => previous + 1)}
                className="mt-5 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <CategoryEmptyState />
        )}

        {/* Category Content */}
        {!loading && !error && products.length > 0 && (
          <>
            {/* Category Header */}
            <section className="mb-5 flex items-center gap-4 rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC] p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <ShoppingBasket size={30} />
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
                  {products.length}টি পণ্য পাওয়া গেছে
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
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="low-high">কম দাম থেকে বেশি</option>
                  <option value="high-low">বেশি দাম থেকে কম</option>
                </select>
              </div>
            </section>

            {/* Product Grid */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </section>
          </>
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
