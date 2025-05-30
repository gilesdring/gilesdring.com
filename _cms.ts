import lumeCMS from 'lume/cms/mod.ts';

const cms = lumeCMS();

// Configuration here

cms.collection({
  name: 'posts',
  store: 'src:blog/*.md',
  fields: [
    'title: text',
    { name: 'tags', type: 'list', view: 'detail' },
    'content: markdown',
  ],
  documentLabel(name) {
    console.log(name);
    return name.replace(/_/g, ' ').replace(/.md$/, '');
  },
  delete: false,
});

export default cms;
