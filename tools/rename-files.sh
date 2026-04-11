files=_drafts/*.html

for src in $files; do
    tgt=`echo $src | sed s/randomideaspike-thoughtrack-//g | sed s/.html$/.vto/g`
    mv $src $tgt
done