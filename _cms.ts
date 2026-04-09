import lumeCMS from 'lume/cms/mod.ts';

const cms = lumeCMS();

// Configuration here

cms.collection({
  name: 'blog',
  store: 'src:blog/**/*.md',
  fields: [
    'title: text',
    { name: 'tags', type: 'list', view: 'detail' },
    { name: 'draft', type: 'checkbox', view: 'detail' },
    { name: 'description', type: 'textarea', view: 'detail'},
    'content: markdown',
  ],
  documentLabel(name) {
    console.log(name);
    return name.replace(/_/g, ' ').replace(/.md$/, '');
  },
  delete: false,
});

export default cms;
