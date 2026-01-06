import {smartApi} from '@/http/request'

export interface FieldSummary {
    fieldName: string
    valueCount: number
    totalCount: number
    maxCount: number
}

export interface SummaryInfo {
    totalOccurrences: number
    fieldCount: number
    fieldSummaries: FieldSummary[]
    totalRecords: number
}

export interface GroupedStatItem {
    field_name: string
    field_value: string
    count: number
    created_time: string
    updated_time: string
}

export interface FilterData {
    summary: SummaryInfo
    fieldCount: number
    groupedStats: Record<string, GroupedStatItem[]>
    success: boolean
    totalStatsCount: number
    tableName: string
}

export const getFilterOptions = () => {
    return smartApi.get<FilterData>('/excel/dynamic/db/all-columns-stats')
}

export interface ChartDataResponse {
    success: boolean
    stats: Array<{
        count: number
        [key: string]: string | number
    }>
}

export const getChartStats = (columnName: string, conditionsMap?: Record<string, unknown>) => {
    return smartApi.post<ChartDataResponse>(`/excel/dynamic/db/column-stats`, {conditionsMap, columnName})
}

export interface PaginationInfo {
    offset: number
    limit: number
    totalPages: number
    hasPrevious: boolean
    hasNext: boolean
    currentPage: number
    totalCount: number
    currentSize: number
}

export interface TableDataResponse {
    pagination: PaginationInfo
    data: Record<string, unknown>[]
    success: boolean
    conditions: Record<string, unknown>
    conditionsFormat: string
    tableName: string
}

export const getTableData = (params: { conditions?: string, limit?: number, offset?: number; [key: string]: unknown }) => {
    return smartApi.post<TableDataResponse>('/excel/dynamic/db/table-data', params)
}

export const uploadExcelFile = (file: File, clearTable: boolean = false) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('clearTable', String(clearTable))
    return smartApi.post('/excel/dynamic/db/upload-and-sqlite-advanced', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 10 * 60 * 1000 // 10分钟超时
    })
}

export interface WordCloudItem {
    keyword: string
    frequency: number
}

export interface WordCloudResponse {
    success: boolean
    data: WordCloudItem[]
    totalFrequency: number
    maxFrequency: number
    minFrequency: number
    dataCount: number
    limit: number
    requestParams: {
        limit: number
        minFrequency: number
    }
    tableName: string
}

export const getWordCloudData = (limit: number = 1000, minFrequency: number = 2) => {
    return smartApi.post<WordCloudResponse>('/excel/dynamic/db/wordcloud/data', {
        limit,
        minFrequency
    })
}

// Stop Words API

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

export interface StopWordResponse {
    data: StopWord[] | null
    success: boolean
    message: string
}

export const addStopWordsBatch = (data: { words: string, category?: string, description?: string, enabled?: boolean }) => {
    return smartApi.post<StopWordResponse>('/api/stopwords/batch/quick/raw', data)
}

export const deleteStopWord = (id: number) => {
    return smartApi.delete<StopWordResponse>(`/api/stopwords/${id}`)
}

