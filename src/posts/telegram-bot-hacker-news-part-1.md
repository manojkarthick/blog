---
id: "post/6"
title:  "Telegram Bot for Hacker News in Python - Part 1"
date:   2017-05-11
tags:
  - python
  - tutorials
---

According to Wikipedia, a chatbot is a computer program which conducts a conversation via auditory or textual methods. [1]

<!-- Excerpt Start -->
The Telegram instant messaging app is known for it's wide selection of chat bots ranging from bots to download videos from Youtube to ones which can post a gist on Github. In this particular tutorial we will create a Telegram Bot which will display information from Hacker News. Hacker News is a very popular forum/social news website focusing on technology, science, software engineering and entreprenuership. I am an avid reader of Hacker News and I wanted to create a Telegram bot for getting the latest/top feed from the Hacker News site.
<!-- Excerpt End -->

<img src="https://apifriends.com/wp-content/uploads/2018/08/hacker-news.jpg" class="responsive" alt="Hacker news logo"/>


Prerequisites:
* A working installation of Python3.
* Basic knowledge of Python and HTTP Requests.

We will be using Python3 to create this bot and use the Hacker news API for getting the feed and the Telegram API to register our bot. We will use Flask to run our bot and deploy it on PythonAnywhere.

The sections available on HN are New, Top, Best Posts, Show HN, Ask HN, Comments and Jobs. In our bot we will be focusing on the New, Top, Best, Show HN and Jobs sections.

First let us take a look at the HN API. The Hacker news API endpoint for the new (latest) stories is: [https://hacker-news.firebaseio.com/v0/newstories.json](https://hacker-news.firebaseio.com/v0/newstories.json). Similarly, the other end points are [https://hacker-news.firebaseio.com/v0/beststories.json](https://hacker-news.firebaseio.com/v0/beststories.json) for the Best stories, and so on.

The response from any of these endpoints is a collection of IDs representing posts on HN, also known as stories, which look something like this:
```json
[14331623,14331601,14331592,14331590,14331586,14331360,.... ]
```

In our bot, we will show the top 5 stories in either of the sections but our code will be capable of displaying any number of stories depending on user input.

```python
import requests

def get_response(story_type):
    url = 'https://hacker-news.firebaseio.com/v0/' + story_type + 'stories.json'
    response = requests.get(url)
    story_id_data = response.json()
```

To make HTTP calls we will use the [requests](http://docs.python-requests.org/en/master/) library for python. Requests is an incredible library which makes it a cakewalk for making HTTP calls (GET,POST,etc) in python. I am assuming you are familiar with HTTP Request methods in this tutorial. In case you are not familiar or your memory is rusty, then do check out this [link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) on the Mozilla Developer Network (MDN). We can install the requests library using pip. Just type `pip install requests` in your terminal. In case you are unfamiliar with pip or do not have pip installed I'd suggest you take a look at this documentation on [python.org](https://packaging.python.org/installing/).

In the above lines, first we import the requests library and declare a method `get_response(story_type)`. Inside this method, we construct the url for making the requests. The variable `story_type` will take a value amongst new,top,best,show,jobs. To make a HTTP GET request we need to use the GET method of the requests library which takes the URL as input. The `response.json()` extracts the information and returns it in the form of a JSON.

We will now define a second method that extracts only the required number of Story IDs from the JSON response we have got earlier.

```python
def get_story_ids(stories, size):
        story_ids_reqd = list()
        for i in range(0, size):
            story_ids_reqd.append(stories[i])
        return story_ids_reqd
```

We initially create an empty list `story_ids_reqd` which will contain the IDs of the stories we need. The argument `size` specifies the number of IDs we want from the response. So, we iterate `size` number of times and append the story IDs to the list and return the list. We could have included this logic in the first method itself, but for separation of concerns and better modularity I have extracted it as a different function. IMHO, I think a function should do exactly one thing and do it well.

Now we need to define a method which will extract the actual story details using the story IDs we have extracted.

```python
def get_story_data(story_ids):
        stories = dict()

        for story_id in story_ids:
            url = 'https://hacker-news.firebaseio.com/v0/item/' + str(story_id) + '.json'
            story_response = requests.get(url)
            story_data = story_response.json()

            story_by = get_field_data(story_data,'by')
            story_title = get_field_data(story_data,'title')
            story_url = get_field_data(story_data,'url')
            story_score = get_field_data(story_data,'score')

            story_data_values = '{};{};{};{}'.format(story_by,story_title,story_url,story_score)
            stories[story_id] = story_data_values

        return stories
```

The information for each of the stories is present at the API endpoint of the form *https://hacker-news.firebaseio.com/v0/item/id.json*. We will define a dictionary named `stories` which will contain the story ID as key and required information about the story as it's value. If you are from a Java background, dictionaries are similar to Maps. We loop through each story ID present in the list of story IDs.
We will again use the `requests.get()` method to get the response from the endpoint and convert it to JSON using the `response.json()` method. We will define a helper function called `get_field_data` which will fetch the field specific information from the JSON response. The information we  associate with each of the stories: Story author, Story title, Story URL and it's score.

```python
def get_field_data(story_data, field):
        if field not in story_data:
            response = ''
        else:
            response = story_data[field]
        return response
```

If the requested field is present in the data, then we return the info. If not, we will return an empty string. JSON in python3 is by default represented as a `dict`. We can access the objects in a dict using the square bracket notation '[]'. For example we have a dict say person, whose key is the Social Security Number and value name, then we can access the name like `person[SSN]` where SSN would be replaced by the actual social security number. To get more information about Python dicts check out this [link](https://developers.google.com/edu/python/dict-files) on Google for Education. For an introduction to the JSON Format, take a look at this [link](https://www.tutorialspoint.com/json/).

Now that we have the helper method ready, let us go back to our `get_story_data()` method.
```python
story_data_values = '{};{};{};{}'.format(story_by,story_title,story_url,story_score)
stories[story_id] = story_data_values
```
In these two lines, we construct a semicolon delimited string which contains the information about the story. We assign this string as the value to `story_id` key of the `stories` dictionary.

The code we have written so far looks like this now: https://git.io/JLLgo

Hope you enjoyed it :)

Now that we have got the required data for each story ID, the next step in would be to compose this into a flask application and deploy it on PythonAnywhere. We will also obtain the Bot secret and Bot key from the Telegram API and register our bot with the botfather. We will see how to do this in the second part of this tutorial.

All hail the Botfather! Happy Coding!


[1] Chatbot - Wikipedia ([https://en.wikipedia.org/wiki/Chatbot](https://en.wikipedia.org/wiki/Chatbot))
