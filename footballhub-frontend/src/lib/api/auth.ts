import apiClient from './client'
import type {
    User,
    LoginFormData,
    RegisterFormData,
    ApiResponse
} from '@/types'

export const authApi = {
    // Login
    login: async (data: LoginFormData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
        const response = await apiClient.post('/api/v1/auth/login', data)
        return response.data
    },

    // Register
    register: async (data: RegisterFormData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
        const response = await apiClient.post('/api/v1/auth/register', data)
        return response.data
    },

    // Get current user
    me: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get('/api/v1/auth/me')
        return response.data
    },

    // Logout
    logout: async (): Promise<void> => {
        await apiClient.post('/api/v1/auth/logout')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    },

    // Refresh token
    refresh: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
        const response = await apiClient.post('/api/v1/auth/refresh', { refreshToken })
        return response.data
    },

    // Forgot password
    forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.post('/api/v1/auth/forgot-password', { email })
        return response.data
    },

    // Reset password
    resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.post('/api/v1/auth/reset-password', { token, password })
        return response.data
    },
}
