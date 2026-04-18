export function stripHtmlTags(value: string) {
    return value
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function normalizeRichTextContent(content?: string) {
    if (!content) {
        return "";
    }

    return content.replace(/\sclass=("|').*?\1/gi, "").trim();
}

export function enrichArticleContent(content?: string) {
    const headings: Array<{ id: string; label: string; level: "h2" | "h3" }> = [];
    const usedIds = new Set<string>();
    const normalizedContent = normalizeRichTextContent(content);

    const enhancedContent = normalizedContent.replace(
        /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi,
        (_, tag: "h2" | "h3", attrs: string, inner: string) => {
            const label = stripHtmlTags(inner);
            if (!label) {
                return `<${tag}${attrs}>${inner}</${tag}>`;
            }

            let id = slugify(label) || `section-${headings.length + 1}`;
            while (usedIds.has(id)) {
                id = `${id}-${headings.length + 1}`;
            }
            usedIds.add(id);

            headings.push({ id, label, level: tag });
            return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
        }
    );

    return { headings, enhancedContent };
}
