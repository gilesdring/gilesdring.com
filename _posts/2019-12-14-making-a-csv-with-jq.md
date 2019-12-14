---
layout: post
title: Making a CSV with jq
date: 2019-12-14T08:15:21.270Z
tags:
  - hint tech
---
I’m finding [jq](https://stedolan.github.io/jq/) to be a really useful tool for dealing with JSON formatted data.

I came across [this Stackoverflow answer](https://stackoverflow.com/questions/32960857/how-to-convert-arbitrary-simple-json-to-csv-using-jq#32965227) for creating a CSV from any array of JSON objects.

```
jq -r '
(map(keys) | add | unique) as $cols |
map(. as $row | $cols | map($row[.])) as $rows |
$cols, $rows[] | @csv'
```
