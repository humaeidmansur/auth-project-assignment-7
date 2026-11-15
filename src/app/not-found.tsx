import Link from "next/link";
import {
  SearchX,
  Home,
  ArrowLeft,
  ShoppingBasket,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F0F5F0] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#E0E9E0] bg-[#FCFDFC] p-8 text-center shadow-sm sm:p-12">

        {/* Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <SearchX size={48} className="text-green-700" />

          <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
            !
          </span>
        </div>

        {/* 404 Number */}
        <h1 className="text-7xl font-extrabold tracking-tight text-green-700">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-500">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          পেজটি সরানো হয়েছে অথবা ঠিকানাটি ভুল হতে পারে।
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            <Home size={17} />
            হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            <ArrowLeft size={17} />
            আগের পেজে যান
          </Link>

        </div>

        {/* Branding */}
        <div className="mt-10 flex items-center justify-center gap-2 border-t border-[#E3E9E2] pt-6 text-sm font-semibold text-gray-500">
          <ShoppingBasket size={20} className="text-green-700" />
          BazarDor
        </div>

      </div>
    </main>
  );
}
