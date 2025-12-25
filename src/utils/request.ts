import axios from 'axios'
import { message } from 'ant-design-vue'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use environment variable or default to /api
  timeout: 5000,
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // Add token or other headers here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // Adjust this logic based on your actual API response structure
    if (res.code && res.code !== 200) {
      message.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('Response error:', error)
    message.error(error.message || 'Request failed')
    return Promise.reject(error)
  }
)

export default service
