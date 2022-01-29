---
id: "post/12"
title: "Hotkey to save currently playing Spotify song using Hammerspoon"
date: 2022-01-29 13:45:00
tags:
- spotify
- hammerspoon
- automation
---

<!-- Excerpt Start -->
The [Discover weekly][6] playlist is one of my favorite ways to explore new music on Spotify. If I find a song I like, I want to save the song to my library but I don't want to switch to the Spotify app to do so. I tend to listen to the playlist when I'm programming and having to switch to the app to save the song breaks my flow state. 

The solution was to build a global hotkey to save the song and that's when I discovered [Hammerspoon][1]. It's an automation framework for macOS that provides a Lua scripting environment and extensions to interact with the operating system and few common applications.

<table class="responsive">
  <tr>
    <td width=395><img src="/img/hammerspoon.png" class="responsive" alt="Hammerspoon"/></td>
    <td width=5>+</td>
    <td width=395><img src="/img/spotify.png" class="responsive" width=195 alt="Spotify"/></td>
  </tr>
</table>

<!-- Excerpt End -->

I would highly recommend checking out their [Getting Started guide][3] to get a feel of the API and some sample use cases. If you're unfamiliar with Lua, check out the [Learn X in Y minutes][4] tutorial for a quick introduction.

If you had a chance to look at the Hammerspoon documentation, you might've seen that they already provide extensions to interact with Spotify but unfortunately it doesn't have a method to save the currently playing song.

So, let's get started with building our function instead!

Hammerspoon stores it's configuration at `$HOME/.hammerspoon/init.lua`. This is the piece of code that configures the hotkey:

```lua
-- save/remove from library currently playing song on spotify
hs.hotkey.bind({"cmd", "alt", "ctrl"}, "l", function()
	local app = hs.application.find("com.spotify.client")
	hs.eventtap.keyStroke({"option", "shift"}, "b", app)
end)
```

That's all we need! Pretty neat, right?

Let's try to understand how this works. The `hs.hotkey.bind` function takes three parameters, a set of modifier keys, a regular key and an anonymous function. The anonymous function describes what we want to do when the combination (`⌘ + ⌥ + ⌃ + l` in my case) is pressed.

The function finds the spotify app from the list of available applications using the `hs.application.find` method and passes the `⌥ + ⇧ + b` keyboard shortcut to the app. Here lies the magic: the `hs.eventtap.keyStroke` method can pass key strokes to an application without having to switch focus to the app!

Whenever this hotkey is pressed, the currently playing song will be saved to your Spotify library (under the liked songs playlist). Do note that if the song is already saved, it will be removed from the library.

One of the challenges was finding the keyboard shortcut to save the song. Spotify has chosen to leave the keyboard shortcut undocumented. I brought this up in Hammerspoon's [github issue][5] for Spotify save support and some fine folks (thanks @latenitefilms and @drn!) helped me put it all together.

Hope you found this useful. Stay tuned for more Hammerspoon related content!

[1]: https://www.hammerspoon.org/
[2]: https://github.com/Hammerspoon/hammerspoon/releases/latest
[3]: https://www.hammerspoon.org/go/
[4]: https://learnxinyminutes.com/docs/lua/
[5]: https://github.com/Hammerspoon/hammerspoon/issues/2010
[6]: https://www.spotify.com/us/discoverweekly/
