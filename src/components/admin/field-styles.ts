export const fieldClass =
  "border border-ink/20 bg-transparent px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-dim/60 focus:border-brass focus:outline-none";

export const numberFieldClass =
  fieldClass +
  " [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export const selectTriggerClass =
  "flex w-full items-center justify-between gap-2 border border-ink/20 bg-transparent px-3 py-2.5 text-left font-mono text-sm text-ink focus:border-brass focus:outline-none";

export const labelClass =
  "font-mono text-xs tracking-[0.1em] text-ink-dim uppercase";

export const buttonPrimaryClass =
  "bg-brass px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-ink uppercase transition-opacity hover:opacity-90 disabled:opacity-50";

export const linkMutedClass =
  "border border-ink/20 px-3 py-1.5 font-mono text-xs tracking-[0.05em] text-ink-dim uppercase transition-colors hover:border-brass hover:text-brass";

export const linkDangerClass =
  "border border-wine/40 px-3 py-1.5 font-mono text-xs tracking-[0.05em] text-wine uppercase transition-colors hover:bg-wine hover:text-paper";
