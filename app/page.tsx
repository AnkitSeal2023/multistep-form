import React from "react";
import ThemeToggle from "../components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-2">
      <nav className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </nav>
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground">Get started with your profile setup</p>
        <Link href="/step1">
          <Button size="lg" className="mt-4">
            Start Onboarding
          </Button>
        </Link>
      </div>
    </div>
  );
}
