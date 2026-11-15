"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  User,
  Mail,
  LogOut,
  Save,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/src/app/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  // Get the currently logged-in user's session
  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect users who are not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  // Update user's name
  const handleUpdateProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const { error: updateError } = await authClient.updateUser({
        name,
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update profile.");
      }

      setMessage("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      await authClient.signOut();

      router.replace("/sign-in");
    } catch {
      setError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  // Loading state
  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
      </div>
    );
  }

  const user = session.user;

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-3xl">

        {/* Page Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#1F2B22] sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage your account information.
          </p>
        </div>

        {/* Profile Information Card */}
        <section className="mb-6 rounded-2xl border border-[#E0E9E0] bg-[#FCFDFC] p-5 shadow-sm sm:p-7">

          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

            {/* User Information */}
            <div className="flex items-center gap-4">

              {/* User Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-green-100 text-2xl font-bold text-green-800">

                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}

              </div>

              {/* Name and Email */}
              <div>
                <h2 className="text-xl font-bold text-[#1F2B22]">
                  {user.name}
                </h2>

                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={15} />
                  {user.email}
                </p>
              </div>

            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {signingOut ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LogOut size={17} />
              )}

              Sign Out
            </button>

          </div>
        </section>

        {/* Personal Information Card */}
        <section className="rounded-2xl border border-[#E0E9E0] bg-[#FCFDFC] p-5 shadow-sm sm:p-7">

          <div className="mb-7">
            <h2 className="text-lg font-bold text-[#1F2B22]">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your account details below.
            </p>
          </div>

          {/* Update Profile Form */}
          <form onSubmit={handleUpdateProfile}>

            {/* Name Field */}
            <div className="mb-6">

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-[#DCE5DC] bg-white py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

            {/* Email Field - Read Only */}
            <div className="mb-6">

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-[#DCE5DC] bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Your email address cannot be changed here.
              </p>

            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Update Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Profile
                </>
              )}
            </button>

          </form>

        </section>

        {/* Account Security Information */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={15} className="text-green-700" />
          Your account information is securely managed by BazarDor.
        </div>

      </div>
    </main>
  );
}
