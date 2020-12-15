---
title: "Techthorpe Mini 01 - Remove album art"
date: 2017-05-01
layout: layouts/post.njk
tags:
 - shell
 - python
permalink: /minis/{{ page | gen_permalink }}/
---
<!-- Excerpt Start -->
I know it's been a long time since I posted on Techthorpe, but I have been busy the past few months. But now I am back in action!

During my absence, I came up with this idea of posting content that take less than 5 minutes of your time to understand. Things that you might find useful in your day to day life. Simple things that you can automate, applications that come in handy.
<!-- Excerpt End -->

Now that I've explained what Techthorpe Minis are and what you can expect from this series, let's take a look at the first ever Techthorpe Mini :)

Ever downloaded any music from the internet?

Lots of times you get album art like this:

<img src="/img/musicmaza-logo.png" width="220" height="220" />

So, how to get rid of such annoying album arts ?

Seems like there's a simple way to do so. Fortunately there's a python package called **[eyeD3](https://github.com/nicfit/eyeD3)** which comes to your rescue.

 **eyeD3** is available on [PyPI](https://pypi.python.org/pypi) (The Python package index). To download python packages from the PyPI repository, you need to have `pip` installed. pip is the de-facto package management system for Python, which stands for _**pip installs packages**_, a recursive acronym.

If you have Python 2 >=2.7.9 or Python 3 >=3.4 installed from python.org, you will already have pip installed. If not, please check out this [link](https://pip.pypa.io/en/stable/installing/) for steps to install pip on your machine.

To install eyeD3 on your machine, just type:
```bash
sudo pip install eyeD3 # For Linux/Unix users

pip install eyeD3 # Windows users, open the command prompt as administrator to give pip required privileges.
```

Browse to the actual directory which contains the files whose album art you want to remove. Now that you have eyeD3 installed, use the following line of code to remove the album art (actually, any embedded images within files present in those directories)

Assuming all your music files are in the .mp3 format, you can use:
```bash
cd /the/path/to/your/directory/

eyeD3 --remove--images */*.mp3
```

If you have music tracks with any other format, replace `.mp3` with the respective format. To remove embedded images in all files (including mp3's) just replace `*.mp3` with just *.


Cheers!
