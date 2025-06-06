---

title: On Safari, History API and HTML5 Application Cache
categories:
- technology
tags:
- javascript
- jquery
- ios
- coding
- html5
status: publish
type: post
published: true
meta: {}
---
<p><em>On 28 Nov last year, I tweeted about a thorny jQuery Mobile / HTML5 Offline bug.</em></p>
<blockquote class="twitter-tweet" data-lang="en">
  <p lang="en" dir="ltr">Unravelled a thorny jQuery Mobile + Safari + html5 Application Cache + History API bug. Workaround sorted!</p>&mdash; Giles Dring (@gilesdring)
  <a href="https://twitter.com/gilesdring/status/406144073230479360">November 28, 2013</a>
</blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
<p><em>This is probably no great shakes in the grand scheme of things, but the tweet has been left unexplained like some minor homage to Fermat ever since. The full story can now be told. Are you sitting comfortably? Then I'll begin...</em></p><!-- more -->

<p>So I was coding a mobile address book for my business unit at work using jQuery Mobile. I had a view that people would want to use it offline. I'd got the right manifest entries in and had built some lightweight refresh code which would run automatically, or could be manually triggered and the updates seemed to be working smoothly. The final feature to integrate was the dialog which presented the contact details for the person on the chart.</p>

<p>All seemed to be working, apart from occasionally when testing on Mobile Safari <em>odd stuff</em> started happening.  And once it had started, it didn't stop.  The dialog kept leaping back two pages when I closed it. The version on the home screen couldn't close at all. The Firefox version was working perfectly. No amount of Stack Overflow searching showed me the correct incantation to fix this.</p>

<p>Pulling out the big guns, I launched the develop mode on Mobile Safari and began inspecting the heck out of the page on my Mac, eventually zeroing in on the History API. Here's what I found. <code>history.length</code> was never getting any longer. The state was being updated, but was overwriting the previous entry. This was killing the dialog box closure as under jQuery Mobile, it relies on the <code>data-rel='back'</code> directive which uses <code>history.back()</code> to head back to the opening page. Luckily I'd implemented a 'Dismiss' button and inhibited the standard dialog close button.</p>

<p>This suggests a workaround:</p>

<ol>
<li>Remove <code>data-rel='back'</code> from the button anchor</li>
<li>Fix the <code>href</code> to refer to the calling page. This should be being done anyway, as a fallback.</li>
</ol>

<p>I implemented this and it worked! It seems this is a known oddity in Mobile Safari on iOS7 (which also seems to occur on the Mac Safari). There is some clash between History API and the Application Cache functionality, so offline apps don't interact properly with the browser history.</p>

<p>I've since found references to this issue, notably this one, taken from a <a href="http://www.mobilexweb.com/blog/safari-ios7-html5-problems-apis-review">list of Safari iOS7 updates</a>.</p>

<pre><code>UPDATE 19/9: If you are using Application Cache and also
managing states through hash or other technique, the
history object will not keep your navigation history,
therefore history.back() will never work and history.length
stays in 1 forever. (Thanks to 10+ people who reported this
problem!)
</code></pre>
