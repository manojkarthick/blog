---
id: "post/3"
title:  "Command Line URL Shortener in Golang - Part 2"
date: 2016-08-30
tags:
 - golang
 - tutorials
 - cli
---

<!-- Excerpt Start -->
In this part, we will create a URL Shortener consuming the **is.gd** API. This API returns a response in _**JSON**_ Format.
<!-- Excerpt End -->

![is.gd](/img/isgd.jpg)

In the previous post, we looked at how to create a Command line URL shortener by consuming the tinyURL API.
If you missed it, check it out [here](/2016/08/26/A-command-line-URL-Shortener-in-Golang.html).

So, we will be learning:

 - How to consume JSON APIs in Golang
 - How to parse JSON in Golang

First we need to create a struct that represents the
JSON format that we get from the API.



**API Endpoint**: https://is.gd/create.php?format=json&url=<url_to_be_shortened>

JSON Format returned:

```json
{ "shorturl": "https://is.gd/MOgh5q" }
```

I recommend using [JSON to Go](https://mholt.github.io/json-to-go/) to convert your JSON to corresponding Go struct automatically.


```go
//This is the JSON format we get from is.gd
type AutoGenerated struct {
	Shorturl string `json:"shorturl"`
}
```
We create a New Request here using the `http.NewRequest` method. Alternatively, you can also use the `http.Get` method.
The method takes three arguments, type of request, URL and one argument of type `io.Reader`.

```go
request, err := http.NewRequest("GET", getReqURL, nil)
	if err != nil {
		log.Fatal("NewRequest: ", err)
		return
	}

	client := &http.Client{}

	response, err := client.Do(request)
	if err != nil {
		log.Fatal("Do: ", err)
		return
	}
```

Initialize a HTTP Client and make the GET call. Store the response in the variable `response`. Exit if there was any error.

Use `defer response.Body.Close()` to close the stream once we are done reading the response.

```go
err := json.NewDecoder(response.Body).Decode(&result)
```

Use the `json.NewDecoder` method to decode the response and store in the variable `result` using the `Decode` method.

NOTE: All exported methods must begin with a Capital letter. Also, Don't forget to import the `encoding/json` package.

```go
fmt.Println("Shortened URL is: ", result.Shorturl)
```
Then Print the Shortened URL to the console!

**Full code**:

<script src="https://gist.github.com/manojkarthick/dd907891fa4b1e1fd9ba2d493c620b0a.js"></script>

Happy Coding!

