import axios, { AxiosInstance, AxiosError } from 'axios'
import { toast } from 'sonner'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refreshToken')
                if (refreshToken) {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                        { refreshToken }
                    )

                    const { accessToken } = response.data
                    localStorage.setItem('accessToken', accessToken)

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return apiClient(originalRequest)
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/auth/login'
                return Promise.reject(refreshError)
            }
        }

        // Handle other errors
        const errorMessage =
            (error.response?.data as any)?.message ||
            error.message ||
            'Une erreur est survenue'

        toast.error(errorMessage)

        return Promise.reject(error)
    }
)

export default apiClient
