"use client";

import React from "react";

interface AdminContentProps {
  children: React.ReactNode;
}

export default function AdminContent({ children }: AdminContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50/40 dark:bg-gray-950 p-6 transition-colors duration-200">
      <div className="mx-auto max-w-7xl animate-admin-in">
        {children}
      </div>
    </main>
  );
}
