"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import BlobCursor from "@/components/BlobCursor";

const STORAGE_KEY = "multistep-form-data";

export type Step3FormData = {
  primaryGoal: string;
  toolsUsed: string[];
};

const initialFormData: Step3FormData = {
  primaryGoal: "",
  toolsUsed: [],
};

const goalOptions = [
  {
    value: "learn",
    label: "Learn new skills",
    description: "Expand your knowledge and capabilities",
  },
  {
    value: "build",
    label: "Build a project",
    description: "Create something meaningful",
  },
  {
    value: "career",
    label: "Advance my career",
    description: "Get a promotion or new job",
  },
  {
    value: "startup",
    label: "Launch a startup",
    description: "Turn your idea into a business",
  },
  {
    value: "freelance",
    label: "Freelance/Consult",
    description: "Work independently with clients",
  },
  {
    value: "hobby",
    label: "Personal hobby",
    description: "Enjoy coding as a passion",
  },
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

export default function Step3Page() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState<Step3FormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.step3) {
            requestAnimationFrame(() => {
              setFormData(parsed.step3);
              setIsLoaded(true);
            });
          } else {
            requestAnimationFrame(() => {
              setIsLoaded(true);
            });
          }
        } catch (err) {
          console.warn("Failed to load form data:", err);
          requestAnimationFrame(() => {
            setIsLoaded(true);
          });
        }
      } else {
        requestAnimationFrame(() => {
          setIsLoaded(true);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      let allData = {};
      try {
        if (stored) {
          allData = JSON.parse(stored);
        }
      } catch {}
      allData = { ...allData, step3: formData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    }
  }, [formData, isLoaded]);

  const handleGoalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, primaryGoal: value }));
    setTouched((prev) => ({ ...prev, primaryGoal: true }));
    if (value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.primaryGoal;
        return newErrors;
      });
    }
  };

  const handleToolChange = (toolId: string) => {
    setFormData((prev) => {
      const currentTools = prev.toolsUsed || [];
      if (currentTools.includes(toolId)) {
        return {
          ...prev,
          toolsUsed: currentTools.filter((id) => id !== toolId),
        };
      } else {
        return {
          ...prev,
          toolsUsed: [...currentTools, toolId],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.primaryGoal) {
      newErrors.primaryGoal = "Please select your primary goal";
    }

    setErrors(newErrors);
    setTouched({ primaryGoal: true });

    if (Object.keys(newErrors).length === 0) {
      router.push("/step4");
    }
  };

  return (
    <div className="z-20 min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
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

      {/* Step Navigation */}
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

      {/* Glassmorphism container */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Step 3: Goals & Workflow
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Help us understand your objectives and current setup
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Primary Goal */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  What&apos;s your primary goal?{" "}
                  <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select the option that best describes what you want to achieve
                </p>
              </div>
              <div className="grid gap-3">
                {goalOptions.map((goal) => (
                  <label
                    key={goal.value}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                      "bg-white/50 dark:bg-black/30 backdrop-blur-sm",
                      formData.primaryGoal === goal.value
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "border-white/20 dark:border-white/10 hover:border-primary/50 hover:bg-white/70 dark:hover:bg-black/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="primaryGoal"
                      value={goal.value}
                      checked={formData.primaryGoal === goal.value}
                      onChange={() => handleGoalChange(goal.value)}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{goal.label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {goal.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {touched.primaryGoal && errors.primaryGoal && (
                <p className="text-xs text-destructive">{errors.primaryGoal}</p>
              )}
            </div>

            {/* Tools Currently Used */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Tools you currently use
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select all that apply to help us personalize your experience
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {toolOptions.map((tool) => (
                  <label
                    key={tool.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      "bg-white/50 dark:bg-black/30 backdrop-blur-sm",
                      formData.toolsUsed.includes(tool.id)
                        ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                        : "border-white/20 dark:border-white/10 hover:border-primary/50 hover:bg-white/70 dark:hover:bg-black/50",
                    )}
                  >
                    <Checkbox
                      id={tool.id}
                      checked={formData.toolsUsed.includes(tool.id)}
                      onCheckedChange={() => handleToolChange(tool.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={tool.id}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {tool.label}
                    </Label>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/step2")}
                className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10"
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="backdrop-blur-sm bg-primary/90 hover:bg-primary"
              >
                Continue to Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
