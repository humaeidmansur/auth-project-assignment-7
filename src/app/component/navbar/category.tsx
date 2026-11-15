"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Spinner} from "@heroui/react";
import type Product from "@/src/app/types/product";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

interface Category {
  slug: string;
  name: string;
  icon: string;
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        // Fetch products and derive categories from their data.
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }

        const result = await response.json();

        const products: Product[] = Array.isArray(result)
          ? result
          : result.data ?? result.products ?? [];

        // Get unique categories.
        const uniqueCategories = Array.from(
          new Map(
            products.map((product) => [
              product.category,
              {
                slug: product.category,
                name: product.categoryNameBn,
                icon: product.categoryIcon,
              },
            ])
          ).values()
        );

        if (isMounted) {
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Category loading error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const isActive = (slug: string) =>
    pathname === `/category/${slug}`;

  return (
    <nav className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 sm:px-6">
 

        {loading ? (
          <Spinner color="success" />
        ) : (
          categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                isActive(category.slug)
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))
        )}

      </div>
    </nav>
  );
}
