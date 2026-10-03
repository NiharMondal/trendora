const QUERY_DEFAULTS: Record<string, string> = {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt:desc",
};

export function buildQueryParams(
    query: Record<string, string>,
    overrideDefaults?: Record<string, string>,
): URLSearchParams {
    const defaults = { ...QUERY_DEFAULTS, ...overrideDefaults };
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value?.trim().length > 0 && value !== defaults[key]) {
            params.append(key, value);
        }
    });

    return params;
}
