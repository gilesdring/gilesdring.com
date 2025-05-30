export const layout = "layouts/post_index.vto";
export const title = "Writing";
// export const renderOrder = 1;

export default function* ({ search, paginate }) {
  const posts = search.pages("blog-post", "date=desc");
  const options = {
    url: (n: number) => `/blog/page${n}/`,
    size: 5,
    each: (p) => {
      p.breadcrumbs = [
        { link: '/', title: 'Home' }
      ];
    }
  };

  for (const page of paginate(posts, options)) {
    if (page.url === '/blog/page1/') {
      const index = { ...page };
      index.url = '/blog/'; 
      index.nav = { order: 2 };
      yield index;
    }
    yield page;
  }
}