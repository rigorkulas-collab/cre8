"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/shared/forms/FormInput";
import FormActions from "@/components/shared/forms/FormActions";

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\+?[0-9]{10,12}$/.test(mobileNumber.replace(/[\s-]/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Route to dashboard page on successful signup simulation
      if (typeof window !== "undefined") {
        localStorage.setItem("cre8_user_role", "member");
      }
      router.push("/dashboard");
    }, 800);
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
      {/* Full Name Field */}
      <FormInput
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        disabled={isLoading}
        required
      />

      {/* Email Field */}
      <FormInput
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={isLoading}
        required
      />

      {/* Mobile Number Field */}
      <FormInput
        label="Mobile Number"
        type="tel"
        placeholder="e.g. 09171234567"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        error={errors.mobileNumber}
        disabled={isLoading}
        required
      />

      {/* Password Field */}
      <FormInput
        label="Password"
        type="password"
        placeholder="Minimum 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={isLoading}
        required
      />

      {/* Confirm Password Field */}
      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        disabled={isLoading}
        required
      />

      {/* Action triggers */}
      <FormActions
        submitText="Create Account"
        cancelText="Sign In"
        onCancel={() => router.push("/login")}
        isLoading={isLoading}
        className="mt-2"
      />
    </form>
  );
}
