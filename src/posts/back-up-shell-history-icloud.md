---
id: "post/11"
title: "Backing up your shell history to iCloud"
date: 2022-01-03 15:15:00
tags:
- zsh
- icloud
- launchd
---

<!-- Excerpt Start -->
Since I integrated [fzf][1] into my workflow almost four years back, I make use of my shell history quite heavily. Binding `Ctrl+R` to fuzzy search using fzf has been a game changer for me.

Being able to quickly search through my shell history allows me to focus on the task at hand instead of remembering or noting down the commands I ran to do something. Given my dependence on shell history, I figured it was a good idea to back it up to iCloud periodically.
<!-- Excerpt End -->

Let's look at the command we want to run first. Please note that it uses absolute paths rather than relative paths.
```shell
#!/usr/bin/env bash
cp /Users/manojkarthick/.zsh_history /Users/manojkarthick/Library/Mobile\ Documents/com~apple~CloudDocs/backups/
```
All Macs that have iCloud enabled use, the `Library/Mobile\ Documents/com~apple~CloudDocs/` folder to sync files from iCloud to your local disk. I created a folder `backup` under that directory to store my shell history.

The next part is to figure out how to run the command periodically. On a Mac, [Launchd][2] is the recommended solution rather than cron.

Launchd has additional niceties such as running missed tasks — for example, when logged out or when the machine is shut down — are run when you login the next time while collapsing the failed runs. Launchd has two type of jobs — Agents and Daemon — for our usecase, we need to use a User Agent. I would highly recommend checking out [this fantastic website][3] for more details on launchd and the various configuration options available.

Launchd uses XML to specify the configuration. The snippet below configures our copy job:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>launched.local.shell-history</string>
	<key>ProgramArguments</key>
	<array>
		<string>/bin/bash</string>
		<string>/Users/manojkarthick/jobs/copy-shell-history.sh</string>
	</array>
	<key>StartInterval</key>
	<integer>300</integer>
	<key>RunAtLoad</key>
	<true/>
</dict>
</plist>
```

Let's look at the various parameters to understand how it works -
* `Label` is the unique name for the application
* `ProgramArguments` is an array that specifies the command to run. In our case, we want to run the `copy-shell-history.sh` script.
* `StartInterval` specifies how often we want to run the agent. In our case, we want it to run every 300 seconds (5 minutes).
* `RunAtLoad` is used to start the job as soon as it has been loaded. For agents this means execution at login.

Now, let's copy the launchd config and load the agent. It's convention to use [reverse domain name notation][4] for the agents - I like to use the `launched.local` prefix for my jobs.
```shell
cp </path/to/xml/file> ~/Library/LaunchAgents/launched.local.shell-history
launchctl load ~/Library/LaunchAgents/launched.local.shell-history
```

To test if the agent is working as expected, let's run it once. Using the `launchctl start` command will run the application once irrespective of the execution conditions. Once the job is completed, you should see the `.zsh_history` file in your iCloud folder on Finder.
```shell
launchctl start ~/Library/LaunchAgents/launched.local.shell-history
```

If you're interested in a GUI Application to configure launchd daemons and agents, I've heard good things about [LaunchControl][5]. I haven't used it personally since my needs are pretty simple.

Cheers!

[1]: https://github.com/junegunn/fzf "fzf"
[2]: https://support.apple.com/en-ca/guide/terminal/apdc6c1077b-5d5d-4d35-9c19-60f2397b2369/mac "launchd"
[3]: https://www.launchd.info/ "launchd.info"
[4]: https://en.wikipedia.org/wiki/Reverse_domain_name_notation "Reverse domain name notation"
[5]: https://www.soma-zone.com/LaunchControl/ "LaunchControl"
