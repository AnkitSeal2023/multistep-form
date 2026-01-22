"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BlobCursor from "@/components/BlobCursor";
import type { Step1FormData } from "../step1/page";
import type { Step2FormData } from "../step2/page";
import type { Step3FormData } from "../step3/page";

const STORAGE_KEY = "multistep-form-data";

const interestOptions = [
  { id: "web-dev", label: "Web Development" },
  { id: "mobile-dev", label: "Mobile Development" },
  { id: "data-science", label: "Data Science" },
  { id: "ai-ml", label: "AI & Machine Learning" },
  { id: "design", label: "Design" },
  { id: "devops", label: "DevOps" },
  { id: "security", label: "Cybersecurity" },
  { id: "gaming", label: "Game Development" },
];

const goalOptions = [
  { value: "learn", label: "Learn new skills" },
  { value: "build", label: "Build a project" },
  { value: "career", label: "Advance my career" },
  { value: "startup", label: "Launch a startup" },
  { value: "freelance", label: "Freelance/Consult" },
  { value: "hobby", label: "Personal hobby" },
];

const toolOptions = [
  { id: "vscode", label: "VS Code" },
  { id: "intellij", label: "IntelliJ / JetBrains" },
  { id: "vim", label: "Vim / Neovim" },
  { id: "git", label: "Git / GitHub" },
  { id: "docker", label: "Docker" },
  { id: "figma", label: "Figma" },
  { id: "notion", label: "Notion" },
  { id: "slack", label: "Slack" },
  { id: "jira", label: "Jira / Linear" },
  { id: "postman", label: "Postman / Insomnia" },
  { id: "terminal", label: "Terminal / CLI" },
  { id: "chatgpt", label: "ChatGPT / AI Tools" },
];

const experienceLevelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const themeLabels: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const countries = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "BR", label: "Brazil" },
];

export default function Step4Page() {
  const router = useRouter();
  const pathname = usePathname();
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);
  const [step2Data, setStep2Data] = useState<Step2FormData | null>(null);
  const [step3Data, setStep3Data] = useState<Step3FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.step1) {
            setStep1Data(parsed.step1);
          }
          if (parsed.step2) {
            setStep2Data(parsed.step2);
          }
          if (parsed.step3) {
            setStep3Data(parsed.step3);
          }
        } catch (err) {
          console.warn("Failed to load form data:", err);
        }
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!step1Data || !step2Data || !step3Data) {
      setSubmitError("Please complete all steps before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const allFormData = {
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
      };

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      setSubmitSuccess(true);

      // Clear localStorage after successful submission
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCountryLabel = (value: string) => {
    const country = countries.find((c) => c.value === value);
    return country?.label || value;
  };

  const getInterestLabels = (interestIds: string[]) => {
    return interestIds
      .map((id) => interestOptions.find((opt) => opt.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  const getGoalLabel = (value: string) => {
    const goal = goalOptions.find((g) => g.value === value);
    return goal?.label || value;
  };

  const getToolLabels = (toolIds: string[]) => {
    return toolIds
      .map((id) => toolOptions.find((opt) => opt.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
        <BlobCursor
          blobType="circle"
          fillColor="hsl(240, 40%, 55%)"
          trailCount={3}
          sizes={[60, 125, 75]}
          innerSizes={[20, 35, 25]}
          innerColor="rgba(255,255,255,0.1)"
          opacities={[0.35, 0.25, 0.2]}
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={4}
          shadowOffsetX={5}
          shadowOffsetY={5}
          filterStdDeviation={25}
          useFilter={true}
          fastDuration={0.1}
          slowDuration={0.5}
          zIndex={1}
        />
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[20px_20px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Form Submitted Successfully!
            </h1>
            <p className="text-sm text-muted-foreground">
              Thank you for completing the form. You will be redirected shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      <BlobCursor
        blobType="circle"
        fillColor="hsl(240, 40%, 55%)"
        trailCount={3}
        sizes={[60, 125, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(255,255,255,0.1)"
        opacities={[0.35, 0.25, 0.2]}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={4}
        shadowOffsetX={5}
        shadowOffsetY={5}
        filterStdDeviation={25}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={1}
      />
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[20px_20px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      {/* Step Navigation - Above form container */}
      <div className="relative z-10 w-full max-w-2xl mb-6">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/step1")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
              pathname === "/step1"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-black/50 text-muted-foreground hover:text-foreground",
            )}
          >
            Step 1
          </button>
          <button
            type="button"
            onClick={() => router.push("/step2")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
              pathname === "/step2"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-black/50 text-muted-foreground hover:text-foreground",
            )}
          >
            Step 2
          </button>
          <button
            type="button"
            onClick={() => router.push("/step3")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
              pathname === "/step3"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-black/50 text-muted-foreground hover:text-foreground",
            )}
          >
            Step 3
          </button>
          <button
            type="button"
            onClick={() => router.push("/step4")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
              pathname === "/step4"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-black/50 text-muted-foreground hover:text-foreground",
            )}
          >
            Step 4
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Step 4: Review & Submit
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your information before submitting
            </p>
          </div>

          {(!step1Data || !step2Data || !step3Data) && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                Please complete Steps 1, 2, and 3 before reviewing.
              </p>
            </div>
          )}

          {step1Data && step2Data && step3Data && (
            <div className="space-y-6">
              {/* Step 1 Summary */}
              <div className="space-y-3 rounded-lg border bg-white/30 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Basic Info</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/step1")}
                    className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10"
                  >
                    Edit
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">
                      {step1Data.name || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">
                      {step1Data.email || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Date of Birth:
                    </span>{" "}
                    <span className="font-medium">
                      {step1Data.dob
                        ? new Date(step1Data.dob).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not provided"}
                    </span>
                  </div>
                  {!step1Data.useOAuth && (
                    <div>
                      <span className="text-muted-foreground">Password:</span>{" "}
                      <span className="font-medium">••••••••</span>
                    </div>
                  )}
                  {step1Data.useOAuth && (
                    <div>
                      <span className="text-muted-foreground">
                        Authentication:
                      </span>{" "}
                      <span className="font-medium">OAuth</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Role:</span>{" "}
                    <span className="font-medium">
                      {step1Data.role || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Country:</span>{" "}
                    <span className="font-medium">
                      {step1Data.country
                        ? getCountryLabel(step1Data.country)
                        : "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timezone:</span>{" "}
                    <span className="font-medium">
                      {step1Data.timezone
                        ? step1Data.timezone.replace("_", " ")
                        : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 Summary */}
              <div className="space-y-3 rounded-lg border bg-white/30 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Preferences</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/step2")}
                    className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10"
                  >
                    Edit
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Interests:</span>{" "}
                    <span className="font-medium">
                      {step2Data.interests.length > 0
                        ? getInterestLabels(step2Data.interests)
                        : "None selected"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Experience Level:
                    </span>{" "}
                    <span className="font-medium">
                      {step2Data.experienceLevel
                        ? experienceLevelLabels[step2Data.experienceLevel]
                        : "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Newsletter:</span>{" "}
                    <span className="font-medium">
                      {step2Data.newsletter ? "Subscribed" : "Not subscribed"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Theme Preference:
                    </span>{" "}
                    <span className="font-medium">
                      {step2Data.themePreference
                        ? themeLabels[step2Data.themePreference]
                        : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 Summary */}
              <div className="space-y-3 rounded-lg border bg-white/30 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Goals & Workflow</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/step3")}
                    className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10"
                  >
                    Edit
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Primary Goal:</span>{" "}
                    <span className="font-medium">
                      {step3Data.primaryGoal
                        ? getGoalLabel(step3Data.primaryGoal)
                        : "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tools Used:</span>{" "}
                    <span className="font-medium">
                      {step3Data.toolsUsed.length > 0
                        ? getToolLabels(step3Data.toolsUsed)
                        : "None selected"}
                    </span>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{submitError}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/step3")}
                  disabled={isSubmitting}
                  className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="backdrop-blur-sm bg-primary/90 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Form"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
