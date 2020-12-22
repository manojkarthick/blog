---
id: "post/9"
title:  "Git Aliases or: How I Learned to Stop Worrying and Love Git"
date: 2020-12-21 21:00:00
tags:
 - git
 - shell
---

<!-- Excerpt Start -->
While Git is currently the default choice for version control, it's easy to screw up things and the commands can be a little difficult to remember. Over the past five years of working with Git, I've collected a bunch of aliases that I've come to depend on for my daily workflow. In this blog post, I'll be sharing my aliases with the hope that these make your life a little easier.

<img src="/img/git-xkcd.png" width="300" height="200" />
<!-- Excerpt End -->

If you're unaware of Git aliases, they are extensions that allow you to add new commands to git. You can define global git aliases for the current user at `~/.gitconfig`. Before we jump in, do note that I've gathered this collection over time from experimentation, work, blog posts, etc - <ins>in no way do I claim these to be my own<ins>.

#### Basics

The first few aliases are quite straightforward, they are simply shorter notations to existing top level git commands. 

```shell
co = checkout
br = branch
ci = commit
st = status
cm = commit -m
l = log --oneline
```

Now, let's take a look at some of the more interesting ones in detail.

#### Unstage

Have you ever staged a particular change only to decide you no longer want to keep that change? The unstage alias will allow you to quickly remove any file or directory from your staging area.

```shell
unstage = reset HEAD --
```

#### Undo

Ever made a commit and wanted to undo it right away?

```shell
undo = reset --soft HEAD^
```

#### Merged

Do you create feature or bug fix branches for every change and accumulate a bunch of branches over time? This alias lists all your merged branch so that you can quickly prune them if needed.

```shell
bm = branch --merged
```

#### Stash list

If you are like me, you would have created a mountain of stashed changes over time that becomes harder to keep track of. This alias creates a color coded 

```shell
sl = stash list --pretty=format:\"%C(red)%h%C(reset) - %C(dim yellow)(%C(bold magenta)%gd%C(dim yellow))%C(reset) %<(70,trunc)%s %C(gree  n)(%cr) %C(bold blue)<%an>%C(reset)\"

### Sample output
4316259 - (stash@{0}) WIP on master: 336067f Add script for creating kubernetes certificat.. (72 seconds ago) <Manoj Karthick>
```

#### Discard

Completely discard any changes uncommitted changes made (staged, modified or untracked) for a clean slate.

```shell
discard = !git stash save --keep-index --include-untracked && git stash drop
```

Quick note: By default git aliases only allow aliasing a single command. We can get around that restriction by running a shell command instead. By prefixing the value of the alias with `!`, we tell git to execute the command on the current shell. We can also use `&&` to comnbine commands with short-circuiting.


#### Pretty log

Pretty printed log! (With commit message, author, lines modified and files updated for each commit)

```shell
ll = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --numstat


### Sample output
ea1ecdc Add Helper scripts to shut down GCP resources [Manoj Karthick Selva Kumar]
4   0   .gitignore
33  0   tuts/scripts/instances.sh
78  7   tuts/scripts/nlb.sh
```

#### Diff by directory

Ever wondered which directory has the most amount of changes before committing? This alias outputs percentage changes by directory. For example, when generating this blog with a static site generator, I can use this alias to see if all the content I'm interested in were re-generated or not.

```shell
dd = diff --dirstat --find-copies --find-renames --histogram --color
```

I hope you found these aliases useful. I'll update this blog post when more aliases find a home in my gitconfig. 


Also check out [ohshitgit.com](https://ohshitgit.com/) for more tips on fixing your git mistakes.
