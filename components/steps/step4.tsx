import type { FormState } from "../progressBar";

export default function Step4({ form }: { form: FormState }) {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted-foreground">
        Here&rsquo;s a quick summary of what you&rsquo;ve entered. You can go
        back to any step to make changes before submitting.
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
              <span className="font-medium text-foreground">{form.age}</span>
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Address
          </p>
          <p className="mt-1">
            {form.street || (
              <span className="text-muted-foreground">Street missing</span>
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
}
