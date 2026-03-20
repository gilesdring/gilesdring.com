---
title: Weeknotes
tags:
  - weeknotes
categories:
    - weeknotes
    - culture
    - fediverse
    - web-dev
description: |
  Progress on the cultural-sector projects I'm working on and some R&D, including reviving Open Audience.
---

This week has seen
further clarification on scope for the project that started when I was on holiday,
progress on the contract for the first Bradford 2025 data delivery,
the start of the refresh of [Open Audience](https://openaudience.org)
and a bunch of R&D on optimising SvelteKit.

One thing that I've struggled with a bit on the new project is lack of clarity on the direction of travel.
A colleague (hi, Sarah!) describes this as the North Star, which is great imagery:
I just need to know that I'm heading in broadly the right direction.
I'd raised the idea of writing down some (possibly / probably wrong) hypotheses that we could
use to help set this direction without being too prescriptive.
The same colleague then shared this excellent
[blog post by Ben Holliday about hypothesis driven design](https://benholliday.com/2015/07/16/everything-is-hypothesis-driven-design/)
which pretty well encapsulates my reasons for wanting to write something down
We've (me and Sarah) have been working through some high-level / very broad hypotheses
and realised we can use these to identify some lower-level / more fine-grained hypotheses
which can really shape the work.
I've come to realise this is slightly in tension with the design "double diamond",
which aims for breadth in the first instance.
My response to this is that without
the direction setting, the initial diamond risks effort radiating in all directions from
a point, resulting in a circle. The hypotheses set enough of a direction
to decide what to consider in the first diamond.
I may write this up soon.

My SvelteKit optimisation has resulted in a much better understanding of
how to control what the bundler creates. This is captured in a repo, ready to be
written up. As I was doing this, I was also implementing some of the recommendations
in the Social Value site I'm building. This uses DuckDB-WASM on the client side,
which is excellent... a full OLAP database in a browser? Crikey!
It is, however, quite costly on the network, as it has to download 35MB of Web Assembly code
to start the database engine up.
In a search for an alternative, I've come across [the @oak/acorn framework](https://oakserver.org/acorn)
which will allow me to serve just the JSON. Much better for this use case.
I have, however, discovered that I cannot host this on [Deno Deploy](https://deno.com/deploy),
which is my go-to platform.

The final bit of work is refreshing [Open Audience](https://openaudience.org), a tool
which [Tom Forth](https://tomforth.co.uk/) built using 2011 Census data which
can build a profile of attendees at events based on their postcodes.
This has been buzzing around some of the culture work that I've been involved in for a while
and given we now have 2021 Census data, I thought I'd rebuild at least the dataset.
The data has changed ever so slightly, so it might not be possible to recreate completely,
and I might need to rethink the frontend.
I have some other ideas, including:

- **Open Audience as a service**: An API which provides the profile based on postcodes
- **Open Audience language bindings**: Wrappers in Python / Javascript to allow the data to be used easily in pipelines and web-pages

I did have a look at [Storybook](https://storybook.js.org/), and it looks promising as a way of
documenting web design libraries. I'm also wondering if there's a way of using it as an SSG,
as I suspect it might be overkill for some of the work.

Finally, I've added an [RSS feed for this site](/feed.rss), so you can read my witterings in your favourite feed reader.
I like [NetNewsWire](https://netnewswire.com), FWIW, but there are many others

Plans for next week:

- Refine the culture project hypotheses
- Blog about the SvelteKit optimisations
- Research adding _ActivityPub_ to this site.
  There's a really nice (albeit incomplete!) [series of blog posts by Maho Pacheco](https://maho.dev/2024/02/a-guide-to-implement-activitypub-in-a-static-site-or-any-website/)
  covering how to do this.

Some links I came across

- [Your name in Landsat images](https://landsat.gsfc.nasa.gov/apps/YourNameInLandsat-main/index.html)
- [Signalbox live train locations](https://www.map.signalbox.io/?location=@53.69127,-1.99726,9.922Z). NB Proves to be not that accurate as I tested when I was on an actual train!
- A really nice [blog post about the importance of clear Open Data licensing by Mike Rose and Kieran Wint](https://digital-land.github.io/blog-post/open-data-and-the-planning-data-platform/).

Finally, I really like this pull quote by Ted Chiang, shared in this [toot by James Gleick on Mastodon](https://mas.to/@gleick/113058537194470078):

> The programmer Simon Willison has described the training for large language models as
> ‘money laundering for copyrighted data,’ which I find a useful way to think about the
> appeal of generative-A.I. programs: they let you engage in something like plagiarism,
> but there’s no guilt associated with it because it’s not clear even to you that you’re copying.\
> _Source <https://www.newyorker.com/culture/the-weekend-essay/why-ai-isnt-going-to-make-art>_.
