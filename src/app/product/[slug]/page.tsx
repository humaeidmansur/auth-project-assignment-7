import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Spinner } from "@heroui/react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
} from "lucide-react";

import type Product from "@/src/app/types/product";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

// Market information type
interface MarketPrice {
  market?: string;
  marketName?: string;
  location?: string;
  district?: string;
  min?: number;
  max?: number;
  avg?: number;
  price?: number;
}

// Extended product information
interface ProductDetails extends Product {
  markets?: MarketPrice[];
  marketPrices?: MarketPrice[];
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
}

// Sample district names for display purposes
const sampleDistricts = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "সিলেট",
  "কুমিল্লা",
  "রংপুর",
  "বরিশাল",
  "ময়মনসিংহ",
  "গাজীপুর",
];

// Bengali price formatting
function formatPrice(price: number) {
  return new Intl.NumberFormat("bn-BD").format(price);
}

// Bengali unit names
function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    gram: "প্রতি গ্রাম",
  };

  return units[unit.toLowerCase()] || `প্রতি ${unit}`;
}

// Calculate percentage change using actual prices
function getChangePercent(today: number, yesterday: number) {
  if (yesterday <= 0) {
    return 0;
  }

  return Math.abs(((today - yesterday) / yesterday) * 100);
}

// Calculate estimated average market price
function getMarketAverage(market: MarketPrice): number | null {
  if (typeof market.avg === "number") {
    return market.avg;
  }

  if (typeof market.price === "number") {
    return market.price;
  }

  if (
    typeof market.min === "number" &&
    typeof market.max === "number"
  ) {
    return (market.min + market.max) / 2;
  }

  return null;
}

// Fetch product information
async function getProduct(
  slug: string
): Promise<ProductDetails | null> {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();

  const productList: Product[] = Array.isArray(result)
    ? result
    : result.data?.products ??
      result.data ??
      result.products ??
      [];

  if (!Array.isArray(productList)) {
    throw new Error("Invalid product data");
  }

  const product = productList.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return null;
  }

  // Fetch individual product details
  const detailResponse = await fetch(
    `${API_URL}/products/${product.id}`,
    { cache: "no-store" }
  );

  if (!detailResponse.ok) {
    return product as ProductDetails;
  }

  const detailResult = await detailResponse.json();

  const details =
    detailResult.data ??
    detailResult.product ??
    detailResult;

  return {
    ...product,
    ...details,
  } as ProductDetails;
}

// Loading component
function ProductLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0]">
      <div className="flex flex-col items-center gap-3">
        <Spinner color="success" size="lg" />

        <p className="text-sm text-gray-600">
          পণ্যের তথ্য লোড হচ্ছে...
        </p>
      </div>
    </main>
  );
}

// Product Details Content
async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: ProductDetails | null;

  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error("Product fetching error:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0] px-4">
        <div className="rounded-2xl bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-gray-800">
            পণ্য লোড করা যায়নি
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-2 text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  // Determine price direction using actual prices
  const isUp = product.today > product.yesterday;
  const isDown = product.today < product.yesterday;

  // Select icon based on price movement
  const ChangeIcon = isUp
    ? TrendingUp
    : isDown
      ? TrendingDown
      : Minus;

  // Calculate percentage using actual prices
  const changePercent = getChangePercent(
    product.today,
    product.yesterday
  );

  // Green for increase, red for decrease, grey for unchanged
  const changeColor = isUp
    ? "text-green-600"
    : isDown
      ? "text-red-600"
      : "text-gray-500";

  // Market information
  const markets = Array.isArray(product.markets)
    ? product.markets
    : Array.isArray(product.marketPrices)
      ? product.marketPrices
      : [];

  // Collect valid minimum market prices
  const minimumValues = markets
    .map((market) => market.min ?? market.price)
    .filter(
      (value): value is number =>
        typeof value === "number"
    );

  // Collect valid maximum market prices
  const maximumValues = markets
    .map((market) => market.max ?? market.price)
    .filter(
      (value): value is number =>
        typeof value === "number"
    );

  // Collect actual or estimated average market prices
  const averageValues = markets
    .map(getMarketAverage)
    .filter(
      (value): value is number => value !== null
    );

  const lowestPrice =
    product.minPrice ??
    (minimumValues.length > 0
      ? Math.min(...minimumValues)
      : null);

  const highestPrice =
    product.maxPrice ??
    (maximumValues.length > 0
      ? Math.max(...maximumValues)
      : null);

  const averagePrice =
    product.avgPrice ??
    (averageValues.length > 0
      ? averageValues.reduce(
          (total, price) => total + price,
          0
        ) / averageValues.length
      : null);

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-700"
          >
            {product.categoryNameBn}
          </Link>

          <span>›</span>

          <span className="font-medium text-gray-800">
            {product.nameBn}
          </span>
        </div>

        {/* Product Header */}
        <section className="mb-5 flex flex-col justify-between gap-5 rounded-2xl border border-[#E0E9E0] bg-[#FCFDFC] p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0F5F0] text-4xl sm:h-20 sm:w-20">
              {product.image}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#1F2B22] sm:text-3xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {getUnit(product.unit)} · {product.categoryNameBn}
              </p>

              <p className="mt-2 text-sm text-gray-700">
                গতকালের তুলনায় আজ দাম{" "}
                <strong className={changeColor}>
                  {isUp
                    ? "বেড়েছে"
                    : isDown
                      ? "কমেছে"
                      : "অপরিবর্তিত"}
                </strong>
                ।
              </p>
            </div>
          </div>

          {/* Today's Price */}
          <div className="min-w-32 rounded-2xl bg-[#F0F5F0] px-5 py-4 text-center">
            <p className="text-xs text-gray-500">
              আজকের দাম
            </p>

            <p className="my-1 text-3xl font-bold text-[#1F2B22]">
              {formatPrice(product.today)}
            </p>

            <p className="text-xs text-gray-500">
              টাকা / {product.unit}
            </p>

            <p
              className={`mt-2 flex items-center justify-center gap-1 text-sm font-bold ${changeColor}`}
            >
              <ChangeIcon size={15} />
              {formatPrice(changePercent)}%
            </p>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mb-5 rounded-2xl border border-[#E0E9E0] bg-[#FCFDFC] p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-bold text-[#1F2B22]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            {/* Lowest Price */}
            <div className="rounded-2xl border border-[#E0E9E0] p-5">
              <p className="text-sm text-gray-500">
                সর্বনিম্ন দাম
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {lowestPrice !== null
                  ? `${formatPrice(lowestPrice)} টাকা`
                  : "তথ্য নেই"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                সর্বনিম্ন বাজার দর
              </p>
            </div>

            {/* Highest Price */}
            <div className="rounded-2xl border border-[#E0E9E0] p-5">
              <p className="text-sm text-gray-500">
                সর্বাধিক দাম
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {highestPrice !== null
                  ? `${formatPrice(highestPrice)} টাকা`
                  : "তথ্য নেই"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                সর্বোচ্চ বাজার দর
              </p>
            </div>

            {/* Average Price */}
            <div className="rounded-2xl border border-[#E0E9E0] p-5">
              <p className="text-sm text-gray-500">
                গড় দাম
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {averagePrice !== null
                  ? `${formatPrice(Math.round(averagePrice))} টাকা`
                  : "তথ্য নেই"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                প্রতি {product.unit}-এর হিসাবে
              </p>
            </div>
          </div>

          {/* Market-wise Prices */}
          <div className="mt-7">
            <h2 className="mb-4 text-lg font-bold text-[#1F2B22]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            {markets.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#E0E9E0]">
                <table className="w-full min-w-[650px] border-collapse text-sm">
                  <thead className="bg-[#F0F5F0] text-gray-500">
                    <tr>
                      <th className="px-4 py-4 text-left">
                        বাজার
                      </th>

                      <th className="px-4 py-4 text-left">
                        জেলা
                      </th>

                      <th className="px-4 py-4 text-right">
                        সর্বনিম্ন
                      </th>

                      <th className="px-4 py-4 text-right">
                        সর্বাধিক
                      </th>

                      <th className="px-4 py-4 text-right">
                        গড়
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {markets.map((market, index) => {
                      const marketAverage = getMarketAverage(market);

                      return (
                        <tr
                          key={index}
                          className="border-t border-[#E0E9E0] hover:bg-green-50/50"
                        >
                          {/* Market */}
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {market.market ??
                              market.marketName ??
                              `বাজার ${formatPrice(index + 1)}`}
                          </td>

                          {/* District */}
                          <td className="px-4 py-4 text-gray-600">
                            {market.district ||
                              market.location ||
                              sampleDistricts[
                                index % sampleDistricts.length
                              ]}
                          </td>

                          {/* Minimum */}
                          <td className="px-4 py-4 text-right text-gray-700">
                            {typeof market.min === "number"
                              ? `${formatPrice(market.min)} টাকা`
                              : typeof market.price === "number"
                                ? `${formatPrice(market.price)} টাকা`
                                : "—"}
                          </td>

                          {/* Maximum */}
                          <td className="px-4 py-4 text-right text-gray-700">
                            {typeof market.max === "number"
                              ? `${formatPrice(market.max)} টাকা`
                              : typeof market.price === "number"
                                ? `${formatPrice(market.price)} টাকা`
                                : "—"}
                          </td>

                          {/* Average */}
                          <td className="px-4 py-4 text-right font-bold text-gray-800">
                            {marketAverage !== null
                              ? `${formatPrice(
                                  Math.round(marketAverage)
                                )} টাকা`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-[#E0E9E0] bg-[#F7FAF7] p-6 text-center">
                <MapPin
                  className="mx-auto mb-2 text-gray-400"
                  size={25}
                />

                <p className="text-sm font-medium text-gray-700">
                  বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  বর্তমান API-তে এই পণ্যের বাজারভিত্তিক তথ্য নেই।
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Back Button */}
        <Link
          href={`/category/${product.category}`}
          className="inline-flex items-center gap-2 rounded-xl border border-green-700 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          <ArrowLeft size={17} />
          পণ্যের তালিকায় ফিরে যান
        </Link>
      </div>
    </main>
  );
}

// Main Page with Suspense
export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
