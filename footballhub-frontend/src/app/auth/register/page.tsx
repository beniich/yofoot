import { AuthForm } from '@/components/auth/AuthForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <AuthForm type="register" />
        </div>
    );
}
