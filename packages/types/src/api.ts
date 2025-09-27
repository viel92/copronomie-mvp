export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, any>
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface FilterParams {
  search?: string
  status?: string[]
  type?: string[]
  dateFrom?: string
  dateTo?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}