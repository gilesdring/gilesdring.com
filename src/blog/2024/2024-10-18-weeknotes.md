---
title: Weeknotes
tags:
    - weeknotes
categories:
    - weeknotes
    - private cloud
description: |
    Missed a week, but now back on it. Some very satisfying progress on a design system
    and some data governance. Exciting software development ideas
templateEngine: vto,md
---

So I missed weeknote-ing last week, given everything that was going on, so this will be a bumper edition&hellip;
except that one of the projects is still shrouded in secrecy&hellip;

The Bradford 2025 open data work has been progressing at pace. Lots of work on
data governance processes and
[the design system](https://open-innovations.github.io/bradford-2025/design/).
The basic volunteering data is more or less ready to go, once we get approval to make it open.
We've also had some very productive discussions about the ongoing work, which is likely to
be fairly intense for the next couple of months, then drop down to maintenance.
I'm really enjoying the slightly deeper work around setting up governance, design systems
and skills transfer to the evaluation team.

With this in mind, I've also started a short course on
[Evaluation for Arts, Culture, and Heritage: Principles and Practice](https://www.futurelearn.com/courses/evaluation-for-arts-culture-and-heritage-principles-and-practice)
that's been set up by the Centre for Cultural Value at Leeds University.
I've met a few of the folk from the CCV through Leeds 2023 and Bradford 2025 culture work,
and my initial impressions of the course are very favourable.
It's reinforcing some of the things that I've discussed when talking about culture data,
notably the difficultly of codifying the actual evaluation outcomes, rather than just the
monitoring aspects. My view, which I'm interested to test as the course unfolds,
is that the monitoring data is a useful backdrop to the actual work of evaluation.
If it's doing its job well, the backdrop provides evidence of the impact of
cultural stuff. There is a tendency for overreach of aims: can culture solve all of society's ills?
Should it? More on this in coming weeks!

Back at the monitoring level, I will need to slightly refine my
[data masking technique]({{ '~/blog/2024/2024-10-04-weeknotes.md' |> url }}#small-value-masker),
as I realised during the week that if only one value was below the clip level, the replacement value
of the average would be the same as the original value! Looks like all the highly trained statisticians
at the ONS know what they're doing! On that basis, I'll resort to dropping the raw values if there are
fewer than 3 (?) values.

<div style="display: flex;flex-wrap:wrap;">
<p style="flex-basis:20rem;flex-grow:1;">
One thing I did on the secret project that I can talk about, I reckon, is build a new visualisation
to visualise links between clusters. I've been visualising clusters of
<a href="https://www.gov.uk/government/publications/standard-industrial-classification-of-economic-activities-sic">UK Company SIC codes</a>,
which although not a perfect marker, are at least relatively well documented, and for more traditional
organisations are probably OK. I used a variant of
<a href="https://observablehq.com/@d3/bilevel-edge-bundling">Bilevel Edge Bundling</a>
which ended up being quite a useful visualisation. The server rendering is done as a <a href="https://lume.land/">Lume</a>
component, with some interactivity (highlighting, not updating) added using some minimal Javascript.
Here's what it looked like:
</p>
<img style="margin-inline:auto;flex-basis:20rem;flex-shrink:0;" src="/assets/uploads/bilevel-edge-bundling.png" />
</div>

I've latterly been pondering running my own instances of useful services as a way of decoupling from
cloud services which are increasingly being enshittified and sullied with AI. I've currently got an instance
of [Open Project](https://openproject.org/) running, where I sometimes plan larger bits of work.
I've tinkered with a few other services, but the two which would logically fit next to that are
[FreeIPA](https://www.freeipa.org/) ro manage users and access and
[Forgejo](https://forgejo.org/) to manage software development (this is the software that powers [Codeberg](https://codeberg.org/)).
No firm plans, but I found myself re-researching this and wanted to capture this.

Some while ago I presented the work I did on the [Leeds 2023 data site](https://data.leeds2023.co.uk/).
The organising team has written up a
[blog post about the Visioning an audience data strategy event](https://www.nottingham.ac.uk/clas/departments/culturalmediaandvisualstudies/research/visioning-a-creative-and-cultural-county/blog/blog-posts/visioning-an-audience-data-strategy.aspx), and kindly sent it to me.

Links, in no particular order:

- There was some discussion over on Mastodon about [tldraw infinite canvas component](https://www.tldraw.com/),
  which was being recommended, but appears to have been closed sourced.
  An alternative is the [DGRM editor](https://dgrm.net/). Both look interesting!
- Matt Edgar boosted a
  [blog post post about Stewart Brand's pace layers](https://petafloptimism.com/2024/10/08/wibble-y-wobble-y-pace-y-wace-y/)
  as applied to services. The conversion of infrastructure to OpEx, and the vesting of more and more
  operational stuff in bundles services was an interesting perspective.
- I keep meaning to get into [Kaggle](https://www.kaggle.com/), particularly the competitions.
- I should consider joining a union. [United Tech and Allied Workers (UTAW)](https://utaw.tech/) looks like a good one
- I came across the brilliant [<q>HTML is for People</q> course](https://htmlforpeople.com/) that Blake Watson has created.
  It's a really great introduction which I'm going to try to get the kids to have a look at!
- More from the CCV: this time a
  [project that is aiming to scope out a national Cultural data observatory](https://www.culturalvalue.org.uk/transforming-cultural-sector-data/).

And finally (phew!), I ended up going down a rabbit hole on a quote that someone shared and which rang true for me:

<figure style="border-inline-start: 0.5rem solid var(--color-green);">
<blockquote>
<p>
The Biggest Problem in Communication Is the Illusion That It Has Taken Place
</p>
</blockquote>
<figcaption style="font-size:0.9em;font-style: oblique; margin-inline-start: 3rem;margin-block-start:0.5rem;">
&mdash; <a href="https://quoteinvestigator.com/2014/08/31/illusion/">Find out who Quote Investigator thinks (probably) said this</a>
</figcaption>
</figure>
