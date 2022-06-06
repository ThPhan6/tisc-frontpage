export default [
  {
    path: '/',
    component: './LandingPage',
    layout: false,
  },
  {
    path: '/reset-password',
    component: './LandingPage',
    layout: false,
  },
  {
    path: '/profiles',
    component: './ProfilesPage',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/products',
    name: 'PRODUCTS',
    icon: 'smile',
    routes: [
      {
        path: '/products/categories',
        name: 'Categories',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/products/basis',
        name: 'Basis',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/products/attributes',
        name: 'Attributes',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/products/configurations',
        name: 'Configurations',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  // {
  //   path: '/',
  //   redirect: '/welcome',
  // },
  {
    component: './404',
  },
];
