import React from 'react';
import { Share2 } from 'lucide-react';
import { Share } from '@capacitor/share';
import { hapticFeedback } from '@/utils/haptics';
import { isNative } from '@/utils/platform';

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    text,
    url,
    className = '',
}) => {
    const handleShare = async () => {
        await hapticFeedback.light();

        if (isNative()) {
            try {
                await Share.share({
                    title,
                    text,
                    url,
                    dialogTitle: 'Partager',
                });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            // Web fallback
            if (typeof navigator !== 'undefined' && navigator.share) {
                try {
                    await navigator.share({ title, text, url });
                } catch (error) {
                    console.error('Web share error:', error);
                }
            } else {
                // Copy to clipboard fallback
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(url || text);
                    alert('Lien copié !');
                }
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors ${className}`}
        >
            <Share2 size={18} />
            <span className="text-sm font-medium">Partager</span>
        </button>
    );
};
