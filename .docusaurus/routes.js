import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'e0f'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'e59'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'dca'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '0f4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '765'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '97b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '0c2'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '513'),
    exact: true
  },
  {
    path: '/blog/1',
    component: ComponentCreator('/blog/1', '402'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '5f5'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '144'),
    exact: true
  },
  {
    path: '/blog/tags/backend',
    component: ComponentCreator('/blog/tags/backend', 'f14'),
    exact: true
  },
  {
    path: '/blog/tags/jacoco',
    component: ComponentCreator('/blog/tags/jacoco', 'a57'),
    exact: true
  },
  {
    path: '/blog/tags/java',
    component: ComponentCreator('/blog/tags/java', '180'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '716'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '562'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'ea5'),
    routes: [
      {
        path: '/docs/temp',
        component: ComponentCreator('/docs/temp', '2bc'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '4d9'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
