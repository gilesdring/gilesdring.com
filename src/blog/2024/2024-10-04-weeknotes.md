---
title: Weeknotes
tags:
    - weeknotes
categories:
    - weeknotes
description: |
    Scope wobbles, massive progress and data masking techniques.
---

Short one this week, as it's been a heck of a time for various reasons.

Most of the week has been consumed with some rocks thrown into a project about
the scope of an initial phase. Let's just say that managing expectations and
getting feedback early is very important! It's a pity, as the work is progressing
well overall. Consultancy is hard!

Other projects have been more productive. The Bradford 2025 data publishing
programme attained automated extract from the first source system. Quite a
milestone, which allows / requires getting the data governance bit sorted out.
To this end, I've documented the process and drafted some risks to be discussed
with the risk owner. This should lead to the data being released, with any luck.
We could, by the end of next week, have an initial site sorted out.
Watch this space.

One of the steps on the data release was the handling of small numbers in summaries
with the risk of personal identification. Often small numbers are surpressesd in
data released to avoid this eventuality, but there are other techniques.
[ONS has published information on disclosure control][ONS_SMALL], but in our case,
a simpler technique would suffice. <span id="small-value-masker">I built a small value masker which bisects the
dataset based on a clip level, then replaces the numbers below the clip with the
average of the small numbers.</span> The thinking here is that the overall distribution
and totals should be similar in this case. I'll do some more detailed analysis of
this next week, but for now, it'll do!

[ONS_SMALL]: https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/methodologies/comparisonofposttabularstatisticaldisclosurecontrolmethods
