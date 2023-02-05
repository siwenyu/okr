import Layout from '@/layout/index.vue'
const BasicDemo = {
  path: '/stock',
  component: Layout,
  meta: { title: '交易策略', icon: 'eye-open' },
  alwaysShow: true,
  hidden: false,
  children: [
    {
      path: 'strategy',
      component: () => import('@/views/stock/strategy/index.vue'),
      name: 'strategy',
      meta: { title: '策略' }
    }
  ]
}

export default BasicDemo
