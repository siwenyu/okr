export default [
  {
    url: '/getMapInfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        title: 'mock请求测试'
      }
    }
  },
  {
    url: '/integration-front/errorCollection/selectPage',
    method: 'get',
    response: () => {
      return {
        code: 200,
        title: 'mock请求测试'
      }
    }
  }
]
