---
title: Weeknotes
tags:
    - weeknotes
categories:
    - weeknotes
description: |
    Projects and planning meetings, plus a brief delve into digital marketing.
---

Loads of progress on the Bradford 2025 data publishing project.
I had the first in-person working day with the team on Wednesday,
and we managed to get one of the key datasets extracted and a minimal process working.
This built on the Leeds 2023 data, and I was pleased to dramatically simplify
the state tracking code I wrote for that extract.

This code is needed because the volunteering system does not track when checkpoints
(used to track the onboarding process for volunteers) were achieved.
The Leeds solution (for the same system) was pretty arcane, and meant that the
dataset needed to contain a hashed version of the ID field to match with incoming
data.
The new solution reduces the information stored along with the hash to a list of
checkpoints and dates.
The first step on extracting the data from the system is to establish if any of the
hashes have a new checkpoint, and if so append the updates to the list of state dates.
This avoids some unpleasant round-tripping on the data.
Once this is done, the (possibly updated) state data is read and turned into a lookup
returning the states as a dictionary.
This dictionary replaces the hash, meaning that this potentially personal and disclosive
data is removed from the dataset.

The hush-hush project also progressed, and I was able to play back the data work
to the client, with some excellent feedback. We have a pilot organisation workshop
next week, and will hopefully be able to speak more about the project after that.
The data science work that I mentioned in [last week's weeknotes](/blog/2024/weeknotes-2024-W38/)
has progressed, with a fuzzy match of part of the company house data.
Next steps on that is to add in the identification of personal names.

Finally, today, I met with a digital marketer who is working with one of my clients.
He needed some help getting the Google search console linked in to GA-4, which needed
a bit of tinkering and archaeology to work out where their DNS records were managed!
Will be interesting to keep abreast of this work and see how digital marketing data
is linked together.

A few links:

* An excellent [visualisation / flowchart of what is considered personal data from missiggeek on Mastodon](https://freeradical.zone/@missiggeek/113170518046838948)
* A brilliant [article about what ChatGPT is, with analogy to lossy compression](https://web.archive.org/web/20240919122353/https://www.newyorker.com/tech/annals-of-technology/chatgpt-is-a-blurry-jpeg-of-the-web)
* The [H3 hexagonal based coordinate system](https://h3geo.org/) developed by Uber for geospatial analysis.