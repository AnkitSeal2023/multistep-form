"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import BlobCursor from "@/components/BlobCursor";

const STORAGE_KEY = "multistep-form-data";

export type Step1FormData = {
  name: string;
  email: string;
  password: string;
  role: "Student" | "Professional" | "Founder" | "";
  country: string;
  timezone: string;
  useOAuth: boolean;
  dob: string;
};

const initialFormData: Step1FormData = {
  name: "",
  email: "",
  password: "",
  role: "",
  country: "",
  timezone: "",
  useOAuth: false,
  dob: "",
};

// Password strength checker
const checkPasswordStrength = (
  password: string,
): {
  strength: "weak" | "medium" | "strong";
  message: string;
} => {
  if (password.length === 0) {
    return { strength: "weak", message: "" };
  }
  if (password.length < 8) {
    return {
      strength: "weak",
      message: "Password must be at least 8 characters",
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;

  if (criteriaCount < 2) {
    return {
      strength: "weak",
      message: "Add uppercase, lowercase, numbers, or special characters",
    };
  }
  if (criteriaCount < 3) {
    return { strength: "medium", message: "Good, but could be stronger" };
  }
  return { strength: "strong", message: "Strong password" };
};

// Email validation
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Common countries and timezones
const countries = [
  {
    value: "US",
    label: "United States",
    timezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
    ],
  },
  { value: "GB", label: "United Kingdom", timezones: ["Europe/London"] },
  {
    value: "CA",
    label: "Canada",
    timezones: ["America/Toronto", "America/Vancouver"],
  },
  {
    value: "AU",
    label: "Australia",
    timezones: ["Australia/Sydney", "Australia/Melbourne"],
  },
  { value: "DE", label: "Germany", timezones: ["Europe/Berlin"] },
  { value: "FR", label: "France", timezones: ["Europe/Paris"] },
  { value: "IN", label: "India", timezones: ["Asia/Kolkata"] },
  { value: "JP", label: "Japan", timezones: ["Asia/Tokyo"] },
  { value: "CN", label: "China", timezones: ["Asia/Shanghai"] },
  { value: "BR", label: "Brazil", timezones: ["America/Sao_Paulo"] },
];

export default function Step1Page() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Start with initial data to avoid hydration mismatch
  const [formData, setFormData] = useState<Step1FormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    // Defer state updates to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      setMounted(true);
    });

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.step1) {
            // Use requestAnimationFrame to defer state update
            requestAnimationFrame(() => {
              setFormData(parsed.step1);
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

  // Save to localStorage on change - only after initial load
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
      allData = { ...allData, step1: formData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    }
  }, [formData, isLoaded]);

  const validateField = (
    name: keyof Step1FormData,
    value: string | boolean,
  ) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          newErrors.name = "Full name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "email":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          newErrors.email = "Email is required";
        } else if (typeof value === "string" && !isValidEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!formData.useOAuth) {
          if (!value || (typeof value === "string" && value.length === 0)) {
            newErrors.password = "Password is required";
          } else if (typeof value === "string") {
            const strength = checkPasswordStrength(value);
            if (strength.strength === "weak") {
              newErrors.password = strength.message;
            } else {
              delete newErrors.password;
            }
          }
        } else {
          delete newErrors.password;
        }
        break;
      case "role":
        if (!value || value === "") {
          newErrors.role = "Please select a role";
        } else {
          delete newErrors.role;
        }
        break;
      case "country":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          newErrors.country = "Country is required";
        } else {
          delete newErrors.country;
        }
        break;
      case "timezone":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          newErrors.timezone = "Timezone is required";
        } else {
          delete newErrors.timezone;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (name: keyof Step1FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }

    if (name === "country" && typeof value === "string") {
      const country = countries.find((c) => c.value === value);
      if (country && country.timezones.length > 0) {
        setFormData((prev) => ({ ...prev, timezone: country.timezones[0] }));
      }
    }

    // Special handling for OAuth toggle
    if (name === "useOAuth" && value === true) {
      setFormData((prev) => ({ ...prev, password: "" }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const handleBlur = (name: keyof Step1FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      name: true,
      email: true,
      password: true,
      role: true,
      country: true,
      timezone: true,
    };
    setTouched(allTouched);

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(
        key as keyof Step1FormData,
        formData[key as keyof Step1FormData],
      );
    });

    // Check if form is valid
    const isValid =
      formData.name.trim().length > 0 &&
      isValidEmail(formData.email) &&
      (formData.useOAuth ||
        (formData.password.length > 0 &&
          checkPasswordStrength(formData.password).strength !== "weak")) &&
      formData.role !== "" &&
      formData.country !== "" &&
      formData.timezone !== "" &&
      Object.keys(errors).length === 0;

    if (isValid) {
      router.push("/step2");
    }
  };

  const passwordStrength = checkPasswordStrength(formData.password);
  // Only compute selectedCountry after mount to avoid hydration mismatch
  const selectedCountry = mounted
    ? countries.find((c) => c.value === formData.country)
    : undefined;

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

      {/* Glassmorphism container */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Step 1: Basic Info
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Collect stable user data
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="John Doe"
                autoFocus
                aria-invalid={touched.name && !!errors.name}
                className="bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@example.com"
                aria-invalid={touched.email && !!errors.email}
                className="bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10"
              />
              {touched.email && errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
              {touched.email && !errors.email && formData.email && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Valid email
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date of Birth
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10",
                      !formData.dob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dob ? (
                      format(new Date(formData.dob + 'T00:00:00'), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dob ? new Date(formData.dob + 'T00:00:00') : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        handleChange("dob", `${year}-${month}-${day}`);
                      } else {
                        handleChange("dob", "");
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              {touched.dob && errors.dob && (
                <p className="text-xs text-destructive">{errors.dob}</p>
              )}
            </div>
            {/* Password */}
            {!formData.useOAuth && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-destructive">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter a strong password"
                  aria-invalid={touched.password && !!errors.password}
                  className="bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10"
                />
                {touched.password && errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
                {touched.password && formData.password && !errors.password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            passwordStrength.strength === "weak" &&
                              "bg-destructive w-1/3",
                            passwordStrength.strength === "medium" &&
                              "bg-yellow-500 w-2/3",
                            passwordStrength.strength === "strong" &&
                              "bg-green-500 w-full",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          passwordStrength.strength === "weak" &&
                            "text-destructive",
                          passwordStrength.strength === "medium" &&
                            "text-yellow-600 dark:text-yellow-400",
                          passwordStrength.strength === "strong" &&
                            "text-green-600 dark:text-green-400",
                        )}
                      >
                        {passwordStrength.strength.toUpperCase()}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs",
                        passwordStrength.strength === "weak" &&
                          "text-destructive",
                        passwordStrength.strength === "medium" &&
                          "text-yellow-600 dark:text-yellow-400",
                        passwordStrength.strength === "strong" &&
                          "text-green-600 dark:text-green-400",
                      )}
                    >
                      {passwordStrength.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role <span className="text-destructive">*</span>
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                onBlur={() => handleBlur("role")}
                className={cn(
                  "h-9 w-full rounded-md border bg-white/50 dark:bg-black/30 backdrop-blur-sm px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60",
                  touched.role &&
                    errors.role &&
                    "border-destructive ring-destructive/20",
                )}
                aria-invalid={touched.role && !!errors.role}
              >
                <option value="">Select a role</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Founder">Founder</option>
              </select>
              {touched.role && errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country <span className="text-destructive">*</span>
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                onBlur={() => handleBlur("country")}
                className={cn(
                  "h-9 w-full rounded-md border bg-white/50 dark:bg-black/30 backdrop-blur-sm px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60",
                  touched.country &&
                    errors.country &&
                    "border-destructive ring-destructive/20",
                )}
                aria-invalid={touched.country && !!errors.country}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
              {touched.country && errors.country && (
                <p className="text-xs text-destructive">{errors.country}</p>
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone <span className="text-destructive">*</span>
              </label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                onBlur={() => handleBlur("timezone")}
                disabled={!mounted || !formData.country}
                className={cn(
                  "h-9 w-full rounded-md border bg-white/50 dark:bg-black/30 backdrop-blur-sm px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-50 disabled:cursor-not-allowed",
                  touched.timezone &&
                    errors.timezone &&
                    "border-destructive ring-destructive/20",
                )}
                aria-invalid={touched.timezone && !!errors.timezone}
              >
                <option value="">Select a timezone</option>
                {mounted &&
                  selectedCountry?.timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
              </select>
              {touched.timezone && errors.timezone && (
                <p className="text-xs text-destructive">{errors.timezone}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                size="lg"
                className="backdrop-blur-sm bg-primary/90 hover:bg-primary"
              >
                Continue to Step 2
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
