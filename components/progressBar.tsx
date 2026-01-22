"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TOTAL_STEPS = 4;
const STORAGE_KEY = "multistep-form-progress";
const DEBOUNCE_DELAY = 500; // milliseconds

type FormState = {
  name: string;
  email: string;
  age: string;
  street: string;
  city: string;
  newsletter: boolean;
  updates: boolean;
};

type StoredState = {
  form: FormState;
  step: number;
};

const initialState: FormState = {
  name: "",
  email: "",
  age: "",
  street: "",
  city: "",
  newsletter: true,
  updates: true,
};

const stepTitles = [
  "Basic details",
  "Address",
  "Preferences",
  "Review & submit",
];

const stepDescriptions = [
  "Tell us a little bit about yourself.",
  "Where can we reach you?",
  "Choose how you want to hear from us.",
  "Confirm that everything looks good before submitting.",
];

const loadFromStorage = (): StoredState | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as StoredState;
    // Validate the stored data structure
    if (
      parsed &&
      typeof parsed.step === "number" &&
      parsed.form &&
      typeof parsed.form === "object"
    ) {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to load form progress from localStorage:", error);
  }
  return null;
};

const saveToStorage = (form: FormState, step: number) => {
  if (typeof window === "undefined") return;
  try {
    const state: StoredState = { form, step };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save form progress to localStorage:", error);
  }
};

const clearStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear form progress from localStorage:", error);
  }
};

export default function StepProgress() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [touchedStep, setTouchedStep] = useState(false);

  // Debounce timer ref for form saves
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef(1);
  const isInitialMount = useRef(true);

  // After hydration, load any saved progress from localStorage on the client
  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored) return;

    // Schedule state updates to the next frame to avoid synchronous setState in effect
    const raf = requestAnimationFrame(() => {
      setForm(stored.form);
      setStep(stored.step);
      prevStepRef.current = stored.step;
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const progress = (step - 1) / (TOTAL_STEPS - 1);
  const translateX = `-${100 - progress * 100}%`;

  // Save form changes with debouncing, step changes immediately
  useEffect(() => {
    // Skip saving on initial mount (we just loaded from storage)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (submitted) return;

    // If step changed, save immediately and clear any pending debounce
    if (prevStepRef.current !== step) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      saveToStorage(form, step);
      prevStepRef.current = step;
      return;
    }

    // For form changes, debounce the save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveToStorage(form, step);
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, step, submitted]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const requiredFieldsValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.street.trim().length > 0 &&
    form.city.trim().length > 0;

  const stepIsValid = useMemo(() => {
    switch (step) {
      case 1:
        return form.name.trim().length > 0 && form.email.trim().length > 0;
      case 2:
        return form.street.trim().length > 0 && form.city.trim().length > 0;
      case 3:
        // All optional for now
        return true;
      case 4:
        return requiredFieldsValid;
      default:
        return false;
    }
  }, [step, form, requiredFieldsValid]);

  const canGoNext = step < TOTAL_STEPS && stepIsValid;

  const handleNext = () => {
    setTouchedStep(true);
    if (!stepIsValid) return;
    setTouchedStep(false);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleBack = () => {
    setTouchedStep(false);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    setTouchedStep(true);

    if (!requiredFieldsValid) {
      // Jump back to the first missing required step
      if (!form.name.trim() || !form.email.trim()) {
        setStep(1);
      } else if (!form.street.trim() || !form.city.trim()) {
        setStep(2);
      }
      return;
    }

    setSubmitted(true);
    // Clear storage on successful submit
    clearStorage();
  };

  const showError =
    touchedStep &&
    (!stepIsValid || (step === 4 && !requiredFieldsValid && !submitted));

  const renderStep = () => {
    if (submitted) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border bg-secondary/30 p-4 text-sm">
            <p className="font-medium">Form submitted!</p>
            <p className="mt-1 text-muted-foreground">
              This demo doesn&apos;t send your data anywhere, but this is what
              would be submitted:
            </p>
          </div>
          <pre className="max-h-56 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(form, null, 2)}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setForm(initialState);
              setSubmitted(false);
              setStep(1);
              setTouchedStep(false);
              clearStorage();
            }}
          >
            Start over
          </Button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Full name
                <span className="ml-1 text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email address
                <span className="ml-1 text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="street">
                Street address
                <span className="ml-1 text-destructive">*</span>
              </label>
              <input
                id="street"
                type="text"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.street}
                onChange={(e) => updateField("street", e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city">
                City
                <span className="ml-1 text-destructive">*</span>
              </label>
              <input
                id="city"
                type="text"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="San Francisco"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border bg-background text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                checked={form.newsletter}
                onChange={(e) => updateField("newsletter", e.target.checked)}
              />
              <span>
                <span className="font-medium">Product newsletter</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Get occasional updates about new features and improvements.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border bg-background text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                checked={form.updates}
                onChange={(e) => updateField("updates", e.target.checked)}
              />
              <span>
                <span className="font-medium">Security & account updates</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Critical updates about your account and security.
                </span>
              </span>
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Here&apos;s a quick summary of what you&apos;ve entered. You can
              go back to any step to make changes before submitting.
            </p>
            <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Basic details
                </p>
                <p className="mt-1">
                  {form.name || (
                    <span className="text-muted-foreground">Name missing</span>
                  )}
                </p>
                <p className="text-muted-foreground">
                  {form.email || "Email missing"}
                </p>
                {form.age && (
                  <p className="text-muted-foreground">
                    Age:{" "}
                    <span className="font-medium text-foreground">
                      {form.age}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Address
                </p>
                <p className="mt-1">
                  {form.street || (
                    <span className="text-muted-foreground">
                      Street missing
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground">
                  {form.city || (
                    <span className="text-muted-foreground">City missing</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Preferences
                </p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>
                    Newsletter:{" "}
                    <span className="font-medium text-foreground">
                      {form.newsletter ? "Yes" : "No"}
                    </span>
                  </li>
                  <li>
                    Security updates:{" "}
                    <span className="font-medium text-foreground">
                      {form.updates ? "Yes" : "No"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Steps + progress */}
      <div className="relative flex items-center justify-between">
        {/* Progress track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full w-full bg-primary transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translateX})` }}
            />
          </div>
        </div>

        {/* Step indicators */}
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const n = i + 1;
          const completed = n < step || submitted;
          const active = n === step && !submitted;

          return (
            <button
              key={n}
              type="button"
              onClick={() => {
                if (submitted) return;
                setStep(n);
                setTouchedStep(false);
              }}
              className={cn(
                "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                completed &&
                  "border-primary bg-primary text-primary-foreground shadow-sm",
                active &&
                  "border-primary bg-background text-primary ring-2 ring-primary/30",
                !completed &&
                  !active &&
                  "border-muted-foreground/30 bg-background text-muted-foreground",
              )}
            >
              {completed ? "✓" : n}
            </button>
          );
        })}
      </div>

      {/* Card with step content */}
      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step {submitted ? TOTAL_STEPS : step} of {TOTAL_STEPS}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              {submitted ? "All done" : stepTitles[step - 1]}
            </h2>
          </div>
        </div>
        {!submitted && (
          <p className="text-sm text-muted-foreground">
            {stepDescriptions[step - 1]}
          </p>
        )}

        <div>{renderStep()}</div>

        {showError && !submitted && (
          <p className="text-xs font-medium text-destructive">
            Please fill out the required fields on this step before continuing.
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || submitted}
        >
          Back
        </Button>

        {!submitted && step < TOTAL_STEPS && (
          <Button onClick={handleNext} disabled={!canGoNext}>
            Next
          </Button>
        )}

        {!submitted && step === TOTAL_STEPS && (
          <Button onClick={handleSubmit} disabled={!requiredFieldsValid}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
