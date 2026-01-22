"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";
import { stepDescriptions, stepTitles } from "./mockdata";

const TOTAL_STEPS = 4;
const STORAGE_KEY = "multistep-form-progress";
const DEBOUNCE_DELAY = 500; // milliseconds

export type FormState = {
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

const stepTitle = stepTitles;
const stepDescription = stepDescriptions;

const loadFromStorage = (): StoredState | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as StoredState;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef(1);
  const isInitialMount = useRef(true);

  // load from localStorage
  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored) return;

    const raf = requestAnimationFrame(() => {
      setForm(stored.form);
      setStep(stored.step);
      prevStepRef.current = stored.step;
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const progress = (step - 1) / (TOTAL_STEPS - 1);
  const translateX = `-${100 - progress * 100}%`;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (submitted) return;

    if (prevStepRef.current !== step) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      saveToStorage(form, step);
      prevStepRef.current = step;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveToStorage(form, step);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, step, submitted]);

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

  const handleSubmit = async () => {
    setTouchedStep(true);

    if (!requiredFieldsValid) {
      if (!form.name.trim() || !form.email.trim()) {
        setStep(1);
      } else if (!form.street.trim() || !form.city.trim()) {
        setStep(2);
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      setSubmitted(true);
      clearStorage();
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
        return <Step1 form={form} setForm={setForm} />;
      case 2:
        return <Step2 form={form} setForm={setForm} />;
      case 3:
        return <Step3 form={form} setForm={setForm} />;
      case 4:
        return <Step4 form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full w-full bg-primary transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translateX})` }}
            />
          </div>
        </div>

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

      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step {submitted ? TOTAL_STEPS : step} of {TOTAL_STEPS}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              {submitted ? "All done" : stepTitle[step - 1]}
            </h2>
          </div>
        </div>
        {!submitted && (
          <p className="text-sm text-muted-foreground">
            {stepDescription[step - 1]}
          </p>
        )}

        <div>{renderStep()}</div>

        {showError && !submitted && (
          <p className="text-xs font-medium text-destructive">
            Please fill out the required fields on this step before continuing.
          </p>
        )}

        {submitError && (
          <p className="text-xs font-medium text-destructive">{submitError}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || submitted || isSubmitting}
        >
          Back
        </Button>

        {!submitted && step < TOTAL_STEPS && (
          <Button onClick={handleNext} disabled={!canGoNext || isSubmitting}>
            Next
          </Button>
        )}

        {!submitted && step === TOTAL_STEPS && (
          <Button
            onClick={handleSubmit}
            disabled={!requiredFieldsValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}
