import type React from "react";
import type { FormState } from "../progressBar";

type Step2Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function Step2({ form, setForm }: Step2Props) {
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, street: e.target.value }))
          }
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, city: e.target.value }))
          }
          placeholder="San Francisco"
        />
      </div>
    </div>
  );
}
