export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join("");
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

export function getInitials(name: string | null | undefined): string {
    if (!name) return "";
    return name.split("").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}