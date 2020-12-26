---
id: "mini/5"
title:  "Mini #5 - Move forward/backward by word on Zsh"
date: 2020-12-26 11:00:00
tags:
 - shell
---
<!-- Excerpt Start -->
My current terminal setup uses [iTerm2](https://iterm2.com/) and Zsh. Considering the amount of time I spend on the terminal, I wanted to quickly navigate my current input using a combination of modifier and arrow keys.

While iTerm2 allows you to quickly navigate to the front or back of the current input using `⌘ + ←` or `⌘ + →`, there's no default configuration to move by word.
The requirement was to the map the following keys:

* `⌥ + ←` moves backward by one word
* `⌥ + →` moves forward by one word
<!-- Excerpt End -->

The easiest way I've found to achieve this is using Zsh [bindkeys](https://www.freebsd.org/cgi/man.cgi?query=bindkey&sektion=1&manpath=freebsd-release-ports). Add the following commmands to your `.zshrc` to enable this functionality.

```shell
bindkey -e
bindkey '\e\e[C' forward-word
bindkey '\e\e[D' backward-word
```

Moving across your input by one character at a time can be frustrating. Hopefully this makes your terminal experience better!

PS: If you're still using `Terminal.app` on macOS - Why?
