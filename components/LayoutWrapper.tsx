import type { ReactNode } from "react";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh max-w-4xl mx-auto px-4 py-8">
      <Navbar />
      {children}
    </div>
  );
}
