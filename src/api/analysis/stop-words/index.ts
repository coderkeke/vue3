import {smartApi} from '@/http/request'

export interface StopWord {
    id: number
    word: string
    category: string
    description: string
    enabled: boolean
    createdTime: string
    updatedTime: string
}

export interface StopWordPageResult {
    data: StopWord[]
    page: number
    size: number
    total: number
    totalPages: number
}

export const getStopWordsPage = (params: { category?: string, keyword?: string, page?: number, size?: number }) => {
    return smartApi.get<StopWordPageResult>('/api/stopwords/page', { params })
}

export interface StopWordResponse<T> {
    data: T | null
    success: boolean
    message: string
}

export const addStopWordsBatch = (data: { words: string, category?: string, description?: string, enabled?: boolean }) => {
    return smartApi.post<StopWordResponse<StopWord[]>>('/api/stopwords/batch/quick/raw', data)
}

export const deleteStopWord = (id: number) => {
    return smartApi.delete<StopWordResponse<StopWord[]>>(`/api/stopwords/${id}`)
}

export const getStopWordsCategories = () => {
    return smartApi.get<StopWordResponse<string[]>>('/api/stopwords/categories')
}
