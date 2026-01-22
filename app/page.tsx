import React from "react";
import ThemeToggle from "../components/theme-toggle";
import StepProgress from "../components/progressBar";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-2">
      <nav className="theme-switcher fixed top-0 right-0 z-50">
        <ThemeToggle />
      </nav>
      <StepProgress />
    </div>
  );
}
