import type React from "react";
import type { FormState } from "../progressBar";

type Step1Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function Step1({ form, setForm }: Step1Props) {
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, age: e.target.value }))
          }
          placeholder="Optional"
        />
      </div>
    </div>
  );
}
