import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Ticket, ShoppingBag, Users, TrendingUp, Shield } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
                        FootballHub+
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                        La plateforme tout-en-un pour gérer vos événements sportifs, vendre des billets et développer votre communauté
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link href="/auth/register">
                            <Button size="lg" className="text-lg px-8">
                                Commencer Gratuitement
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="outline" className="text-lg px-8">
                                Se Connecter
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Fonctionnalités Principales
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Calendar className="w-10 h-10" />}
                        title="Gestion d'Événements"
                        description="Créez et gérez vos matchs, tournois et entraînements en quelques clics"
                    />
                    <FeatureCard
                        icon={<Ticket className="w-10 h-10" />}
                        title="Billetterie Intelligente"
                        description="Vendez des billets avec QR codes sécurisés et validation en temps réel"
                    />
                    <FeatureCard
                        icon={<ShoppingBag className="w-10 h-10" />}
                        title="Boutique en Ligne"
                        description="Vendez vos maillots, accessoires et produits dérivés facilement"
                    />
                    <FeatureCard
                        icon={<Users className="w-10 h-10" />}
                        title="Gestion de Club"
                        description="Gérez vos membres, abonnements et communications internes"
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-10 h-10" />}
                        title="Analytics Avancés"
                        description="Suivez vos performances avec des tableaux de bord détaillés"
                    />
                    <FeatureCard
                        icon={<Shield className="w-10 h-10" />}
                        title="Sécurité Maximale"
                        description="Paiements sécurisés et protection des données garanties"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <Card className="glass border-2 border-green-200 dark:border-green-800">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl md:text-4xl mb-4">
                            Prêt à transformer votre club ?
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Rejoignez des centaines de clubs qui utilisent déjà FootballHub+
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Link href="/auth/register">
                            <Button size="lg" className="text-lg px-12">
                                Démarrer Maintenant
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </CardContent>
        </Card>
    )
}
