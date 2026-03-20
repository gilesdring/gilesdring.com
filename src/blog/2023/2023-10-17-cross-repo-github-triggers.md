---
title: Cross-repository GitHub Action triggers
description: |
  I've recently been using GitHub actions to automate data pipelines and build static sites.
  Something that's quite useful to be able to do is trigger one job when another has finished.
  Find out how to build efficient cross-repository action triggers.
categories:
  - software
  - code
  - automation
---

I've recently been using GitHub actions to automate data pipelines and build static sites.
Something that's quite useful to be able to do is trigger one job when another has finished.

This is quite simple to achieve when both jobs are in the same repository. Assume this is in the pipeline for a workflow we want to run after another workflow finishes.

```yaml
name: Second Workflow

"on":
  workflow_run:
    workflows: ["First Workflow"]
    types:
      - completed

```

The [`workflow_run` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run)
means that when **First Workflow** completes, **Second Workflow** will run.

It's a bit more complicated when the two workflows are in different repositories. In this case, we need to use the GitHub API to dispatch an event on the second repository.

## The `repository_dispatch` event

It's possible to initiate activity in a GitHub repository with the [`repository_dispatch` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch).
This event can be raised by a [GitHub API call to the `dispatches` endpoint](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-dispatch-event).
In our case, we'll use a step of another workflow in another action to call the API.

This needs a GitHub personal access token provided in the Authorization header.
You'll also need to target the repo which contains the job that you want to run by altering the API endpoint.

```sh
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${OWNER}/${REPO}/dispatches \
  -d '{"event_type":"trigger_workflow_two"}'
```

The other important part is the payload, and particularly the `event_type`.
In the example above I've set the value of `event_type` to `trigger_workflow_two`.
In theory, we could have a series of events being triggered, each of which would cause a different thing to happen.

We intercept this specific event type by adding the following trigger to the workflow.

```yaml
name: Second Workflow

"on":
  repository_dispatch:
    types:
      - trigger_workflow_two
```

Now, whenever we initiate a `repository_dispatch` event with the `event_type` of `trigger_workflow_two`,
this job should run.

{{ echo |> md }}
> __NB__ This could cause a large number of in-flight jobs to be triggered.
> As a bonus, we could set the [`concurrency` key](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#concurrency) in the targetted job,
> which will stop any in-flight jobs if another one is started.
>
> ```yaml
> # Cancel any in-flight jobs
> concurrency:
>   group: ${{ github.ref }}
>   cancel-in-progress: true
> ```
{{ /echo }}

## Trigger step

Having got the repo to respond to the `repository_dispatch` event, we need to call that from within our repository.

We could use the Curl code as above.
In my case, I'm triggering from within a repo which already contains a reasonable amount of Python,
so I've created a small trigger script.

```py
TOKEN = os.environ.get('TRIGGER_TOKEN')
OWNER = os.environ.get('TRIGGER_ORG')
REPO = os.environ.get('TRIGGER_REPO')

r = requests.post(
    f"https://api.github.com/repos/{OWNER}/{REPO}/dispatches",
    headers={
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
    },
    data='{"event_type": "trigger_workflow_two"}'
)
```

> **NB** This webhook should return an **HTTP 204 No Content** return code. If you want to be sure, check the response.
> You can do this with `requests` as follows:
> ```py
> if r.status_code != requests.codes.no_content:
>     raise Exception('Unexpected response from GitHub API')
> ```

This trigger can then be added to an workflow at an appropriate point.
In my case, I add this just after committing and pushing changes to the source repo.

{{ echo |> md }}
```yaml
  - name: Trigger
    id: trigger
    env:
      TRIGGER_TOKEN: ${{ secrets.TRIGGER_TOKEN }}
      TRIGGER_ORG: ...
      TRIGGER_REPO: ...
    run: python trigger.py
```
{{ /echo }}

## Conditional triggering

So far, so good, but what about situations where we don't always want to trigger the action.
My use case polls a series of data sources that update periodically, and then processes the files and checks them in to the git repo.

Thankfully, GitHub actions gives you the ability to conditionally run steps.

Firstly, we need to capture output of a step. In my case, I want to check how many files are changed in a given directory.
Appending to the `$GITHUB_OUTPUT` means you can refer to a variable later on.

```yaml
- name: Check for updates
  id: updated
  run: echo count="$(git status --short watchdir | wc -l)" >> $GITHUB_OUTPUT
```

This is then accessible as `steps.updated.outputs.count`, and can be used in a conditional step:

```yaml
- name: Conditional trigger
  id: conditional
  if: steps.updated.outputs.count > 0
  env:
    ...
  run: python trigger.py
```

So finally, we have a workflow that will kick off a workflow in a different repository
in the event that any files have changed during the course of this run.