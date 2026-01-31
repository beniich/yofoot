'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

const authSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
    username: z.string().min(3, 'Le nom d\'utilisateur doit faire au moins 3 caractères').optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
    type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser, setTokens } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        try {
            const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
            const response = await apiClient.post(endpoint, data);

            const { user, token } = response.data;

            if (token) {
                setTokens(token, ''); // Backend returns single token
            }

            if (user) {
                setUser(user);
            }

            toast.success(type === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !');
            router.push('/');
        } catch (error: any) {
            console.error('Auth error:', error);
            const message = error.response?.data?.message || 'Erreur d\'authentification';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {type === 'login' ? 'Bon retour !' : 'Rejoignez-nous'}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {type === 'login'
                        ? 'Connectez-vous à votre compte FootballHub+'
                        : 'Créez votre compte pour commencer'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="space-y-4">
                    {type === 'register' && (
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                {...register('username')}
                                placeholder="Nom d'utilisateur"
                                className="pl-10"
                                error={errors.username?.message}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="Email"
                            className="pl-10"
                            error={errors.email?.message}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="Mot de passe"
                            className="pl-10"
                            error={errors.password?.message}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Chargement...
                        </>
                    ) : (
                        type === 'login' ? 'Se Connecter' : 'S\'inscrire'
                    )}
                </Button>
            </form>

            <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-400">
                    {type === 'login' ? (
                        <>
                            Pas encore de compte ?{' '}
                            <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
                                S'inscrire
                            </Link>
                        </>
                    ) : (
                        <>
                            Déjà un compte ?{' '}
                            <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
                                Se connecter
                            </Link>
                        </>
                    )}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => {
                            setUser({
                                id: 'demo-user',
                                username: 'Demo User',
                                email: 'demo@footballhub.ma',
                                role: 'user',
                                active: true,
                                preferences: {
                                    theme: 'system',
                                    notifications: true
                                },
                                createdAt: new Date().toISOString()
                            });
                            setTokens('demo-token', 'demo-refresh-token');
                            toast.success('Mode Démo activé !');
                            router.push('/');
                        }}
                    >
                        🚀 Accéder en Mode Démo
                    </Button>
                </div>
            </div>
        </div>
    );
}
