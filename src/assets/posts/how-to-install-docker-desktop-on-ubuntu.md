---
title: How to install Docker Desktop on Ubuntu
slug: how-to-install-docker-desktop-on-ubuntu
author: Justin Byrne
type: post
date: '2023-12-02T16:00:00.000Z'
---

Using Docker can be brilliant especially when you are doing development work, which if you haven't noticed from my other posts that's what I tend to do. However, I came across issues when setting up my new install and thought that it would be worth sharing my experience.

## Install the Docker repository

To start, the installation follows the standard Docker documentation of adding the Docker repository. The following command was taken from the documentation, and was valid at the time of writing, if for whatever reason it is not working I would suggest that you refer back to the [docs](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository).

```sh
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

With the repository added to the system the `.deb` file can now be downloaded, the following command will download `v4.25.2` this may no longer be the current version and the latest one can be found at the Docker Desktop download [page](https://www.docker.com/products/docker-desktop/).

```sh
wget https://desktop.docker.com/linux/main/amd64/docker-desktop-4.25.2-amd64.deb
```

*Please check for latest version if this command doesn't work*

Unlike a usual `.deb` file this one is not to be ran with the GUI, but should be installed via the command line, using apt. This will ensure that all dependencies are downloaded at the same time.

```sh
sudo apt-get update
sudo apt-get install ./docker-desktop-4.25.2-amd64.deb
```

*The docker desktop file name should be changed to match downloaded file*

With this done Docker Desktop is technically installed and will work. However, I ran into an issue which after some searching lots of other people seemed to also have. This was that I couldn't sign in or stayed signed in, there were times were the app would sign me out straight after sign in, or it would provide the below error.

`ERROR: failed to solve: error getting credentials - err: exit status 1`

I found that this was because the ~/.docker/config.json file either wasn't set correctly. To prevent the same from happening to you, you can follow the below to use pass to manage the Docker credentials.

If you're not wanting to sign in to Docker Desktop then feel free to skip down to the [Starting Docker Desktop](#starting-docker-desktop) section.

## Install the Docker Pass Credential Helper

To make sure that Docker can use pass to manage the user credentials an extra helper is needed to be installed, the following command will install it.

```sh
sudo apt install golang-docker-credential-helpers
```

With that done a config file can be created to tell Docker to use the pass credential helper. Running the following command will edit the `config.json` file in the users `.docker` directory.

```sh
nano ~/.docker/config.json
```

If this is a fresh install of Docker Desktop then the file contents can be replaced with the following, otherwise just the `credsStore` attribute needs to be changed to pass

```json
{
	"credsStore": "pass"
}
```

## Setup Pass

Pass is an easy way to store credentials securely on your machine without keeping them in plain text. Moving forward I will assume that you already have a GPG key, if that is not the case [GitHub](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key) have a very good page explaining how to create one.

Running the following command will list all the GPG keys.

```sh
gpg --list-keys
```

Copy the id of the public key that you want to use to protect your pass credential store. Then the store can be initialised by running the following command.

```sh
pass init <public-key-id>
```

You will then be prompted to enter your password for the GPG key for confirmation.

## Login to Docker

Docker can now be logged into, however, instead of using the desktop application for the moment the best idea is to use the cli still. The following command will prompt for both your DockerHub username and password.

```sh
docker login
```

If you have two factor authentication enabled then you need to use a Personal Access Token. If you don't have one of these then the following article from the [Docker blog](https://www.docker.com/blog/docker-hub-new-personal-access-tokens/) will explain how to get one.

At the end of the login you may be prompted to enter your GPG password to store the details.

## Starting Docker Desktop

Docker Desktop can now be started from the applications menu, or can be set to start on startup and started with the following commands.

```sh
systemctl --user enable docker-desktop
systemctl --user start docker-desktop
```

That's it! Docker Desktop should now be installed and when you open it you will be signed in straight away.