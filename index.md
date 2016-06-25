---
layout: page
title: Giles Dring
---

Welcome to my personal site.

## Blog

Here is my most recent blog post. The full archive is on my [blog]()

{% for post in site.posts limit:1 %}
### {{post.title}}
{{ post.excerpt }}
[Read more]({{ post.url }})
{% endfor %}

## Projects

Here is a small selection of the projects that I have worked on in my own time.

* [ScrambledPhysics](http://gilesdring.github.io/scrambledphysics/) 100% Processing Physics engine
