---
layout: layouts/post.njk
title: About Me
templateClass: tmpl-post
eleventyNavigation:
  key: About
  order: 500
---

I'm Manoj Karthick from Vancouver, Canada. I completed my Masters Degree in Computing from Simon Fraser University and currently work as a Data Engineer.

You can find me across the interwebs as @manojkarthick.

Links:
* <a href="https://github.com/manojkarthick" {% if env.isProd %}onclick="return log_click('github')"{% endif %}>Github</a>
* <a href="https://twitter.com/manojkarthick" {% if env.isProd %}onclick="return log_click('twitter')"{% endif %}>Twitter</a>
* <a href="https://in.linkedin.com/in/manojkarthick" {% if env.isProd %}onclick="return log_click('linkedin')"{% endif %}>LinkedIn</a>

<br/>

<div class="github-card" data-github="manojkarthick" data-width="400" data-height="" data-theme="default"></div>
<script src="/js/github-cards.js"></script>

<br/>

### About this Blog

I hope to share my thoughts on technology, programming, data science and publish programming tutorials on this blog.

Built with [11ty](https://www.11ty.dev/) and hosted on [Netlify](https://www.netlify.com/).

This blog is also available as <a href="/feed/feed.xml" {% if env.isProd %}onclick="return log_click('atom feed')"{% endif %}>Atom</a> and <a href="/feed/feed.json" {% if env.isProd %}onclick="return log_click('json feed')"{% endif %}>JSON</a> Feeds.
