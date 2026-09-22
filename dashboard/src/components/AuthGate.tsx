"use client";

import { useEffect, useState } from "react";
import { ensureFirstRunSeed } from "@/lib/firstRun";
import { runGmailAutoImport, type GmailImportSummary } from "@/lib/gmailAutoImport";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [importSummary, setImportSummary] = useState<GmailImportSummary | null>(null);

  useEffect(() => {
    ensureFirstRunSeed();
    setReady(true);
    runGmailAutoImport()
      .then((summary) => {
        if (summary && (summary.imported > 0 || summary.needsManualEntry > 0 || summary.error)) {
          setImportSummary(summary);
        }
      })
      .catch(() => {});
  }, []);

  if (!ready) return null;

  return (
    <>
      {importSummary && (
        <div className="no-print flex items-center justify-between gap-3 bg-brand-50 px-4 py-2 text-sm text-brand-800">
          <span>
            {importSummary.error
              ? `Gmail auto-import couldn't run: ${importSummary.error}`
              : [
                  importSummary.imported > 0 ? `${importSummary.imported} new order${importSummary.imported === 1 ? "" : "s"} auto-imported from email.` : null,
                  importSummary.needsManualEntry > 0
                    ? `${importSummary.needsManualEntry} email${importSummary.needsManualEntry === 1 ? "" : "s"} needs manual entry — see Reminders.`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
          </span>
          <button onClick={() => setImportSummary(null)} className="shrink-0 text-brand-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}
      {children}
    </>
  );
}
