export interface TableItem {
  id: string
  name: string
  age: number
  address: string
  status: 'active' | 'inactive' | 'pending'
  role: string
  createTime: string
}

export interface TableParams {
  name?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface TableResult {
  list: TableItem[]
  total: number
}

// 模拟数据列表
const mockList: TableItem[] = Array.from({ length: 100 }).map((_, index) => {
  return {
    id: `${index + 1}`,
    name: `User ${index + 1}`,
    age: 20 + (index % 30),
    address: `Street ${index + 1}, City`,
    status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'inactive' : 'pending',
    role: index % 2 === 0 ? 'Admin' : 'User',
    createTime: new Date().toLocaleString(),
  }
})

// 模拟接口请求
export const getTableList = (params: TableParams): Promise<TableResult> => {
  console.log('API Request Params:', params)
  return new Promise((resolve) => {
    setTimeout(() => {
      const { name, status, page = 1, pageSize = 10 } = params
      
      let list = [...mockList]

      // 模拟筛选
      if (name) {
        list = list.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))
      }
      if (status) {
        list = list.filter((item) => item.status === status)
      }

      const total = list.length
      
      // 模拟分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      list = list.slice(start, end)

      resolve({
        list,
        total,
      })
    }, 500)
  })
}
