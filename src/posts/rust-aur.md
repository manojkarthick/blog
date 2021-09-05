---
id: "post/10"
title: "Packaging your Rust application for the AUR"
date: 2021-03-21 18:45:00
tags:
- rust
- linux
- AUR
---


<!-- Excerpt Start -->
The AUR (Arch User Repository) is a community driven package repository for Arch Linux. This blog post details how you can quickly release a rust project on the AUR.

<table class="responsive">
  <tr>
    <td><img src="/img/cuddlyferris.png" class="responsive" width=400 alt="Rust Cuddly Ferris"/></td>
    <td><img src="/img/archlinux.png" width=400 class="responsive" alt="Arch Linux"/></td>
  </tr>
</table>


<!-- Excerpt End -->

### Pre-requisites

#### Vagrant

Before we get started, you'll need access to an Arch Linux machine or a VM. My go to for creating virtual machines is [Vagrant](https://www.vagrantup.com/). Follow the instructions on [this](https://www.vagrantup.com/docs/installation) page to install Vagrant. You can use my [Vagrantfile](https://github.com/manojkarthick/boxes/blob/master/archlinux/Vagrantfile) for reference. Make sure to add the folder containing your Rust project's source code to the `synced_folder` list.

#### Dependencies

To install all the dependencies needed for this tutorial, install gcc and base-devel if not already installed
```shell
sudo pacman -Syu
sudo pacman -S gcc base-devel git
```

#### Cargo-aur

AUR requires that every project supply a `PKGBUILD` and `.SRCINFO` file containing build information and metadata about the package respectively. We will be using the [cargo-aur](https://crates.io/crates/cargo-aur) tool that adds a `cargo aur` subcommand to generate this files.
```shell
cargo install cargo-aur
```

### Instructions

Logon to the Arch linux machine or VM before running the following commands.

#### 1. Create the package repository

1. Create an account for yourself at https://aur.archlinux.org/
2. Upload your SSH public key to your account. If you don't have a SSH key already, you can create one using `ssh-keygen -t rsa -b 4096 -C "<email_address>"`
3. Create your repository using `git clone ssh://aur@aur.archlinux.org/<package_name>-bin.git`. AUR uses the `<package_name>-bin` convention to denote that the package installs a binary directly rather than building one.

#### 2. Create the build description.

To create the `PKGBUILD` and `.SRCINFO` files, assuming you have installed `cargo-aur` as detailed in the pre-requisites section, run the following command in the folder containing your source code:

```shell
cargo aur
```

This should generate two files: a `PKGBUILD` file and a tarball, `<package_name>-<version>-<architecture>.tar.gz`.  Copy these files to the `<package_name>-bin` git folder created in the previous step.

#### 3. Upload the tarball

1. If you use GitHub or GitLab for hosting your source code, make sure there exists a release for your package or create a new release.
2. Upload the tarball created in the second step to the assets section of the GitHub release. You can use the GitHub UI to upload the asset.
3. If you're interested in a command line tool to upload assets, checkout the [github-upload-asset](https://github.com/manojkarthick/github-upload-asset) tool that I created for this purpose.

```shell
github-upload-asset --owner <username> --repo <package_name> --release-tag "<tag>" --asset-path <path/to/tarball>
```

#### 4. Generating the package metadata

Metadata about the package is contained in a file named `.SRCINFO`. To generate this file, navigate the AUR repository folder run:

```shell
makepkg --printsrcinfo > .SRCINFO
```


#### 5. Verify if the package builds

1. Run the following commond in the root folder of the repository to check if the package build successfully

```shell
makepkg
```
2. If the build succeeded, you should see something like:

```shell
==> Finished making: <package_name> <version> (<time>)
```
3. Also, a `pkg/<package_name>` folder would have been created. You can find the actual binary of the package inside that folder. Run the application to see if it works as expected!

#### 6. Push the build description to the AUR

Stage, commit and push the `PKGBUILD` and `.SRCINFO` files to the repository.
```shell
git add PKGBUILD .SRCINFO
git commit -m "Released version: <version_name>"
git push origin master
```
You can now use an AUR helper of your choice such as [yay](https://github.com/Jguer/yay) or [paru](https://github.com/Morganamilo/paru) to install the package.

```shell
yay -S <package_name>-bin
```

If you're interested in a real world example, check out Reddsaver, a command line tool I built to download media from Reddit.
1. [reddsaver](https://github.com/manojkarthick/reddsaver)
2. [reddsaver-bin](https://aur.archlinux.org/packages/reddsaver-bin/)

Cheers!

Updates
* 2021/09/05: Reorder instructions and update pre-requisites.
