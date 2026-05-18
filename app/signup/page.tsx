"use client";

import React from "react";
import Image from "next/image";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import RegisterForm from "@/components/features/customer/auth/RegisterForm";
import AuthFooter from "@/components/features/customer/auth/AuthFooter";

export default function SignupPage() {
  return (
    <CustomerLayout
      showBottomNav={false}
      headerProps={{ title: "Create Account", showBackButton: true }}
    >
      <div className="flex flex-col gap-6 w-full py-4 text-center animate-page-in">
        {/* Logo */}
        <div className="flex justify-center pt-2">
          <Image
            src="/logo.png"
            alt="CRE8 Logo"
            width={90}
            height={90}
            style={{ height: "auto" }}
            className="object-contain brightness-0 dark:invert"
          />
        </div>

        {/* Signup Register Form Primitives */}
        <RegisterForm />

        {/* Footer redirection links */}
        <AuthFooter mode="signup" />
      </div>
    </CustomerLayout>
  );
}
