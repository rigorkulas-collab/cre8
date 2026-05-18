"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/shared/forms/FormInput";
import FormActions from "@/components/shared/forms/FormActions";
import Checkbox from "@/components/ui/Checkbox";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRemember = localStorage.getItem("cre8_remember_me") === "true";
      const savedEmail = localStorage.getItem("cre8_remember_email");
      
      if (savedRemember && savedEmail) {
        setEmail(savedEmail);
        setPassword("password123");
        setRememberMe(true);
      } else {
        // Seamless default autofill credentials for testing
        setEmail("zachary@example.com");
        setPassword("password123");
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Mock interactive transition delay
    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful redirection to customer dashboard homepage
      if (typeof window !== "undefined") {
        localStorage.setItem("cre8_user_role", "member");
        if (rememberMe) {
          localStorage.setItem("cre8_remember_me", "true");
          localStorage.setItem("cre8_remember_email", email);
        } else {
          localStorage.removeItem("cre8_remember_me");
          localStorage.removeItem("cre8_remember_email");
        }
      }
      router.push("/dashboard");
    }, 800);
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
      {/* Email Input Field */}
      <FormInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={isLoading}
        required
      />

      {/* Password Input Field */}
      <FormInput
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={isLoading}
        required
      />

      {/* Remember Me & Forgot Password Row */}
      <div className="flex items-center justify-between pt-1">
        <Checkbox
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isLoading}
        />
        <button
          type="button"
          className="text-[10px] font-bold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline focus:outline-none cursor-pointer"
          onClick={() => alert("Password reset link simulated and sent to your email!")}
        >
          Forgot Password?
        </button>
      </div>

      {/* Action Buttons segments */}
      <FormActions
        submitText="Sign In"
        cancelText="Continue as Guest"
        onCancel={() => {
          if (typeof window !== "undefined") {
            localStorage.setItem("cre8_user_role", "guest");
          }
          router.push("/browse-services");
        }}
        isLoading={isLoading}
        className="mt-2"
      />
    </form>
  );
}
