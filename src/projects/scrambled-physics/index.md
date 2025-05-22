---

title: Scrambled Physics
categories: []
tags: []
status: publish
type: page
published: true
meta: {}
project_sources: /scrambledphysics/
templateEngine: njk,md
description: |
  I've written a simple physics library in Processing.
  It's called ScrambledPhysics.
---
I've written a simple physics library in [Processing](http://processing.org).
It's called ScrambledPhysics, and you can
[read more about it here]({{ project_sources }}).

<canvas id="ScrambledPhysics" class="sketch"
  data-processing-sources="{{ project_sources }}ScrambledPhysics.pde {{ project_sources }}Example.pde" tabindex="0">
  <p>Your browser does not support the canvas tag.</p>
  <!-- Note: you can put any alternative content here. -->
</canvas>
<noscript>
  <p>JavaScript is required to view the contents of this page.</p>
</noscript>
<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.6/processing.min.js" type="text/javascript"></script>

This demo is based on two files:

* [Example.pde]({{ project_sources }}Example.pde)
* [ScrambledPhysics.pde]({{ project_sources }}ScrambledPhysics.pde)
