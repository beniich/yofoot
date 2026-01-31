import React, { useEffect, useState } from 'react';
import { isIOS, isNative } from '@/utils/platform';

interface SafeAreaProps {
    children: React.ReactNode;
    className?: string;
}

export const SafeArea: React.FC<SafeAreaProps> = ({ children, className = '' }) => {
    const [safeArea, setSafeArea] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    useEffect(() => {
        if (isIOS() && isNative()) {
            // iOS has notch/home indicator
            setSafeArea({
                top: 44, // Status bar height
                right: 0,
                bottom: 34, // Home indicator height
                left: 0,
            });
        }
    }, []);

    return (
        <div
            className={className}
            style={{
                paddingTop: safeArea.top,
                paddingRight: safeArea.right,
                paddingBottom: safeArea.bottom,
                paddingLeft: safeArea.left,
            }}
        >
            {children}
        </div>
    );
};
