"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/src/app/lib/auth-client";
import CategoryNav from "./category";
import PriceTicker from "./PriceTicker";

// Bangla Date Component
// I made it separately because it uses the `toLocaleDateString` method which is not supported in server components.

function BanglaDate() {
  const today = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <p className="text-[10px] text-gray-500 sm:text-xs">
      {today}
    </p>
  );
}

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 sm:h-11 sm:w-11">
            <ShoppingCart className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">
              BazarDor
            </h1>

            {/* Bangla Date */}
            <Suspense fallback={<span>&nbsp;</span>}>
              <BanglaDate />
            </Suspense>
          </div>
        </Link>

        {/* Authentication Buttons */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <span className="hidden items-center gap-2 text-sm text-gray-700 md:flex">
                    <User size={18} />
                    {session.user.name}
                  </span>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 sm:gap-2 sm:px-4 sm:text-sm"
                  >
                    <LogOut size={15} className="sm:h-[17px] sm:w-[17px]" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-sm"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className="whitespace-nowrap rounded-lg bg-green-700 px-2.5 py-2 text-xs font-medium text-white transition hover:bg-green-800 sm:px-4 sm:text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Price Ticker */}
      <PriceTicker />
    </header>
  );
}