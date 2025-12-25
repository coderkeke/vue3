import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'ok',
        data: {
          name: 'Vue3 Admin',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          roles: ['admin'],
        },
      }
    },
  },
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 200,
        message: 'Login successful',
        data: {
          token: 'mock-token-123456',
          username: body.username,
        },
      }
    },
  },
] as MockMethod[]
