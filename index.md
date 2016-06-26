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

Here is a small selection of personal projects.

{% for project in site.projects %}
[{{ project.title }}]({{ project.url }}) -- {{ project.excerpt | strip_html}}
{% endfor %}
