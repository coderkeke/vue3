import { MockMethod } from 'vite-plugin-mock'

export default [
  // 1. 模拟标准后端 (User Center)
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'ok',
        data: {
          name: 'Standard User',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          source: 'UserCenter (Standard)',
        },
      }
    },
  },
  
  // 2. 模拟老系统后端 (Legacy System)
  // 注意：结构完全不同 (ret, result)
  {
    url: '/api/legacy/orders',
    method: 'get',
    response: () => {
      return {
        ret: '0',
        message: 'Query Successful',
        result: [
          { id: 101, name: 'Legacy Order A', price: 99 },
          { id: 102, name: 'Legacy Order B', price: 199 },
        ],
      }
    },
  },

  // 模拟老系统失败情况
  {
    url: '/api/legacy/error',
    method: 'get',
    response: () => {
      return {
        ret: '1001', // 非0
        message: 'System Busy',
        result: null,
      }
    },
  },
] as MockMethod[]
