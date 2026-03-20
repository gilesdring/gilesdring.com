---
title: Weeknotes
tags:
    - weeknotes
categories:
    - weeknotes
    - culture
    - web-dev
    - prototypes
description: |
    I start weeknoting (again!), do some bikeshedding and come back from holiday to a range of projects.
---

I've decided to start writing weeknotes for myself.
In part to keep track of _all the stuff_ but also to ensure I keep in the habit of writing.
As with all projects, this requires a degree of
[bikeshedding](https://en.wiktionary.org/wiki/bikeshedding#English) and / or
[yak shaving](https://en.wiktionary.org/wiki/yak_shaving#English).

Given one of the hardest things to do in tech is deciding on the name of things,
my first task is coming up with distinct names for each of the what I assume will be almost endless collection of blog posts.
I briefly considered naming them like Friends episodes,
but this could quite quickly descend into farce.
I decided on simply the year and [week number](https://www.calendar-365.com/week-number.html),
according to the ISO standard of weeks starting on Monday.
I note from the link above that Monday is Labor Day in the US,
which I think has something to do with wearing white shoes.

This week has been mostly return from holiday and getting my head round
a couple of culture-related projects that I'm involved in as a freelancer with [Open Innovations](https://open-innovations.org/).
The first is the Bradford 2025 City of Culture,
for which I wrote an [Open Data Strategy](https://open-innovations.github.io/bradford-2025/strategy/) just before my break.
I've agreed the scope of the next piece of work to start delivering on it.
It builds on the [LEEDS 2023 Data Microsite](https://data.leeds2023.co.uk/) that I built with OI team.
The other project is along the same lines, but much broader, and earlier in the discovery phase.
I consequently spent a fair amount of time reading what I could lay my hands on
and hypothesising about what we might build.
Very happy to be wrong about assumptions at this stage!

Away from Open Innovations,
I've finally broken the back of a website upgrade for the
[Hebden Bridge Picture House](https://hebdenbridgepicturehouse.co.uk) which should enable me to upgrade from (out of support) PHP 7.3.
It turns out that some changes in the Textpattern software have invalidated the way I built the site.
The Textpattern community were very helpful,
responding to [a topic I posted in the Textpattern forums](https://forum.textpattern.com/viewtopic.php?id=52408) with some really useful suggestions.

I've also been refreshing a prototype site I'm building for [social value consultants CHY Consultancy](https://www.chyconsultancy.com/).
I've been mindful of recent discussions about Javascript framework bloat, and I agree wholeheartedly with this.
I really like static site generators, and tend to use [Lume](https://lume.land/) as my weapon of choice.
In fact, this very post is written in it.
There are times that having a framework that can be easily extended to do more powerful client-side stuff is useful,
but I really don't like the likes of React, Angular, et al.
I've long been a fan of [Svelte](https://svelte.dev/) for componentised client-side code, particularly where the need is a bit more heavyweight.
The prototype uses [Sveltekit](https://kit.svelte.dev/) which builds on this beautifully.
Given a combination of setting [`prerender`, `csr` and `ssr` options](https://kit.svelte.dev/docs/page-options) for pages,
it's even possible to [generate a static site](https://kit.svelte.dev/docs/adapter-static).
This can be turned off for any pages which need live server-side rendering (e.g. dynamic pages based on routing parameters),
or client-side processing (e.g. highly interactive islands on a web page).
Anyway, there's been tinkering on making this perform well.

Stuff added to the list to do or look at next week:

- [Storybook](https://storybook.js.org/) frontend UI workshop.
- Draft a blog post about the Generative AI inspired by a very long and rambling pub chat that I had with a friend last Sunday night.
- Draft a blog post about using SvelteKit to make efficient websites.

Finally, and in the spirit of full disclosure,
I have just spent 20 minutes automating appending the week of the year to the post title
as a [Lume preprocessor](https://lume.land/docs/core/processors/).
It uses the pretty handy [`date-fns`](https://date-fns.org/) library, with the format string `RRRR-'W'II`.
This is next-level yak shaving.
