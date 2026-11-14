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

export default function SignUpForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }

      toast.success("Your account has been created successfully!");

      router.push("/sign-in");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsSocialLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Social login failed!");
        setIsSocialLoading(false);
      }
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("Unable to continue with social login.");
      setIsSocialLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f5f1] flex flex-col items-center justify-center px-4 py-10">
      {/* Heading */}
      <div className="text-center mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202b23]">
          Create Your Account
        </h1>

        <p className="text-sm text-[#778078] mt-2">
          Sign up for free to explore detailed market prices.
        </p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-100 bg-[#fbfdfb] border border-[#dfe8e0] rounded-2xl p-6 sm:p-7">
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* Name */}
          <TextField name="name" isRequired minLength={2}>
            <Label className="text-sm text-[#263329]">Name</Label>

            <Input
              placeholder="e.g. Rahim Uddin"
              className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent px-3 text-sm"
            />

            <FieldError />
          </TextField>

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
            <Label className="text-sm text-[#263329]">Email</Label>

            <Input
              placeholder="you@example.com"
              className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent px-3 text-sm"
            />

            <FieldError />
          </TextField>

          {/* Password */}
          <TextField name="password" type="password" isRequired minLength={8}>
            <Label className="text-sm text-[#263329]">Password</Label>

            <Input
              placeholder="At least 8 characters"
              className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent px-3 text-sm"
            />

            <FieldError />
          </TextField>

          {/* Confirm Password */}
          <TextField name="confirmPassword" type="password" isRequired>
            <Label className="text-sm text-[#263329]">Confirm Password</Label>

            <Input
              placeholder="Enter your password again"
              className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent px-3 text-sm"
            />

            <FieldError />
          </TextField>

          {/* Register Button */}
          <Button
            type="submit"
            isDisabled={isLoading || isSocialLoading}
            className="w-full h-10 mt-1 rounded-lg bg-[#078b43] text-white font-semibold hover:bg-[#067638] shadow-md"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-[#dfe8e0]" />

          <span className="text-xs text-gray-500">OR</span>

          <div className="h-px flex-1 bg-[#dfe8e0]" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-2 ml-9">
          {/* Google */}
          <Button
            type="button"
            variant="secondary"
            isDisabled={isSocialLoading || isLoading}
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
            Google
          </Button>

          {/* GitHub */}
          <Button
            type="button"
            variant="secondary"
            isDisabled={isSocialLoading || isLoading}
            onPress={() => handleSocialLogin("github")}
            className="h-10 rounded-lg border border-[#dfe8e0] bg-transparent text-sm text-[#263329]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4.25 h-4.25"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.76 2.45 3.42 1.74.1-.73.39-1.22.7-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.76 10.76 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.62 1.55.23 2.69.12 2.98.72.79 1.15 1.79 1.15 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
            </svg>
            GitHub
          </Button>
        </div>

        {/* Sign In */}
        <p className="text-center text-sm text-[#465248] mt-5">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#078b43] font-semibold hover:underline"
          >
            Sign In
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
