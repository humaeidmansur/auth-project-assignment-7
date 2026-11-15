"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/src/app/lib/auth-client";
import CategoryNav from "./category";
import PriceTicker from "./PriceTicker";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
            <ShoppingCart className="h-6 w-6 text-green-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              BazarDor
            </h1>
            <p className="text-xs text-gray-500">{today}</p>
          </div>
        </Link>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-3">
          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <span className="hidden items-center gap-2 text-sm text-gray-700 sm:flex">
                    <User size={18} />
                    {session.user.name}
                  </span>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

   
      <CategoryNav />
      <PriceTicker />
    </header>
  );
}