---
id: "mini/4"
title:  "Mini #4 - Improving your terminal startup time"
date: 2020-12-21 02:00:00
tags:
 - shell
---

<!-- Excerpt Start -->
Do you use multiple version managers? Is your terminal startup latency taking a hit? Here's some quick tips to make it faster.


**Some background**: I'm currently running on macOS and have been using ZSH as my primary shell long before it became the default on Catalina. As I added more languages to my toolkit, I found that different projects needed different versions of language runtimes based on the project. The solution the community has converged on for this is to use version managers inspired by [rvm](https://github.com/rvm/rvm) and [rbenv](https://github.com/rbenv/rbenv).
<!-- Excerpt End -->

**The Problem**: In my development workflow, I use version managers for Python, Go and Node.js. The downside to using these version managers is that they operate by adding shims to your shell and require that you source the scripts when launching your terminal. These tend to add up and make your shell startup time worser.

The **solution** I've found to overcome this is to lazy load these commands in your `.zshrc` (or `.bash_profile`) depending on your choice of shell. 

```shell
pyenv() {
        eval "$(command pyenv init - zsh --no-rehash)"
        pyenv "$@"
}

goenv() {
        eval "$(command goenv init - zsh)"
        goenv "$@"
}

nvm_lazy() {
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
}
```

What's going on in these scripts:

- When using [pyenv](https://github.com/pyenv/pyenv) or [goenv](https://github.com/syndbg/goenv) for the first time, they get initialized using their respective `init` commands, but subsequent invocations will run directly. 
- In case of [nvm](https://github.com/nvm-sh/nvm), I've wrapped the command inside a `nvm_lazy` function that sources the `nvm.sh` script. Before running any `nvm` commands, I would have to manually execute the `nvm_lazy` function. Subsequent commands will run correctly.
- This approach can be adapted to any version manager that uses the `*-vm` or `*-env` philosophy.

These are simple modifications that'll make sure your shell feels fast and snappy.
