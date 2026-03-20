import { format as formatDate } from 'npm:date-fns@3.6.0';

export function weeknoteProcessor(pages) {
    return pages.forEach((page) => {
        if (!page.data.categories?.includes('weeknotes')) return;
        // RRRR == year for the purposes of week, II == Week of year
        const weeknoteId = formatDate(page.data.date, "RRRR-'W'II");
        page.data.weeknoteId = weeknoteId;
        page.data.title = `${page.data.title} ${weeknoteId}`;
        page.data.url = page.data.url.replace(/\/$/, `-${weeknoteId}/`);
    });
};