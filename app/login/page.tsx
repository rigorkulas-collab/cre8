"use client";

import React from "react";
import Image from "next/image";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import LoginForm from "@/components/features/customer/auth/LoginForm";
import AuthFooter from "@/components/features/customer/auth/AuthFooter";

export default function LoginPage() {
  return (
    <CustomerLayout
      showBottomNav={false}
      headerProps={{ title: "Sign In", showBackButton: false }}
    >
      <div className="flex flex-col gap-6 w-full py-4 text-center animate-page-in">
        {/* Logo */}
        <div className="flex justify-center pt-2">
          <Image
            src="/cre8/logo.png"
            alt="CRE8 Logo"
            width={90}
            height={90}
            style={{ height: "auto" }}
            className="object-contain brightness-0 dark:invert"
          />
        </div>

        {/* Login Form Primitives */}
        <LoginForm />

        {/* Footer redirection links */}
        <AuthFooter mode="login" />
      </div>
    </CustomerLayout>
  );
}
