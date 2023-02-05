<template>
    <div class="container">
      策略页面
      <div class="group">
        sadasd
      </div>
      <div class="detail">
        详情
      </div>
    </div>
  </template>
  
  <script setup>
  import errGif from '@/assets/401_images/401.gif'
  import {
    getStrategyList
  } from '@/api/stock';


  onMounted(async () => {
    const res = await getStrategyList();
    console.log(res);
  })
  
  const state = reactive({
    errGif: `${errGif  }?${  Date.now()}`,
    ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
    dialogVisible: false
  })
  
  const route = useRoute()
  const router = useRouter()
  const back = () => {
    if (route.query.noGoBack) {
      router.push({ path: '/dashboard' })
    } else {
      router.go(-1)
    }
  }
  //导出属性到页面中使用
  const { ewizardClap, dialogVisible } = toRefs(state)
  </script>
  
  <style lang="scss" scoped>
  .container {
    max-width: 100%;
    margin: 20px auto;
  }
  </style>
  