---
id: "mini/7"
title:  "Mini #7 - Refreshing AWS CodeArtifact credentials for Maven projects"
date: 2021-12-08 06:17:00
tags:
- aws
- maven
---

We started using AWS CodeArtifact recently at $work for storing internal maven packages. To pull dependencies from CodeArtifact, we need to use an authentication token that expires in 12 hours by default.

Everytime the token expires, we need to obtain a new temporary token and update the maven settings file, `~/.m2/settings.xml`. This gets annoying pretty fast.

Thankfully, there's an IntelliJ IDEA plugin, helpfully called ["AWS CodeArtifact + Maven"](https://plugins.jetbrains.com/plugin/16777-aws-codeartifact--maven) accepts your maven configuration and uses your AWS Credentials to refresh the token.

After adding your maven configuration, you can refresh your token anytime using `Tools > Generate AWS CodeArtifact Credentials for Maven` from the menu.

![AWS CodeArtifact + Maven plugin](/img/codeartifact-maven.png)

This handy plugin has definitely made using CodeArtifact for maven projects much more bearable! Give it a try.

