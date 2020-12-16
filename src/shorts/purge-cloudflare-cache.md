---
title:  "Techthorpe Mini 03 - Purging your Cloudflare cache"
date: 2017-05-12
tags:
 - python
---

<!-- Excerpt Start -->
Do you use Cloudflare as your CDN? Cloudflare is great (aside from the recent memory leak issue, if you want to know more about the issue click [here](https://blog.cloudflare.com/incident-report-on-memory-leak-caused-by-cloudflare-parser-bug/)). Then you must know that Cloudflare caches your website's static content and you need to purge your cache if you change any of your webpages or if you upload a new page.

If you are to use the Cloudflare site to cleanup the cache, you would browse to the Cloudflare site, login with your credentials, click on the cache page, select one of the purge cache options and then your cache is cleared and Cloudflare loads it again...(Sigh!)

I've found this XKCD Comic so true when automating things. In this Mini, we won't be doing any complex automation. Don't worry :D

![Automation XKCD](/img/automation.png)
<!-- Excerpt End -->

So, the first thing I did after setting up my cloudflare website was to write a script to purge the cache programmatically. It's one of THE most used options and frankly it the only functionality I use regularly on Cloudflare. In this Techthorpe Mini, we will look at how to purge our Cloudflare cache using Python3.

```python
import requests

headers = {
    'X-Auth-Email': 'email@example.com',
    'X-Auth-Key': 'your-api-key',
    'Content-Type': 'application/json',
}

data = '{"purge_everything":true}'

response = requests.delete('https://api.cloudflare.com/client/v4/zones/zone-identifier' +
                '/purge_cache', headers=headers, data=data)
print(response)
```

This is a super simple script. But before you can use it you need to do two things.

1. Get your API Key from Cloudflare.
2. Get the Zone ID of your site.

On your account page, under the overview section under domain summary you will see your Zone ID. Below the Zone ID, there will be a link 'Get your API Key' which on clicking will take you to your Subscriptions page. Under the API Key section on the page, click on View API Key next to the Global API Key option and note it down. Do not share the API key to anyone under any circumstances.

In the above script, fill in your actual email, API key and Zone ID. When you execute this script you will get a Response 200 which means your purge request was successful. If you get any other response code check your inputs and execute again. If the problem persists browse to Cloudflare account portal to see what's wrong.


Hope you found it useful!
