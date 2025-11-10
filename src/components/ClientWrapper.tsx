"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where header should be hidden
  const hideHeaderOn = ["/login", "/register", "/forgot-password", "/reset"];
  const showHeader = !hideHeaderOn.includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      <main className={`grow ${showHeader ? "mt-[70px]" : ""}`}>{children}</main>
    </>
  );
}
