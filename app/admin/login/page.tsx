"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import FormInput from "@/components/shared/forms/FormInput";
import Button from "@/components/ui/Button";
import { Mail, Lock, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("admin@salon.com");
  const [password, setPassword] = useState("password123");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Basic email validation
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    // Basic password validation
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    // Simulate login transitions and redirect to staff dashboard
    startTransition(async () => {
      // Small simulated delay for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/admin/dashboard");
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950 justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Brand Banner */}
        <div className="flex flex-col items-center gap-2 select-none animate-fade-in">
          <div className="relative w-28 h-28">
            <Image
              src={logo}
              alt="CRE8 Salon Logo"
              fill
              sizes="112px"
              className="object-contain grayscale brightness-0 dark:invert"
              priority
            />
          </div>
        </div>

        {/* Credentials Card container */}
        <Card className="rounded-lg py-8 sm:py-10 border border-gray-100 dark:border-gray-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none bg-white dark:bg-gray-900">
          <div className="flex flex-col gap-6">
            <SectionHeader
              title="Staff Authentication"
              className="mb-2"
            />

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <FormInput
                label="Staff Email Address"
                type="email"
                placeholder="admin@salon.com"
                required
                icon={Mail}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                error={emailError}
              />

              <FormInput
                label="Access Password"
                type="password"
                placeholder="••••••••"
                required
                icon={Lock}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                error={passwordError}
              />

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-11 rounded-lg font-bold shadow-md shadow-gray-900/5 transition-all duration-200"
                  disabled={isPending}
                >
                  {isPending ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Footer info text */}
        <p className="text-center text-xs text-gray-400 font-semibold select-none leading-relaxed">
          Authorized personnel only. Access attempt logs are actively recorded for security audit.
        </p>
      </div>
    </div>
  );
}
