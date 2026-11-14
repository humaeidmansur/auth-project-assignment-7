"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Button,
  Form,
  Input,
  Label,
  TextField,
  FieldError,
} from "@heroui/react";

import { toast } from "react-toastify";
import { authClient } from "@/src/app/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  // Email and Password Login
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password!");
        return;
      }

      toast.success("Welcome back to BazarDor!");

      router.push("/");
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google and GitHub Login
  const handleSocialLogin = async (
    provider: "google" | "github"
  ) => {
    if (provider === "google") {
      setIsGoogleLoading(true);
    } else {
      setIsGithubLoading(true);
    }

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Social login failed!");
        setIsGoogleLoading(false);
        setIsGithubLoading(false);
      }
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("Unable to continue with social login.");

      setIsGoogleLoading(false);
      setIsGithubLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f5f1] flex flex-col items-center justify-center px-4 py-10">

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202b23]">
          Sign In
        </h1>

        <p className="text-sm text-[#778078] mt-2">
          Sign in to explore detailed prices, compare markets <br /> and view your profile.
        </p>
      </div>

      {/* Sign In Card */}
      <div className="w-full max-w-[380px] bg-[#fbfdfb] border border-[#dfe8e0] rounded-2xl p-6">

        <Form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
        >

          {/* Email */}
          <TextField
            name="email"
            type="email"
            isRequired
            validate={(value) => {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email address.";
              }

              return null;
            }}
          >
            <Label className="text-sm text-[#263329]">
              Email
            </Label>

            <Input
              placeholder="you@example.com"
              className="h-9 rounded-lg border border-[#dfe8e0] bg-transparent px-3 text-sm"
            />

            <FieldError />
          </TextField>

          {/* Password */}
          <TextField
            name="password"
            type="password"
            isRequired
          >
            <Label className="text-sm text-[#263329]">
              Password
            </Label>

            <Input
              placeholder="Enter your password"
              className="h-9 rounded-lg border border-[#dfe8e0] bg-transparent px-3 text-sm"
            />

            <FieldError />
          </TextField>

          {/* Sign In Button */}
          <Button
            type="submit"
            isDisabled={isLoading || isGoogleLoading || isGithubLoading}
            className="w-full h-10 mt-1 rounded-lg bg-[#078b43] text-white font-semibold hover:bg-[#067638] shadow-md"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-[#dfe8e0]" />

          <span className="text-xs text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-[#dfe8e0]" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-2 ml-10">

          {/* Google */}
          <Button
            type="button"
            variant="secondary"
            isDisabled={isLoading || isGoogleLoading || isGithubLoading}
            onPress={() => handleSocialLogin("google")}
            className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent text-sm text-[#263329]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-4 h-4"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.17l7.73 6C44.42 37.96 46.98 31.9 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.73-6c-2.15 1.45-4.89 2.31-8.18 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            {isGoogleLoading ? "Please wait..." : "Google"}
          </Button>

          {/* GitHub */}
          <Button
            type="button"
            variant="secondary"
            isDisabled={isLoading || isGoogleLoading || isGithubLoading}
            onPress={() => handleSocialLogin("github")}
            className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent text-sm text-[#263329]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.03.75 2.08V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z" />
            </svg>

            {isGithubLoading ? "Please wait..." : "GitHub"}
          </Button>

        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-[#465248] mt-5">
          You have not any account?{" "}

          <Link
            href="/sign-up"
            className="text-[#078b43] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>

   
      <Link
        href="/"
        className="text-sm text-[#849087] mt-6 hover:text-[#078b43] transition-colors"
      >
        Back to Home
      </Link>

    </main>
  );
}