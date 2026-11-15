import type Product from "@/src/app/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

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

  const productName =
    englishNames[product.nameBn] ??
    product.slug.replace(/-/g, " ").replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-2xl border border-[#E3E9E2] bg-[#FCFDFC] p-4 transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Product Information */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-2xl">
          {product.image}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">{productName}</h3>
          <p className="text-xs text-gray-500">Per {product.unit}</p>
        </div>
      </div>

      {/* Price Information */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">Today&apos;s Price</p>
          <p className="text-lg font-bold text-gray-800">
            ৳{product.today}{" "}
            <span className="text-sm font-normal">BDT</span>
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "●"} {product.change.pct}%
        </span>
      </div>
    </Link>
  );
}
