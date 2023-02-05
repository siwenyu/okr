import { createRouter, createWebHashHistory } from 'vue-router'
import basicDemo from './modules/basic-demo'
import config from './modules/config';
import stock from './modules/stock'


import Layout from '@/layout/index.vue'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  stock,
  {
    path: '/',
    component: Layout,
    redirect: '/basic-demo/g61',
  },
  basicDemo,
  ...config,
  
]

//角色和code数组动态路由
export const roleCodeRoutes = [
  {
    path: '/roles-codes',
    component: Layout,
    redirect: '/roles-codes/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/roles-codes/index.vue'),
        name: 'RolesCodes',
        meta: { title: 'Permission Switch' }
      },
      {
        path: 'roleIndex',
        component: () => import('@/views/roles-codes/role-index.vue'),
        name: 'RoleIndex',
        meta: { title: 'Role Index', roles: ['admin'] }
      },
      {
        path: 'code-index',
        component: () => import('@/views/roles-codes/code-index.vue'),
        name: 'CodeIndex',
        meta: { title: 'Code Index', code: 16 }
      },
      {
        path: 'button-permission',
        component: () => import('@/views/roles-codes/button-permission.vue'),
        name: 'ButtonPermission',
        meta: { title: 'Button Permission' }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '/:catchAll(.*)', name: 'CatchAll', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router
