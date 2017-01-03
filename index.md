---
layout: default
title: Giles Dring
---

## Blog

<aside id='latestposts' class='sidebar'>
  <ul>
    {% for post in site.posts limit:3 %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
</aside>

Here is my most recent blog post, or browse through the [full archive][BLOG].
My most recent posts are listed <span id='latestpostsposition'></span>.

[BLOG]: /blog/

{% for post in site.posts limit:1 %}
  {% include post_excerpt.html level=3 %}
{% endfor %}


## Projects

Here is a small selection of personal projects.

{% include project_list.html level=3 %}
