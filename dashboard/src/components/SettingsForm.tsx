"use client";

import { useState } from "react";
import type { SettingsMap } from "@/lib/settingsShared";

export function SettingsForm({ initial }: { initial: SettingsMap }) {
  const [values, setValues] = useState<SettingsMap>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key: keyof SettingsMap, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Section title="Floor Charges" description="Applied automatically based on the floor selected on each order.">
        <Grid>
          <Money label="Ground Floor" value={values.floorCharge_Ground} onChange={(v) => set("floorCharge_Ground", v)} disabled />
          <Money label="1st Floor" value={values.floorCharge_1st} onChange={(v) => set("floorCharge_1st", v)} />
          <Money label="2nd Floor" value={values.floorCharge_2nd} onChange={(v) => set("floorCharge_2nd", v)} />
          <Money label="3rd Floor" value={values.floorCharge_3rd} onChange={(v) => set("floorCharge_3rd", v)} />
          <Money label="4th Floor" value={values.floorCharge_4th} onChange={(v) => set("floorCharge_4th", v)} />
          <Money label="5th Floor" value={values.floorCharge_5th} onChange={(v) => set("floorCharge_5th", v)} />
          <Money label="Other Floor" value={values.floorCharge_Other} onChange={(v) => set("floorCharge_Other", v)} />
        </Grid>
      </Section>

      <Section title="Lift Rule" description="How floor charges behave when a lift is available.">
        <Grid>
          <div>
            <label className="label">When Lift Is Available</label>
            <select className="input" value={values.liftFloorChargeRule} onChange={(e) => set("liftFloorChargeRule", e.target.value)}>
              <option value="full">Still apply full floor charge</option>
              <option value="reduced">Reduce floor charge</option>
              <option value="zero">No floor charge (£0)</option>
            </select>
          </div>
          {values.liftFloorChargeRule === "reduced" && (
            <div>
              <label className="label">Reduction Factor (0–1)</label>
              <input type="number" step="0.05" min={0} max={1} className="input" value={values.liftReducedFactor} onChange={(e) => set("liftReducedFactor", e.target.value)} />
              <p className="mt-1 text-xs text-gray-400">0.5 = half price with a lift available.</p>
            </div>
          )}
        </Grid>
      </Section>

      <Section title="Fitting">
        <Grid>
          <Money label="Default Fitting Charge" value={values.fittingDefaultCharge} onChange={(v) => set("fittingDefaultCharge", v)} />
        </Grid>
      </Section>

      <Section
        title="Delivery Date Checker"
        description="Defaults for the standalone Delivery Date Checker tool. A product's own lead time wins, then its vendor's, then this default."
      >
        <Grid>
          <div>
            <label className="label">Default Lead Time (days)</label>
            <input
              type="number"
              min={0}
              className="input"
              value={values.deliveryDefaultLeadTimeDays}
              onChange={(e) => set("deliveryDefaultLeadTimeDays", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Skip Weekends</label>
            <select
              className="input"
              value={values.deliverySkipWeekends}
              onChange={(e) => set("deliverySkipWeekends", e.target.value)}
            >
              <option value="true">Yes — count only weekdays</option>
              <option value="false">No — count every day</option>
            </select>
          </div>
          <div>
            <label className="label">Extra Suggested Dates</label>
            <input
              type="number"
              min={0}
              className="input"
              value={values.deliverySuggestionWindowDays}
              onChange={(e) => set("deliverySuggestionWindowDays", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-400">How many extra dates to suggest after the earliest one.</p>
          </div>
        </Grid>
      </Section>

      <Section title="Commission" description="Default commission rule for new orders (can be overridden per order).">
        <Grid>
          <div>
            <label className="label">Default Type</label>
            <select className="input" value={values.commissionDefaultType} onChange={(e) => set("commissionDefaultType", e.target.value)}>
              <option value="profit">Full profit (sole trader default)</option>
              <option value="fixed">Fixed amount</option>
              <option value="percentage">Percentage of customer total</option>
            </select>
          </div>
          {values.commissionDefaultType !== "profit" && (
            <Money
              label={values.commissionDefaultType === "percentage" ? "Default %" : "Default Amount"}
              value={values.commissionDefaultValue}
              onChange={(v) => set("commissionDefaultValue", v)}
            />
          )}
        </Grid>
      </Section>

      <Section title="Currency">
        <Grid>
          <div>
            <label className="label">Currency Symbol</label>
            <input className="input" value={values.currencySymbol} onChange={(e) => set("currencySymbol", e.target.value)} />
          </div>
          <div>
            <label className="label">Currency Code</label>
            <input className="input" value={values.currencyCode} onChange={(e) => set("currencyCode", e.target.value)} />
          </div>
        </Grid>
      </Section>

      <Section title="Business Settings">
        <Grid>
          <div>
            <label className="label">Business Name</label>
            <input className="input" value={values.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </div>
          <div>
            <label className="label">Order ID Prefix</label>
            <input className="input" value={values.orderPrefix} onChange={(e) => set("orderPrefix", e.target.value)} />
          </div>
          <div>
            <label className="label">Business Phone</label>
            <input className="input" value={values.businessPhone} onChange={(e) => set("businessPhone", e.target.value)} />
          </div>
          <div>
            <label className="label">Business WhatsApp</label>
            <input className="input" value={values.businessWhatsapp} onChange={(e) => set("businessWhatsapp", e.target.value)} />
          </div>
          <div>
            <label className="label">Business Email</label>
            <input className="input" value={values.businessEmail} onChange={(e) => set("businessEmail", e.target.value)} />
          </div>
        </Grid>
      </Section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Settings"}</button>
        {saved && <span className="text-sm text-green-600">Saved.</span>}
      </div>
    </form>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {description && <p className="mb-3 text-xs text-gray-400">{description}</p>}
      <div className={description ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Money({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" step="0.01" className="input" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
