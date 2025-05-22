export const layout = 'layouts/list.vto';

export default function*({ search }) {
    for (const tag of search.values("tags")) {
        const url = `/tag/${tag}/`
        yield {
            url,
            tag,
            tags: ['tag'],
            title: `Tag: ${tag}`,
            searchParams: [tag, 'title'],
        }
    }
    yield {
        url: '/tag/',
        title: 'Tags',
        searchParams: ['tag', 'title'],
    }
}