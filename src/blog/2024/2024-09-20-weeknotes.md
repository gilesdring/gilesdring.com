---
title: Weeknotes
tags:
    - weeknotes
categories:
    - weeknotes
    - data science
    - dns
description: |
    Project kickoffs, progress and some honest-to-goodness data science.
    Also, multiple examples DNS being to blame for stuff and
---

This week, the Bradford 2025 data site work kicked off.
An excellent meeting where we collaboratively agreed on the areas of focus.
We're already expanding on the Leeds 2023 work, so I'm hopeful we'll be building
some solid culture infrastructure for the team, and legacy for the broader region.

The other project is progressing well too, although is still under a communications
blackout, hence me not mentioning what it is explicitly!
I've had cause to use some actual data science techniques in building an exciting
bit of data infrastructure. Firstly, I'm matching very large datasets
(several million rows in the reference), and this was slowing down.
Chucking this into DuckDB rather than processing with PETL or Pandas totally sped
this process up.
Right tool for the job.
As an added bonus, the DuckDB bindings for Python has a `.df()` method which returns the
result set as a Pandas dataframe. Winner!
I've also used some fuzzy matching using `thefuzz` to identify spelling mistakes in the
source dataset and enhance matching.
Next up will be starting to try to identify personal names in the source data so that I
can separate organisations from individuals, and handle them separately.
I've identified [Named-entity recognition (NER)](https://en.wikipedia.org/wiki/Named-entity_recognition)
as the means to do this, and early experiments using the NLTK NER modules is looking
promising. Quite a lot of tuning to be done here.
Finally, I'm going to extend the simple DuckDB SQL matching to take account of fuzzy matches
between the source and reference sets.

In other work, I spent quite a lot of time on network fixing. One of my clients, for whom
I've set up a Sentinel license server running on a laptop accessed via a VPN, got a
new router, so I had to open up the VPN ports again. Annoyingly I hadn't written down
exactly what I did, so this took a bit longer to work out that the port mapping (51820/udp)
shouldn't be limited! Anyway sorted now.
Another client had a major DNS failure when one of their suppliers decided to turn off a cPanel
server that they had been using, and no longer needed. Unfortunately, their main domain was
associated with this service, and when it went away, everything broke. Badly.
That took a couple of hours to unpick and get back on the road to recovery.
And for the hat-trick, a data microsite that OI had created had it's DNS records removed,
so stopped working.
Thankfully, I was able to direct them to fix it fairly quickly, and managed to find the
original email trail from two years ago.

All of this left me thinking that for many small (and not-so-small) businesses this network
configuration was something close to magic. I have begun work on a workbook, focussed on small
businesses, which collects important data about the critical infrastructure that keeps their
website, email and other important services up-and-running. It would encourage the business
owners to review this data frequently so that (for example) credit cards don't run out and
lead to a break in service. Furthermore it would contain advice about practical matters,
such as email addresses to use a primary contact for critical accounts to avoid being locked
out in the event something goes wrong.
