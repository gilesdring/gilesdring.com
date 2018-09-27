---
layout: page
title: Scrambled Physics
categories: []
tags: []
status: publish
type: page
published: true
meta: {}
project_sources: /scrambledphysics/
---
I've written a simple physics library in [Processing](http://processing.org).
It's called ScrambledPhysics, and you can
[read more about it here]({{ page.project_sources }}).

<canvas id="ScrambledPhysics" class="sketch"
  data-processing-sources="{{ page.project_sources }}ScrambledPhysics.pde {{ page.project_sources }}Example.pde"
  style="image-rendering: optimizequality ! important;" height="480" width="640" tabindex="0">
  <p>Your browser does not support the canvas tag.</p>
  <!-- Note: you can put any alternative content here. -->
</canvas>
<noscript>
  <p>JavaScript is required to view the contents of this page.</p>
</noscript>
<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.6/processing.min.js" type="text/javascript"></script>


This demo is based on two files:

* [Example.pde]({{ page.project_sources }}Example.pde)
* [ScrambledPhysics.pde]({{ page.project_sources }}ScrambledPhysics.pde)
