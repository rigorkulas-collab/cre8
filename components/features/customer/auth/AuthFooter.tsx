"use client";

import React from "react";
import Link from "next/link";

export interface AuthFooterProps {
  mode: "login" | "signup";
}

export default function AuthFooter({ mode }: AuthFooterProps) {
  return (
    <footer className="w-full text-center flex flex-col gap-3 py-2">
      {mode === "login" ? (
        <p className="text-[10px] font-bold text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline transition-all cursor-pointer font-extrabold"
          >
            Sign Up
          </Link>
        </p>
      ) : (
        <p className="text-[10px] font-bold text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white hover:underline transition-all cursor-pointer font-extrabold"
          >
            Sign In
          </Link>
        </p>
      )}
    </footer>
  );
}
