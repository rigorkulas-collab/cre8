"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // [LOGIC] Placeholder for real authentication check
    // Example: const token = localStorage.getItem('auth_token');
    // setIsAuth(!!token);
    
    // Defaulting to false for now to demonstrate redirect to /login

    const timer = setTimeout(() => {
      router.push("/login");
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Logo Section */}
      <div className="relative w-40 h-40 transition-transform hover:scale-105 duration-500">
        <Image
          src="/logo.png"
          alt="CRE8 Salon Logo"
          fill
          sizes="(max-width: 768px) 160px, 160px"
          className="object-contain grayscale brightness-0"
          priority
        />
      </div>
    </main>
  );
}
