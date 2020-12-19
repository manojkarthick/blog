---
id: "mini/2"
title: "Mini #2 - Remove spaces in Filenames"
date: 2017-05-05
tags:
  - shell
---

<!-- Excerpt Start -->
Have you ever used a console and got irritated with spaces in your file names? Read on..
<!-- Excerpt End -->

It's time for Mini #2 !

So, have you ever used a console on your machine, be it *NIX or Windows? Then you probably know how much of a PITA it is when file names have spaces in them.

![filename-space-meme](/img/space-in-filename.jpg)

Then it's time to remove those spaces. Let's get rid of spaces. In file names. For ever.

Just execute the following line of code your terminal or console:


For Linux/Unix/macOS users:
```bash
rename 's/ /-/g' /path/to/your/directory/* # Replace spaces with hypens.
```

If you find yourself doing it over and over again, set up a cron job to execute this command :)

Windows users use:
```powershell
cmd /e:on /v:on /c "for %f in ("* *.txt") do (set "n=%~nxf" & set "n=!n: =-!" & ren "%~ff" "!n!" )"
```

Tada!
