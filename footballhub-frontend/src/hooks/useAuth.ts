'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { LoginFormData, RegisterFormData } from '@/types'

export function useAuth() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { user, setUser, setTokens, logout: logoutStore, isAuthenticated } = useAuthStore()

    // Get current user
    const { data: currentUser, isLoading } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            const response = await authApi.me()
            return response.data
        },
        enabled: isAuthenticated && !user,
        retry: false,
    })

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (data: LoginFormData) => authApi.login(data),
        onSuccess: (response) => {
            if (response.data) {
                const { user, accessToken, refreshToken } = response.data
                setUser(user)
                setTokens(accessToken, refreshToken)
                toast.success('Connexion réussie !')
                router.push('/dashboard')
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur de connexion')
        },
    })

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: (data: RegisterFormData) => authApi.register(data),
        onSuccess: (response) => {
            if (response.data) {
                const { user, accessToken, refreshToken } = response.data
                setUser(user)
                setTokens(accessToken, refreshToken)
                toast.success('Inscription réussie !')
                router.push('/dashboard')
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur d\'inscription')
        },
    })

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            logoutStore()
            queryClient.clear()
            toast.success('Déconnexion réussie')
            router.push('/')
        },
    })

    // Forgot password mutation
    const forgotPasswordMutation = useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
        onSuccess: () => {
            toast.success('Email de réinitialisation envoyé !')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi')
        },
    })

    return {
        user: user || currentUser,
        isAuthenticated,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,

        // Actions
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        forgotPassword: forgotPasswordMutation.mutate,

        // Mutation states
        isLoginLoading: loginMutation.isPending,
        isRegisterLoading: registerMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
        isForgotPasswordLoading: forgotPasswordMutation.isPending,
    }
}
