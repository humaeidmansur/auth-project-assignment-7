"use client";

import Product  from "@/src/app/types/product";
import { useEffect, useState } from "react";
import { getProducts } from "@/src/app/lib/api";

const englishNames: Record<string, string> = {
  chal: "Rice",
  miniket: "Miniket Rice",
  najirshail: "Najirshail Rice",
  dal: "Lentils",
  mosur: "Red Lentils",
  tel: "Cooking Oil",
  soyabean: "Soybean Oil",
  peyaj: "Onion",
  alu: "Potato",
  roshun: "Garlic",
  ada: "Ginger",
  dim: "Eggs",
  mach: "Fish",
  murgi: "Chicken",
  gorur: "Beef",
  tomato: "Tomato",
};

function getEnglishName(product: Product): string {
  if (product.slug && englishNames[product.slug]) {
    return englishNames[product.slug];
  }

  if (product.slug) {
    return product.slug
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "Market Product";
}

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        const productList = Array.isArray(response)
          ? response
          : response?.data?.products || response?.data || [];

        setProducts(Array.isArray(productList) ? productList : []);
      } catch (error) {
        console.error("Failed to fetch ticker products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  const tickerProducts = [...products, ...products];

  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-white py-3">
      <div className="flex w-max animate-marquee">
        {tickerProducts.map((product, index) => {
          const change = product.change as unknown as
            | { dir?: string; pct?: number | string }
            | null
            | undefined;
          const direction = change?.dir;
          const percentage = change?.pct;

          const isUp = direction === "up";
          const isDown = direction === "down";
          const isFlat = direction === "flat";

          return (
            <div
              key={`${product.id}-${index}`}
              className="mx-6 flex shrink-0 items-center gap-2 text-sm"
            >
              {/* Product Emoji */}
              <span className="text-lg">
                {product.image || "🛒"}
              </span>

              {/* English Product Name */}
              <span className="font-semibold text-gray-800">
                {getEnglishName(product)}
              </span>

              {/* Today's Price */}
              <span className="text-gray-600">
                ৳{product.today} / {product.unit}
              </span>

              {/* Price Direction */}
              <span
                className={`font-semibold ${
                  isUp
                    ? "text-green-600"
                    : isDown
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : isFlat ? "●" : "—"}

                {percentage !== undefined && percentage !== null
                  ? ` ${Math.abs(Number(percentage))}%`
                  : ""}
              </span>

              <span className="ml-3 text-gray-300">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}