import axiosReq from '@/utils/axios-req'

// 策略列表
export const getStrategyList = (data) => {
  return axiosReq({
    url: '/quant/subject',
    params: {
      body: {
        cmd:"QueryList",
        payload: {
          page_size: 5,
          page_num: 1,
          app_id: "trade"
        }
      },
    },
    method: 'post'
  })
}