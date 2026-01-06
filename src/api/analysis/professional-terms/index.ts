import {smartApi} from '@/http/request'

export interface ProfessionalTerm {
    id: number
    term: string
    category: string
    description: string
    definition: string
    synonym: string
    enabled: boolean
    createdTime: string
    updatedTime: string
}

export interface ProfessionalTermPageResult {
    data: ProfessionalTerm[]
    page: number
    size: number
    total: number
    totalPages: number
}

export const getProfessionalTermsPage = (params: { category?: string, keyword?: string, page?: number, size?: number }) => {
    return smartApi.get<ProfessionalTermPageResult>('/api/professional-terms/page', { params })
}

export const addProfessionalTermsBatch = (params: { terms: string, category?: string, description?: string, enabled?: boolean }) => {
    return smartApi.post('/api/professional-terms/batch/quick', null, { params })
}

export const deleteProfessionalTerm = (id: number) => {
    return smartApi.delete(`/api/professional-terms/${id}`)
}
