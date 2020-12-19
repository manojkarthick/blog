---
id: "post/1"
title:  "A Simple Command Line URL Shortener in Golang"
date:   2016-08-26
tags:
 - golang
 - tutorials
 - cli
---

<!-- Excerpt Start -->
I've been learning and experimenting with Golang in the past few days. I wanted to learn Go by developing something I thought would be useful.
<!-- Excerpt End -->

Sharing interesting articles, videos and blog posts with my friends is something I enjoy doing all the time.

URLs these days are getting longer and complex, with APIs and Microservices Architecture all the rage! So, I find myself using URL Shorteners like [TinyURL](http://tinyurl.com) or [Bitly](https://bitly.com) all the time. I find large, clunky links very unusable.

And, thus the Idea was born. A Simple Golang URL Shortener, in the **Command Line**.

![Go gopher](https://blog.golang.org/gopher/gopher.png)

In this tutorial, I will be using the TinyURL API to shorten the long URLs. (I'm just too lazy to visit the website :P)

```go
package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)
```
Let us create a Package named main. The main package is where any Go program starts execution. We will also import the following packages.

1. fmt - For formatting our outputs
2. io -  This the Input/Output package, all reads, writes and copying is done through this package.
3. log - Who doesn't need logging?
4. net/http - We import this package for making the HTTP GET Requests.
5. os - To get the command line arguments that we need.

In the main function, add

```go
fmt.Println("Tiny URL API consumption")

	if len(os.Args) != 2 {
		fmt.Fprintf(os.Stderr, "Usage: %s URL\n", os.Args[0])
		os.Exit(1)
	}
```
The `if` condition checks whether we have the required number of Command Line parameters. `os.Args[0]` refers to the filename and `os.Args[1]` refers to the URL we want to shorten. Those familiar with C should find this right at home.
Every Go program needs a filename to execute.


```go
baseUrl := "http://tinyurl.com/api-create.php?url="
	urlToShorten := os.Args[1]
	getReqUrl := baseUrl + urlToShorten

	response, err := http.Get(getReqUrl)
	if err != nil {
		log.Fatal(err)
	} else {
		defer response.Body.Close()
		_, err := io.Copy(os.Stdout, response.Body)
		if err != nil {
			log.Fatal(err)
		}
	}
```

In the above code block, we construct the URL for the API call by using the variable `baseURL` and the URL to shorten.
We make a HTTP GET Call by using the `http.Get` method. To know more about HTTP Methods, [click here](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)

If the error we get isn't `nil`, then we can proceed. For the Java guys out there, `nil` is similar to `null`.

We are in luck here because the API Call returns a simple text which we output to the Standard Output, i.e. to the Terminal.

And thus, we have in our hands a Simple Command Line URL Shortener built in Go.

To build and run the program,

```shell
$ go build <the_program_name>
$ ./tinyurl_api <your_url>
```

You can also build and run in one go, like:

```shell
$ go run <the_program_name>
```
Here's the full code:
<script src="https://gist.github.com/manojkarthick/0893e83dc9f7d3019b974f7a52cedb14.js"></script>


Example output:

```shell
$ go run https://google.co.in

$ Tiny URL API consumption
  http://tinyurl.com/4yc3v8u

```
Happy Coding!
