/* eslint-disable @typescript-eslint/no-explicit-any */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const NODE_COLORS = {
  idea: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    accent: "bg-blue-500",
    text: "text-blue-700",
    ring: "ring-blue-400",
    dot: "bg-blue-500",
    light: "bg-blue-100",
    label: "Idea",
  },
  decision: {
    bg: "bg-purple-50",
    border: "border-purple-400",
    accent: "bg-purple-500",
    text: "text-purple-700",
    ring: "ring-purple-400",
    dot: "bg-purple-500",
    light: "bg-purple-100",
    label: "Decision",
  },
  task: {
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    accent: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "ring-emerald-400",
    dot: "bg-emerald-500",
    light: "bg-emerald-100",
    label: "Task",
  },
} as const;
