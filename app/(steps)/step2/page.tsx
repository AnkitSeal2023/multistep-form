"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import BlobCursor from "@/components/BlobCursor";

const STORAGE_KEY = "multistep-form-data";

export type Step2FormData = {
  interests: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced" | "";
  newsletter: boolean;
  themePreference: "light" | "dark" | "system";
};

const initialFormData: Step2FormData = {
  interests: [],
  experienceLevel: "",
  newsletter: true,
  themePreference: "system",
};

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

const experienceLevels = [
  { value: "beginner", label: "Beginner", description: "Just getting started" },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience",
  },
  { value: "advanced", label: "Advanced", description: "Extensive experience" },
];

export default function Step2Page() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  // Start with initial data to avoid hydration mismatch
  const [formData, setFormData] = useState<Step2FormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.step2) {
            requestAnimationFrame(() => {
              setFormData(parsed.step2);
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
      allData = { ...allData, step2: formData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    }
  }, [formData, isLoaded]);

  const handleInterestChange = (interestId: string) => {
    setFormData((prev) => {
      const currentInterests = prev.interests || [];
      if (currentInterests.includes(interestId)) {
        return {
          ...prev,
          interests: currentInterests.filter((id) => id !== interestId),
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interestId],
        };
      }
    });

    if (touched.interests) {
      validateField("interests", formData.interests);
    }
  };

  const handleChange = (
    name: keyof Step2FormData,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const validateField = (
    name: keyof Step2FormData,
    value: string | boolean | string[],
  ) => {
    const newErrors = { ...errors };

    switch (name) {
      case "interests":
        if (!Array.isArray(value) || value.length === 0) {
          newErrors.interests = "Please select at least one interest";
        } else {
          delete newErrors.interests;
        }
        break;
      case "experienceLevel":
        if (!value || value === "") {
          newErrors.experienceLevel = "Please select your experience level";
        } else {
          delete newErrors.experienceLevel;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (name: keyof Step2FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = {
      interests: true,
      experienceLevel: true,
    };
    setTouched(allTouched);

    validateField("interests", formData.interests);
    validateField("experienceLevel", formData.experienceLevel);

    const isValid =
      formData.interests.length > 0 &&
      formData.experienceLevel !== "" &&
      Object.keys(errors).length === 0;

    if (isValid) {
      router.push("/step3");
    }
  };

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
              Step 2: Preferences
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Interests <span className="text-destructive">*</span>
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  Select all that apply
                </span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => {
                  const isSelected = formData.interests.includes(interest.id);
                  return (
                    <label
                      key={interest.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                        "bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10",
                        isSelected
                          ? "border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/30"
                          : "hover:bg-white/70 dark:hover:bg-black/50",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          handleInterestChange(interest.id)
                        }
                        onBlur={() => handleBlur("interests")}
                      />
                      <span className="text-sm">{interest.label}</span>
                    </label>
                  );
                })}
              </div>
              {touched.interests && errors.interests && (
                <p className="text-xs text-destructive">{errors.interests}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Experience Level <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  handleChange("experienceLevel", value)
                }
                onBlur={() => handleBlur("experienceLevel")}
                className="space-y-2"
              >
                {experienceLevels.map((level) => {
                  const isSelected = formData.experienceLevel === level.value;
                  return (
                    <label
                      key={level.value}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        "bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10",
                        isSelected
                          ? "border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/30"
                          : "hover:bg-white/70 dark:hover:bg-black/50",
                      )}
                    >
                      <RadioGroupItem value={level.value} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{level.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {level.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
              {touched.experienceLevel && errors.experienceLevel && (
                <p className="text-xs text-destructive">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-black/50">
                <Checkbox
                  checked={formData.newsletter}
                  onCheckedChange={(checked) =>
                    handleChange("newsletter", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Newsletter</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Receive updates about new features and tips
                  </div>
                </div>
              </label>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme Preference</Label>
              <RadioGroup
                value={formData.themePreference}
                onValueChange={(value) =>
                  handleChange("themePreference", value)
                }
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { value: "light", label: "Light", icon: "☀️" },
                  { value: "dark", label: "Dark", icon: "🌙" },
                  { value: "system", label: "System", icon: "💻" },
                ].map((theme) => {
                  const isSelected = formData.themePreference === theme.value;
                  return (
                    <label
                      key={theme.value}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all",
                        "bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10",
                        isSelected
                          ? "border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/30"
                          : "hover:bg-white/70 dark:hover:bg-black/50",
                      )}
                    >
                      <RadioGroupItem value={theme.value} className="h-4 w-4" />
                      <span className="text-2xl">{theme.icon}</span>
                      <span className="text-xs font-medium">{theme.label}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/step1")}
                className="backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10"
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="backdrop-blur-sm bg-primary/90 hover:bg-primary"
              >
                Continue to Step 3
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
