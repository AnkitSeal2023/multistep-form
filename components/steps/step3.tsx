import type React from "react";
import type { FormState } from "../progressBar";

type Step3Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function Step3({ form, setForm }: Step3Props) {
  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border bg-background text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          checked={form.newsletter}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, newsletter: e.target.checked }))
          }
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, updates: e.target.checked }))
          }
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
}
