import {smartApi} from '@/http/request'

export interface FilterOption {
    count: number

    [key: string]: string | number
}

export interface FilterData {
    allColumnCount: number
    success: boolean
    allColumns: string[]
    groupColumns: string[]
    groupColumnCount: number
    columnStats: Record<string, FilterOption[]>
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

export const getTableData = (params: { conditions?: string, limit?: number, offset?: number }) => {
    return smartApi.post<TableDataResponse>('/excel/dynamic/db/table-data', params)
}

export const uploadExcelFile = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return smartApi.post('/excel/dynamic/db/upload-and-sqlite', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
