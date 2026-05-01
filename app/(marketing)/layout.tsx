"use client";

import { Header } from "@/components/layout/Header";
import { usePathname } from "next/navigation";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  
  const headerVariant = pathname === '/' ? 'transparent' : 'solid';

  return (
    <>
      {!isLoginPage && <Header variant={headerVariant} />}
      {children}
    </>
  );
}
