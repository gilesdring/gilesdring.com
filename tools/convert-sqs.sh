for src in _drafts/*.vto; do
    deno -A tools/convert-sqs.ts $src
done