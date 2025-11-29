import '../styles/globals.css';
import { isRaptorMiniEnabled } from '../lib/featureFlags';

export const metadata = { title: 'Infomaniak-style Marketplace' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {isRaptorMiniEnabled && (
          <div className="w-full bg-indigo-600 text-white text-center py-2 text-sm">
            Raptor mini (Preview) activé pour tous les clients
          </div>
        )}
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
