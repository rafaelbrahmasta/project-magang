export function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function prismaCode(error: unknown): string | undefined {
    if (typeof error === "object" && error !== null && "code" in error) {
        return String((error as { code: unknown }).code);
    }
    return undefined;
}