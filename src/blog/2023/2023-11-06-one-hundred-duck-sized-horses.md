---
title: One hundred duck-sized horses
description: |
  I've been exploring the capabilities of DuckDB to query data from partitioned parquet files.
  This blog post collects some useful hints in getting this working with DuckDB-WASM for use in 
  client-side javascript.
categories:
  - software
  - data
  - data science
---


> [Would you rather fight 100 duck-sized horses or one horse-sized duck?](https://knowyourmeme.com/memes/horse-sized-duck)

I’ve recently been trying the capabilities of DuckDB to drive visualisations. There’s something quite astounding about writing SQL in client-side Javascript.
My current platform of choice is Svelte. I’ve come up with some patterns on using Duck within a Svelte app — to be written up another day.

Suffice it to say that the official [DuckDB WASM client setup guide](https://duckdb.org/docs/archive/0.9.1/api/wasm/instantiation) is a great start.
The basic pattern is to prepare parquet files with the data, and query those via DuckDB in the following format:

```sql
SELECT
  strftime(date, '%x') AS date,
  value
FROM ‘data.parquet’
WHERE code == ‘The Code’
ORDER BY date;
```

The only pre-requisite is that the parquet files need to be registered when the database connection is made:

```javascript
await db.registerFileURL(
  'data.parquet',
  'data.parquet',
  DuckDBDataProtocol.HTTP,
  false
);
```

So far, so good, but if the parquet files are large, it'd be nice to take advantage of partitioning to avoid shipping the entire file to the browser.
It's pretty easy to create a partitioned file using libraries such as pandas:

```python
df.to_parquet(path='data/', partition_cols=['variable'])
```

We now have a dataset partitioned by variable name, and can in theory write queries as follows:

```sql
SELECT
  strftime(date, '%x') AS date,
  value
FROM ‘data/**/*.parquet’
WHERE code == ‘The Code’
ORDER BY date;
```

The slight wrinkle is that you still need to register each file as before.
It appears that the DuckDB registerFileURL doesn't support wildcards, so each file has to be registered independently.
Having discovered, this, I decided that a manifest file would be a sensible way of dealing with the potentially very large number of files that needed to be registered.
A simple way to create this is using shell commands and `jq`.

```sh
find data/ -type f |\
  jq --raw-input --slurp 'split("\n")' > manifest.json
```

I then register each parquet file in the JSON array as follows:

```js
await Promise.all(
  manifest.map(p => db.registerFileURL(p, p, DuckDBDataProtocol.HTTP, false))
);
```

Here were the rough results for a simple test database that I set up.
This is running on my local network, so the impact on a slower network would be greater.
The whole database is 2.5 MB in a parquet file, which is already a massive saving from the source 18 MB CSV file.
It's worth noting that the subsequent calls were much faster.

 Measurement         | Monolithic parquet | Partitioned parquet
--------------------:|:------------------:|:--------------------:
Network transfers    | 11 requests        | 6 requests
Network payload      | 3.6 MB             | 81.3 kB
Time for first query | 659 ms             | 278 ms
For next query       | ~100 ms            | ~20 ms

Limitations I ran into, each of which could do with a bit more digging...

1. It seems that at least the libraries that I was using don't allow more than 1024 partitions to be created.
2. I tried using Brotli compression, but the DuckDB WASM library didn't seem to like it.
3. I sometimes / within some build systems, had to perform some manipulation of the url to prefix with the server URL.
