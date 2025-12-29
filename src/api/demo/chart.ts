export interface ChartDataResult {
  date: string
  sales: number
  profit: number
  type: string
}

export const getChartData = () => {
  return new Promise<ChartDataResult[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { date: '2024-01-01', sales: 120, profit: 50, type: '电子产品' },
        { date: '2024-01-02', sales: 200, profit: 80, type: '电子产品' },
        { date: '2024-01-03', sales: 150, profit: 60, type: '电子产品' },
        { date: '2024-01-04', sales: 80, profit: 40, type: '电子产品' },
        { date: '2024-01-05', sales: 70, profit: 30, type: '电子产品' },
        { date: '2024-01-06', sales: 110, profit: 55, type: '电子产品' },
        { date: '2024-01-07', sales: 130, profit: 65, type: '电子产品' },
      ])
    }, 1000)
  })
}
