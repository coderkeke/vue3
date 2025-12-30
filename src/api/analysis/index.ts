import {excelApi} from '@/http/request'

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
    return excelApi.get<FilterData>('/excel/dynamic/db/all-columns-stats')
}

export interface ChartDataResponse {
    success: boolean
    stats: Array<{
        count: number
        [key: string]: string | number
    }>
}

export const getChartStats = (columnName: string, conditions?: Record<string, unknown>) => {
    return excelApi.post<ChartDataResponse>(`/excel/dynamic/db/column-stats`, {conditions, columnName})
}
