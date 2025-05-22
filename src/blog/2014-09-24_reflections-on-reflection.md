---

title: Reflections on reflection
categories:
- skills
tags:
- back-to-work
- reflect
- review
- daily plan
status: publish
type: post
published: true
meta: {}
---
<p>I missed my appointment with reflection yesterday, by which I mean both "failed to" and "felt the lack of". While I'm not giving myself a hard time over it, it's interesting to note that what was a relatively new practice had quickly become critical to my way of working.</p><!-- more -->

<p>So starting with the reflection part, what did I achieve over the last two days? Much of the time was spent working on the proof of concept, which had working infrastructure and minimal UI by the end of Monday, and a better fleshed out UI by the end of Tuesday, and some preparatory work done on the most complex UI interaction into the early hours of Wednesday. That highlights a key factor of the week so far: burning the midnight oil. This is not a healthy way to work, but the work I'm doing is interesting and I'm learning a lot, so it's very tempting to keep plugging on with 'just the next feature'. Probably need to work on a better backlog management strategy so that I can regain a little control. I hope that by the end of today I'll have a working product which can be reviewed and commented on by people, and that some more sanity will prevail.</p>

<h1 id="technologieslearned">Technologies learned</h1>

<p>Anyway, here are the technologies and patterns that I've used to create the Proof of Concept. This bit is definitely TL;DR, unless you're that way inclined.</p>

<h2 id="backend">Back-end</h2>

<p>The backend is based on <a href="http://nodejs.org"><code>Node.js</code></a> running <a href="http://expressjs.com"><code>Express.js</code></a> and <a href="http://mongoosejs.com"><code>mongoose</code></a>. I'm particularly proud of the module structure I've developed for the components, and I think a fuller write up is in order. In brief, it's possible to define an api segment or a web application within a module (using Express.js apps) and build a server integrating these very cleanly. This should help enforce good design principles and enable reuse.</p>

<h2 id="frontend">Front-end</h2>

<p>The front-end is a single page web application, baesd on <a href="https://angularjs.org/"><code>Angular.js</code></a>. It comprises multiple views, and I've built nice (for which read small, clean) controllers, and made use of services to wrapper RESTful calls to the backend, encapsulate access to localStorage on the browser and provide a timed page redirect. I've also created a tabbed view. My next task is to build directives which will render complex content.</p>

<h2 id="developmenttools">Development tools</h2>

<p>Heavy use of <code>git</code> branching to develop features. Have also dipped into submodules to support reuse. Started using <a href="http://gruntjs.com/"><code>Grunt</code></a> to automate development tasks.</p>

<h1>Re-reflection time</h1>

<p>Now to reflect on the reflection process. I'm beginning to consider the time I spent writing this blog as an opportunity to assess priorities and formulate my thoughts. It's kind of a mindfulness practice which helps organise priorities and remind me to have a plan of attack. Naturally, there will be days when this isn't possible, but I'm now more committed than ever to writing at least <em>some</em> form of daily blog post. Wish me luck!</p>
