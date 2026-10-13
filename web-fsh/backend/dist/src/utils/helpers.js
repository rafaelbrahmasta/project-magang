export function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
export function prismaCode(error) {
    if (typeof error === "object" && error !== null && "code" in error) {
        return String(error.code);
    }
    return undefined;
}
//# sourceMappingURL=helpers.js.map