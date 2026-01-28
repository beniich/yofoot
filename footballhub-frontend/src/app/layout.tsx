import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'FootballHub+ | Plateforme de Gestion d\'Événements Sportifs',
    description: 'Gérez vos événements sportifs, billets, boutique et bien plus encore',
    keywords: 'football, événements, billets, QR code, boutique, clubs',
    authors: [{ name: 'FootballHub Team' }],
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#22c55e',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
