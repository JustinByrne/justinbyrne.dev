---
title: How to install Postman on Pop OS
slug: how-to-install-postman-on-pop-os
author: Justin Byrne
type: post
date: 2023-03-11T16:00:00.000Z
tags: linux, ubuntu, api, postman
---

Pop OS by default doesn't support snap. So, using the normal route of installing Postman with snap is not so simple. However, it can be as simple as downloading the tarball and adding a file.

Pop OS by default doesn't support snap. So, using the normal route of installing Postman with snap is not so simple. However, it can be as simple as downloading the tarball and adding a file.

## Downloading Postman

Firstly head over to the Postman download page [https://www.postman.com/downloads](https://www.postman.com/downloads) and grab the latest copy of the software. Downloading the Linux (x64) copy will produce a file named postman-linux-x64.tar.gz. Download this to the Downloads folder just to make it easier later.

## Extracting Postman

With the latest version of Postman downloaded. It needs to be moved somewhere that will be accessible by all users. Run the following it will unzip Postman into the `/opt` directory. This command will not output on screen. However, if you want that you can use `-xvzf` instead of `-xzf`.

```sh
sudo tar -xzf ~/Downloads/postman-linux-x64.tar.gz -C /opt
```

## Adding Postman to the launcher

Postman is now on the system but not yet accessible in the launcher. To add it to the launcher a new `.desktop` file needs to be created. The file can be created with the following command.

```sh
sudo nano /usr/share/applications/Postman.desktop
```

Add the following contents to the file and then save.

```
[Desktop Entry]
Encoding=UTF-8
Name=Postman
Exec=/opt/Postman/app/Postman %U
Icon=/opt/Postman/app/resources/app/assets/icon.png
Terminal=false
Type=Application
Categories=Development;
```

Hitting the super key and searching for postman will show the application in the list with the icon.