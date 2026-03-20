---
title: Kitchen sync
categories:
  - tools
  - automation
description: |
  Automatically building and deploying a static website made simple. A few useful tips and pointers concerning use of `rsync` in a secure way, and dealing with differing user identities.
---

In my work with [Open Innovations](https://open-innovations.org/) (and elsewhere), I frequently create static websites. These suit the work as they don't take a lot of hosting. Most of the production sites are hosted on GitHub Pages which works really well, certainly for production sites. A slight drawback is the inability to password-protect pages and the quite reasonable limitation of one GitHub Pages site per repo.
Recently the sites have been getting more complex, with longer-running development processes. I decided that it was time to host a __dev__ version. Luckily, OI has a cloud server running Apache, so all I needed to do was upload the result of the built site to an appropriate directory.

In my goal of automating all the things, I wanted to make this happen whenever anyone pushed to the `dev` branch in the repository.
It's pretty simple to [trigger a workflow on a push to a specific branch](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-including-branches-and-tags).
The question was what to run to transfer the files.

The answer to this question is `rsync`, which you can read all about on the [Wikipedia page for `rsync`](https://en.wikipedia.org/wiki/Rsync). In short, this venerable tool allows files to be transferred and synchronised over connection protocols such as SSH.

Building the actions pipeline now has the following stages

1. Build site using the site builder into the build folder. In my case, this the builder is [`lume`](https://lume.land/), which deposits the compiled site in `_site`.
2. Use `rsync` to transfer the build folder to the dev host.

Step 1 is easy enough, and in any case out of scope of this post! Step 2 needs a bit of careful thought.

The basic incantation is

```bash
rsync --recursive --delete $SOURCE_PATH $SSH_HOST:$SSH_PATH
```

This recurses through the source path, uploading any new or changed files, and deleting any orphans. The source path should end in a `/` to avoid including the directory itself! Using environment variables `SOURCE_PATH`, `SSH_HOST` and `SSH_PATH` means that the configuration can be altered and used in multiple potential targets, which could be useful.
You can [set environment variables in GitHub workflows](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#env).

When using `rsync` interactively, it's usual to run as a personal user account, in which case SSH credentials (keys, etc) are likely to be set up.
It's not, however, a great idea to use a personal user in an automated pipeline, so I created a locked down __bot__ user.
Passing credentials into a GitHub actions environment is also slightly fiddly.
It's theoretically possible to setup SSH keys and a config file, but `rsync` allows a slightly easier setup, by providing the `--rsh` option. This allows exact specification of the remote shell command.

```bash
rsync ... \
  --rsh="sshpass -e ssh -o StrictHostKeyChecking=no -l $SSH_USER" \
  ...
```

This allows the SSH password to be provided in the `SSHPASS` environment variable (managed via the [`sshpass -e`](https://www.redhat.com/sysadmin/ssh-automation-sshpass) command).
It also specifies the user to connect with (`SSH_USER`) and allows overriding other `ssh` options such as `StrictHostKeyChecking`.

So now we have a working sync command which signs in as our bot user. All is not well, however, as the files and directories are owned by the bot user.
Given these are web content, we'd ideally like them to be owned by the `www-data` user with a group ownership of `www-data`.
Thankfully here can provide another option `--rsync-path` which defines the command that is run in the shell created by the connection.

```bash
rsync ... \
  --rsync-path="sudo -u www-data rsync" \
  ...
```

This will run the remote rsync command as the user `www-data`, meaning that the files are written with appropriate ownership and permissions.

The cherry on the cake is specifying a the `--info` flag to write a report on completion of the sync. The final command is:

```bash
rsync \
  --rsh="sshpass -e ssh -o StrictHostKeyChecking=no -l $SSH_USER" \
  --rsync-path="sudo -u www-data rsync" \
  --info=STATS2 --recursive --delete \
  $SOURCE_PATH $SSH_HOST:$SSH_PATH
```

Wrapping this up in a GitHub Actions script is fairly simple using the [actions file `run` directive](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun). Of course, it can also be packaged in another runner, such as `deno.json`, or as an NPM task. This is left as an exercise for the reader!

I hope that this has been helpful. I'm sure future me will also be thankful!