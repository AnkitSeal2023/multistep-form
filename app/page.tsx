import React from "react";
import ThemeToggle from "../components/theme-toggle";
import StepProgress from "../components/progressBar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-2">
      <nav className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </nav>
      <StepProgress />
    </div>
  );
}
