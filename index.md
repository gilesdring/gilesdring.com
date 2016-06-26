---
layout: page
title: Giles Dring
---

## Blog

Here is my most recent blog post, or browse through the [full archive][BLOG].

[BLOG]: /blog/

{% for post in site.posts limit:1 %}
<html>{% include post_excerpt.html level=3%}</html>
{% endfor %}


## Projects

Here is a small selection of the projects that I have worked on in my own time.

* [ScrambledPhysics](http://gilesdring.github.io/scrambledphysics/) 100% Processing Physics engine
