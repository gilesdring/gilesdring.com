task :validate do
  sh 'jekyll build; vnu --skip-non-html --errors-only _site/ > buildlog.txt 2>&1'
end
