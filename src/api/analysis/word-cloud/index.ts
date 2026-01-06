import { smartApi } from '@/http/request'

export interface WordCloudItem {
  keyword: string
  frequency: number
}

export interface Pagination {
  totalPages: number
  pageSize: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
  totalCount: number
  currentSize: number
}

export interface WordCloudPageResult {
  pagination: Pagination
  data: WordCloudItem[]
  success: boolean
  orderBy: string
  message: string
  minFrequency: number
  orderDir: string
  tableName: string
}

export interface WordCloudParams {
  minFrequency?: number
  orderBy?: string
  orderDir?: string
  page?: number
  size?: number
}

export const getWordCloudPage = (params: WordCloudParams) => {
  return smartApi.post<WordCloudPageResult>('/excel/dynamic/wordcloud/data/paged/raw', params)
}
