import type Product from "@/src/app/types/product";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Determine direction using actual prices
  const isUp = product.today > product.yesterday;
  const isDown = product.today < product.yesterday;

  // Calculate percentage change
  const changePercent =
    product.yesterday > 0
      ? Math.abs(
          ((product.today - product.yesterday) /
            product.yesterday) *
            100
        )
      : 0;

  // Select icon based on price movement
  const ChangeIcon = isUp
    ? TrendingUp
    : isDown
      ? TrendingDown
      : Minus;

  // Green for increase, red for decrease, grey for unchanged
  const changeColor = isUp
    ? "bg-green-50 text-green-600"
    : isDown
      ? "bg-red-50 text-red-600"
      : "bg-gray-100 text-gray-600";

  // Bengali to English product name mapping
  const englishNames: Record<string, string> = {
    "পেঁয়াজ": "Onion",
    "আদা": "Ginger",
    "বেগুন": "Eggplant",
    "কই মাছ": "Koi Fish",
    "ডিম": "Eggs",
    "মাখন (৫০০ গ্রাম)": "Butter (500g)",
    "কাঁচামরিচ": "Green Chili",
    "রসুন": "Garlic",
    "আলু": "Potato",
    "কাতলা মাছ": "Katla Fish",
    "ইলিশের মাছ": "Hilsa Fish",
    "খাসির মাংস": "Mutton",
  };

  // Get English product name
  const productName =
    englishNames[product.nameBn] ??
    product.slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`View details of ${productName}`}
      className="group block rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC] p-4 transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
    >
      {/* Product Information */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-2xl transition group-hover:bg-green-50">
          {product.image}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 transition group-hover:text-green-700">
            {productName}
          </h3>

          <p className="text-xs text-gray-500">
            Per {product.unit}
          </p>
        </div>
      </div>

      {/* Price Information */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">
            Today&apos;s Price
          </p>

          <p className="text-lg font-bold text-gray-800">
            ৳{product.today.toLocaleString("en-IN")}{" "}
            <span className="text-sm font-normal">BDT</span>
          </p>
        </div>

        {/* Price Change Indicator */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${changeColor}`}
          aria-label={
            isUp
              ? `Price increased by ${changePercent.toFixed(1)} percent`
              : isDown
                ? `Price decreased by ${changePercent.toFixed(1)} percent`
                : "Price unchanged"
          }
        >
          <ChangeIcon size={14} />
          {changePercent.toFixed(1)}%
        </span>
      </div>
    </Link>
  );
}
