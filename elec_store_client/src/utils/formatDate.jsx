export function formatDate(dateInput) {
    const date = new Date(dateInput);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return "Just now";                    // < 1 minute
    if (diff < 3600) return `${Math.floor(diff / 60)}m`; // < 1 hour
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`; // < 24 hours

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    ) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }

    // If same year → "Jun 5"
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric"
        });
    }

    // Older → "Jun 5, 2023"
    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
