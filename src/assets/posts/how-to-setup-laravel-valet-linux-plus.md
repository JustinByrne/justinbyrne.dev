---
title: How to setup Laravel Valet Linux+
slug: how-to-setup-laravel-valet-linux-plus
author: Justin Byrne
type: post
date: 2023-07-09T16:00:00.000Z
---

Building laravel sites should be easy and using valet linux+ does just that. But, getting it installed and working may need some finessing.

Using Linux to develop a Laravel application is really fun, it allows for you to get as close to the production environment as possible. However, sometimes configuring the OS to have everything you need can be a bit daunting. To overcome this issue I use [Valet Linux+](https://valetlinux.plus/).

Valet Linux+ allows for a simple development environment to be setup with very little difficulty. To get it working very little is needed on the device to start, however, I will go over all that I add as a basic.

## Installing PHP and Composer

The main requirement that Valet Linux+ needs is PHP and Composer. At the point of writing this guide I am using PHP 8.2. I install all the following extensions, as I have found that they are all I need to develop my applications, but if you need more feel free to add them.

```sh
sudo apt install php8.2-cli php8.2-common php8.2-curl php8.2-fpm php8.2-gd php8.2-mbstring php8.2-mysql php8.2-opcache php8.2-readline php8.2-sqlite3 php8.2-xml php8.2-zip
```

This can take a little while as it is quite a few extensions, however, once it's done then they wont need to be touched again, hopefully. If those extensions are not available in your OS run the following to add the following repository.

```sh
sudo add-apt-repository ppa:ondrej/php
```

With PHP installed it's now time to install Composer. I will add a script on how to install it below, however, this is an example and should not be used, and the latest version should be got from the [Composer download](https://getcomposer.org/download/) page.

```sh
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ff031906575712edab6f13eb0b361f2085f1f1237b7126d785e826a450292b6cfd1d64d92e6563bbde02') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

This will get Composer installed however, before the global packages can be used the path needs to be added to the local $PATH variable. Running the following will add the global install path.

```sh
export PATH="$PATH:$HOME/.config/.composer/vendor/bin"
```

## Installing Valet Linux+

The last requirements that the system will need is a few OS packages these can be installed by running the following.

```sh
sudo apt-get install network-manager libnss3-tools jq xsel
```

Some of these may show as already being installed, but it's best to ensure that they all are before proceeding.

With all the requirements installed it's now time to get Valet Linux+ added to the system. Valet Linux+ is actually installed using composer with the following command.

```sh
composer global require genesisweb/valet-linux-plus
```

This will add the `valet` commands to the terminal allowing for the system to be setup and configured. The first command that needs to be ran is `valet install` this will go through and install all the software needed to develop. The last thing to do is to tell valet that the system is using php 8.2 with the following.

```sh
valet use 8.2
```

At this point Valet Linux+ is setup and you can start using it. I like to create a `~/sites` directory that I keep all my websites in. You can instruct valet to look at this folder and create all the config files every time a directory is creating in the folder.

```sh
cd ~/sites
valet park
```

This will now create a .test domain for each sub directory. For example if I create a `~/sites/justin-byrne` directory, valet will create a `justin-byrne.test` domain that I can access the site at.

The only other thing that I ever touch is the adding ssl to the site if I need a site that requires it. To enable ssl on a site I use the following command. The example is using the `justin-byrne.test` domain that was used earlier.

```sh
valet secure justin-byrne
```

This will also create a certificate for this site, this is great if you need to use it in a vite config for example. All certificates can be found in the valet directory.

```sh
~/.valet/Certificates
```

A `.conf`, `.crt`, `.csr` and a `.key` file will be created for the domain, named accordingly.