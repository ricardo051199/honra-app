import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineStepState = "completed" | "current" | "pending";

export interface TimelineStep {
  label: string;
  sublabel?: string;
  state: TimelineStepState;
}

// ─── Node ─────────────────────────────────────────────────────────────────────

function TimelineNode({ state }: { state: TimelineStepState }) {
  if (state === "completed") {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-[0_0_0_3px_rgba(22,163,74,0.15)]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0 shadow-[0_0_0_3px_rgba(79,70,229,0.15)]">
        <div className="w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-[var(--muted)] border-2 border-[var(--border)] flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
    </div>
  );
}

function stepLabelClass(state: TimelineStepState): string {
  if (state === "pending") return "text-[var(--muted-foreground)]";
  if (state === "current")  return "text-[var(--primary)]";
  return "text-[var(--foreground)]";
}

// ─── Horizontal (desktop) ─────────────────────────────────────────────────────

function TimelineDesktop({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="hidden md:flex items-start justify-between w-full relative">
      <div className="absolute top-3.5 left-3.5 right-3.5 h-px bg-[var(--border)] z-0" />
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 relative z-10">
          <TimelineNode state={step.state} />
          <div className="text-center max-w-[88px]">
            <p className={`text-[11px] font-semibold leading-tight ${stepLabelClass(step.state)}`}>
              {step.label}
            </p>
            {step.sublabel && (
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{step.sublabel}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Vertical (mobile) ────────────────────────────────────────────────────────

function TimelineMobile({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex md:hidden flex-col">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <TimelineNode state={step.state} />
            {i < steps.length - 1 && (
              <div className={`w-px flex-1 my-1 min-h-[24px] ${step.state === "completed" ? "bg-green-300" : "bg-[var(--border)]"}`} />
            )}
          </div>
          <div className="pb-4">
            <p className={`text-sm font-semibold leading-snug ${stepLabelClass(step.state)}`}>
              {step.label}
            </p>
            {step.sublabel && (
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{step.sublabel}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── OrderTimeline ────────────────────────────────────────────────────────────

interface OrderTimelineProps {
  steps: TimelineStep[];
  title?: string;
  className?: string;
}

export default function OrderTimeline({ steps, title = "Progreso de la orden", className = "" }: OrderTimelineProps) {
  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${className}`}>
      <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-5">
        {title}
      </p>
      <TimelineDesktop steps={steps} />
      <TimelineMobile steps={steps} />
    </div>
  );
}
